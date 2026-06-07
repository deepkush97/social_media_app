import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ILike } from '@app/shared/interfaces/like/like.interface';
import { IFollowUnfollow } from '@app/shared/interfaces/social/follow-unfollow.interface';
import { IFollowerFollowingCount } from '@app/shared/interfaces/social/follower-following-count.interface';
import { IPostRecommendationItem } from '@app/shared/interfaces/social/post-recommendation.interface';
import { IUserRecommendationItem } from '@app/shared/interfaces/social/user-recommendation.interface';
import { Neo4jService } from '@app/shared/neo4j/neo4j.service';
import { toInt } from '@app/shared/utils/to-int';

import { LikeEntity } from './like.entity';
import { LikeInput } from './like.input';

@Injectable()
export class SocialService implements OnModuleInit {
  constructor(
    private readonly neo4jService: Neo4jService,
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.neo4jService.executeWrite(async (tx) => {
      await tx.run(`
        CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE
      `);
      await tx.run(`
        CREATE CONSTRAINT IF NOT EXISTS FOR (p:Post) REQUIRE p.id IS UNIQUE
      `);
      await tx.run(`
        CREATE CONSTRAINT IF NOT EXISTS FOR (t:Tag) REQUIRE t.name IS UNIQUE
      `);
      await tx.run(`
        CREATE INDEX IF NOT EXISTS FOR ()-[r:FOLLOWS]->() ON (r.weight)
      `);
      await tx.run(`
        CREATE INDEX IF NOT EXISTS FOR ()-[r:FOLLOWS]->() ON (r.lastInteractionAt)
      `);
      await tx.run(`
        CREATE INDEX IF NOT EXISTS FOR ()-[r:INTERESTED_IN]->() ON (r.weight)
      `);
      await tx.run(`
        CREATE INDEX IF NOT EXISTS FOR (p:Post) ON (p.writtenAt)
      `);
    }, SocialService.name);
  }

  async follow({
    followerId,
    followingId,
    source,
  }: IFollowUnfollow): Promise<IFollowerFollowingCount> {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    return this.neo4jService.executeWrite(async (tx) => {
      const result = await tx.run(
        `
        MERGE (u1:User {id: $followerId})
        MERGE (u2:User {id: $followingId})
        MERGE (u1)-[r:FOLLOWS]->(u2)
        ON CREATE SET r.weight = 1.0,
                      r.createdAt = datetime(),
                      r.source = $source,
                      r.interactions = 0

        WITH u2
        RETURN
        COUNT { (u2)<-[:FOLLOWS]-() } AS followers,
        COUNT { (u2)-[:FOLLOWS]->() } AS followings
        `,
        { followerId, followingId, source: source ?? 'profile' },
      );

      const record = result.records?.[0];

      if (!record) {
        throw new Error('Not a valid user');
      }

      return {
        followers: record.get('followers').toNumber(),
        followings: record.get('followings').toNumber(),
      };
    }, SocialService.name);
  }

  async boostFollowWeight(
    followerId: number,
    followingId: number,
    weightIncrement: number,
  ): Promise<void> {
    await this.neo4jService.executeWrite(async (tx) => {
      await tx.run(
        `
        MATCH (u1:User {id: $followerId})-[r:FOLLOWS]->(u2:User {id: $followingId})
        SET r.interactions = COALESCE(r.interactions, 0) + 1,
            r.weight = COALESCE(r.weight, 1.0) + $weightIncrement,
            r.lastInteractionAt = datetime()
        `,
        { followerId, followingId, weightIncrement },
      );
    }, SocialService.name);
  }

  async boostTagWeight(userId: number, tags: string[], weightIncrement: number): Promise<void> {
    if (!tags.length) return;

    await this.neo4jService.executeWrite(async (tx) => {
      await tx.run(
        `
        UNWIND $tags AS tag
        MERGE (u:User {id: $userId})
        MERGE (t:Tag {name: tag})
        MERGE (u)-[r:INTERESTED_IN]->(t)
        ON CREATE SET r.weight = $weightIncrement,
                      r.createdAt = datetime()
        ON MATCH SET r.weight = COALESCE(r.weight, 0) + $weightIncrement
        `,
        { userId, tags, weightIncrement },
      );
    }, SocialService.name);
  }

  async trackPostCreation(
    userId: number,
    postId: number,
    tags: string[],
    writtenAt?: string,
  ): Promise<void> {
    await this.neo4jService.executeWrite(async (tx) => {
      await tx.run(
        `
        MERGE (u:User {id: $userId})
        MERGE (p:Post {id: $postId})
        ON CREATE SET p.writtenAt = datetime($writtenAt)
        MERGE (u)-[:CREATED]->(p)
        WITH u, p
        UNWIND $tags AS tag
        MERGE (t:Tag {name: tag})
        MERGE (p)-[:TAGGED {weight: 1.0}]->(t)
        `,
        { userId, postId, tags, writtenAt },
      );
    }, SocialService.name);
  }

  async getFeed(
    userId: number,
    limit: number,
    offset = 0,
  ): Promise<{ items: IPostRecommendationItem[]; total: number }> {
    const fetchMultiplier = 3;
    const blendRatio = 5;
    const fetchSize = limit * fetchMultiplier;

    const query = `
      CALL {
        MATCH (me:User {id: $userId})-[:FOLLOWS]->(author:User)-[:CREATED]->(post:Post)
        RETURN post.id AS postId, 1.0 AS score, post.writtenAt AS writtenAt
        UNION
        MATCH (me:User {id: $userId})-[interest:INTERESTED_IN]->(tag:Tag)<-[:TAGGED]-(post:Post)<-[:CREATED]-(author:User)
        WHERE NOT (me)-[:FOLLOWS]->(author)
        RETURN post.id AS postId, 0.5 * interest.weight AS score, null AS writtenAt
      }
      WITH postId, max(score) AS score, max(writtenAt) AS writtenAt
      ORDER BY score DESC, writtenAt DESC
    `;

    const { items: allItems, total } = await this.neo4jService.executeRead(async (tx) => {
      const itemsResult = await tx.run(
        `${query} RETURN postId, score SKIP toInteger($skip) LIMIT toInteger($limit)`,
        { userId, skip: 0, limit: fetchSize },
      );

      const countResult = await tx.run(`${query} RETURN count(postId) AS total`, {
        userId,
        skip: 0,
        limit: fetchSize,
      });

      const items = itemsResult.records.map((record) => ({
        postId: toInt(record.get('postId')),
        score: toInt(record.get('score')),
      }));

      const total = toInt(countResult.records[0]?.get('total')) ?? 0;

      return { items, total };
    }, SocialService.name);

    const followed: IPostRecommendationItem[] = [];
    const recommended: IPostRecommendationItem[] = [];

    for (const item of allItems) {
      if (item.score >= 1.0) {
        followed.push({ postId: item.postId, score: 1.0 });
      } else {
        recommended.push({ postId: item.postId, score: item.score });
      }
    }

    const blended = this.blend(followed, recommended, blendRatio);
    const items = blended.slice(offset, offset + limit);

    return { items, total };
  }

  private blend(
    followed: IPostRecommendationItem[],
    recommended: IPostRecommendationItem[],
    blendRatio: number,
  ): IPostRecommendationItem[] {
    const result: IPostRecommendationItem[] = [];
    let fi = 0;
    let ri = 0;

    while (fi < followed.length || ri < recommended.length) {
      for (let i = 0; i < blendRatio && fi < followed.length; i++) {
        result.push(followed[fi]);
        fi++;
      }

      if (ri < recommended.length) {
        result.push(recommended[ri]);
        ri++;
      }
    }

    return result;
  }

  async postRecommendation(
    userId: number,
    limit: number,
    offset = 0,
  ): Promise<{ items: IPostRecommendationItem[]; total: number }> {
    const baseQuery = `
      CALL {
        MATCH (me:User {id: $userId})-[:FOLLOWS]->(author:User)-[:CREATED]->(post:Post)
        RETURN post.id AS postId, 1.0 AS score
        UNION
        MATCH (me:User {id: $userId})-[interest:INTERESTED_IN]->(tag:Tag)<-[:TAGGED]-(post:Post)<-[:CREATED]-(author:User)
        WHERE NOT (me)-[:FOLLOWS]->(author)
        RETURN post.id AS postId, 0.5 * interest.weight AS score
      }
      WITH postId, max(score) AS score
      ORDER BY score DESC
    `;

    return this.neo4jService.executeRead(async (tx) => {
      const itemsResult = await tx.run(
        `${baseQuery} RETURN postId, score SKIP toInteger($offset) LIMIT toInteger($limit)`,
        { userId, limit, offset },
      );

      const countResult = await tx.run(`${baseQuery} RETURN count(postId) AS total`, {
        userId,
        limit,
        offset,
      });

      const items = itemsResult.records.map((record) => ({
        postId: toInt(record.get('postId')),
        score: toInt(record.get('score')),
      }));

      const total = toInt(countResult.records[0]?.get('total')) ?? 0;

      return { items, total };
    }, SocialService.name);
  }

  async userRecommendation(
    userId: number,
    limit: number,
    offset = 0,
  ): Promise<{ items: IUserRecommendationItem[]; total: number }> {
    const baseQuery = `
      CALL {
        MATCH (me:User {id: $userId})-[:FOLLOWS]->(friend:User)-[:FOLLOWS]->(suggested:User)
        WHERE NOT (me)-[:FOLLOWS]->(suggested) AND me <> suggested
        RETURN suggested.id AS userId, count(DISTINCT friend) AS commonFollowers, 0 AS likedPostsScore
        UNION
        MATCH (me:User {id: $userId})-[:LIKED]->(post:Post)<-[:CREATED]-(author:User)
        WHERE NOT (me)-[:FOLLOWS]->(author) AND me <> author
        RETURN author.id AS userId, 0 AS commonFollowers, count(DISTINCT post) AS likedPostsScore
      }
      WITH userId, sum(commonFollowers) AS commonFollowers, sum(likedPostsScore) AS likedPostsScore
    `;

    return this.neo4jService.executeRead(async (tx) => {
      const itemsResult = await tx.run(
        `${baseQuery} RETURN userId, commonFollowers, likedPostsScore, (commonFollowers + likedPostsScore) AS score ORDER BY score DESC SKIP toInteger($offset) LIMIT toInteger($limit)`,
        {
          userId,
          limit,
          offset,
        },
      );

      const countResult = await tx.run(`${baseQuery} RETURN count(userId) AS total`, {
        userId,
        limit,
        offset,
      });

      const items = itemsResult.records.map((record) => ({
        userId: toInt(record.get('userId')),
        commonFollowers: toInt(record.get('commonFollowers')),
        likedPostsScore: toInt(record.get('likedPostsScore')),
        score: toInt(record.get('score')),
      }));

      const total = toInt(countResult.records[0]?.get('total')) ?? 0;

      return { items, total };
    }, SocialService.name);
  }

  async unfollow({ followerId, followingId }: IFollowUnfollow): Promise<IFollowerFollowingCount> {
    if (followerId === followingId) {
      throw new Error('Cannot unfollow yourself');
    }

    return this.neo4jService.executeWrite(async (tx) => {
      const result = await tx.run(
        `
        MATCH (u1:User {id: $followerId})-[r:FOLLOWS]->(u2:User {id:$followingId})
        DELETE r

        WITH u2
        RETURN
        COUNT { (u2)<-[:FOLLOWS]-() } AS followers,
        COUNT { (u2)-[:FOLLOWS]->() } AS followings
        `,
        { followerId, followingId },
      );

      const record = result.records?.[0];

      if (!record) {
        throw new Error('Not a valid user');
      }

      return {
        followers: record.get('followers').toNumber(),
        followings: record.get('followings').toNumber(),
      };
    }, SocialService.name);
  }

  async userCounts(userId: number): Promise<IFollowerFollowingCount> {
    return this.neo4jService.executeWrite(async (tx) => {
      const result = await tx.run(
        `MERGE (u:User {id: $userId})
        RETURN
          COUNT { (u)<-[:FOLLOWS]-() } AS followers,
          COUNT { (u)-[:FOLLOWS]->() } AS followings
        `,
        { userId },
      );

      const record = result.records?.[0];

      if (!record) {
        throw new Error('Not a valid user');
      }

      return {
        followers: record.get('followers').toNumber(),
        followings: record.get('followings').toNumber(),
      };
    }, SocialService.name);
  }

  async like({ userId, postId }: LikeInput): Promise<ILike> {
    const existing = await this.likeRepository.findOne({
      where: { userId, postId },
      select: { id: true },
    });
    if (existing) {
      return existing;
    }

    const like = this.likeRepository.create({ userId, postId });
    const saved = await this.likeRepository.save(like);

    try {
      await this.neo4jService.executeWrite(async (tx) => {
        await tx.run(
          `
          MERGE (u:User {id: $userId})
          MERGE (p:Post {id: $postId})
          MERGE (u)-[r:LIKED]->(p)
          SET r.weight = 1.0,
              r.createdAt = datetime()
          `,
          { userId, postId },
        );
      }, SocialService.name);
    } catch {
      await this.likeRepository.delete(saved.id);
      throw new Error('Failed to sync like to Neo4j');
    }

    return saved;
  }

  async unlike({ userId, postId }: LikeInput): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { userId, postId },
      select: { id: true, userId: true, postId: true },
    });

    if (!like) {
      return true;
    }

    await this.likeRepository.delete({ userId, postId });

    try {
      await this.neo4jService.executeWrite(async (tx) => {
        await tx.run(
          `
            MATCH (u:User {id: $userId})-[r:LIKED]->(p:Post {id: $postId})
            DELETE r
            `,
          { userId, postId },
        );
      }, SocialService.name);
      return true;
    } catch (error) {
      await this.likeRepository.save(like);
      throw error;
    }
  }

  async likeCount(postId: number): Promise<number> {
    return this.likeRepository.count({ where: { postId } });
  }

  async hasLiked(userId: number, postId: number): Promise<boolean> {
    const count = await this.likeRepository.count({ where: { userId, postId } });
    return count > 0;
  }

  async removeLikeEdge(userId: number, postId: number): Promise<void> {
    await this.neo4jService.executeWrite(async (tx) => {
      await tx.run(
        `
        MATCH (u:User {id: $userId})-[r:LIKED]->(p:Post {id: $postId})
        DELETE r
        `,
        { userId, postId },
      );
    }, SocialService.name);
  }

  async createFollowEdge(followerId: number, followingId: number, source?: string): Promise<void> {
    if (followerId === followingId) return;

    await this.neo4jService.executeWrite(async (tx) => {
      await tx.run(
        `
        MERGE (u1:User {id: $followerId})
        MERGE (u2:User {id: $followingId})
        MERGE (u1)-[r:FOLLOWS]->(u2)
        ON CREATE SET r.weight = 1.0,
          r.createdAt = datetime(),
          r.source = $source,
          r.interactions = 0
        `,
        { followerId, followingId, source: source ?? 'feed' },
      );
    }, SocialService.name);
  }

  async removeFollowEdge(followerId: number, followingId: number): Promise<void> {
    if (followerId === followingId) return;

    await this.neo4jService.executeWrite(async (tx) => {
      await tx.run(
        `
        MATCH (u1:User {id: $followerId})-[r:FOLLOWS]->(u2:User {id: $followingId})
        DELETE r
        `,
        { followerId, followingId },
      );
    }, SocialService.name);
  }

  async ensureUserNode(userId: number): Promise<void> {
    await this.neo4jService.executeWrite(
      (tx) => tx.run('MERGE (u:User {id: $userId})', { userId }),
      SocialService.name,
    );
  }
}
