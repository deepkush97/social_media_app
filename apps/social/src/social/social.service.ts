import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Driver } from 'neo4j-driver';
import { Repository } from 'typeorm';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { ILike } from '@app/shared/interfaces/like/like.interface';
import { IFollowUnfollow } from '@app/shared/interfaces/social/follow-unfollow.interface';
import { IFollowerFollowingCount } from '@app/shared/interfaces/social/follower-following-count.interface';
import { IPostRecommendationItem } from '@app/shared/interfaces/social/post-recommendation.interface';
import { IUserRecommendationItem } from '@app/shared/interfaces/social/user-recommendation.interface';
import { NEO4J_DRIVER } from '@app/shared/providers.constant';

import { LikeEntity } from './like.entity';
import { LikeInput } from './like.input';

@Injectable()
export class SocialService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(NEO4J_DRIVER)
    private readonly neo4jDriver: Driver,
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
    private readonly logger: AppLoggerService,
  ) {}

  async onModuleInit(): Promise<void> {
    const session = this.neo4jDriver.session();
    try {
      await session.executeWrite((tx) =>
        tx.run(`
          CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE
        `),
      );
      await session.executeWrite((tx) =>
        tx.run(`
          CREATE CONSTRAINT IF NOT EXISTS FOR (p:Post) REQUIRE p.id IS UNIQUE
        `),
      );
      await session.executeWrite((tx) =>
        tx.run(`
          CREATE CONSTRAINT IF NOT EXISTS FOR (t:Tag) REQUIRE t.name IS UNIQUE
        `),
      );
    } catch (error) {
      this.logger.error('Failed to initialize Neo4j constraints', {
        error,
        context: SocialService.name,
      });
      throw error;
    } finally {
      await session.close();
    }
  }

  async follow({
    followerId,
    followingId,
    source,
  }: IFollowUnfollow): Promise<IFollowerFollowingCount> {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    const session = this.neo4jDriver.session();

    try {
      const counts = await session.executeWrite(async (tx) => {
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
      });

      return counts;
    } catch (error) {
      this.logger.error('Failed to follow user', {
        error,
        context: SocialService.name,
      });
      throw error;
    } finally {
      await session.close();
    }
  }

  async boostFollowWeight(
    followerId: number,
    followingId: number,
    weightIncrement: number,
  ): Promise<void> {
    const session = this.neo4jDriver.session();

    try {
      await session.executeWrite(async (tx) => {
        await tx.run(
          `
        MATCH (u1:User {id: $followerId})-[r:FOLLOWS]->(u2:User {id: $followingId})
        SET r.interactions = COALESCE(r.interactions, 0) + 1,
            r.weight = COALESCE(r.weight, 1.0) + $weightIncrement
        `,
          { followerId, followingId, weightIncrement },
        );
      });
    } catch (error) {
      this.logger.error('Failed to boost follow weight', {
        error,
        context: SocialService.name,
      });
      throw error;
    } finally {
      await session.close();
    }
  }

  async boostTagWeight(userId: number, tags: string[], weightIncrement: number): Promise<void> {
    if (!tags.length) return;

    const session = this.neo4jDriver.session();

    try {
      await session.executeWrite(async (tx) => {
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
      });
    } catch (error) {
      this.logger.error('Failed to boost tag weight', {
        error,
        context: SocialService.name,
      });
      throw error;
    } finally {
      await session.close();
    }
  }

  async trackPostCreation(userId: number, postId: number, tags: string[]): Promise<void> {
    const session = this.neo4jDriver.session();

    try {
      await session.executeWrite(async (tx) => {
        await tx.run(
          `
          MERGE (u:User {id: $userId})
          MERGE (p:Post {id: $postId})
          MERGE (u)-[:CREATED]->(p)
          WITH u, p
          UNWIND $tags AS tag
          MERGE (t:Tag {name: tag})
          MERGE (p)-[:TAGGED {weight: 1.0}]->(t)
          `,
          { userId, postId, tags },
        );
      });
    } catch (error) {
      this.logger.error('Failed to track post creation', {
        error,
        context: SocialService.name,
      });
      throw error;
    } finally {
      await session.close();
    }
  }

  async postRecommendation(
    userId: number,
    limit: number,
    offset = 0,
  ): Promise<{ items: IPostRecommendationItem[]; total: number }> {
    const session = this.neo4jDriver.session();

    try {
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

      const result = await session.executeRead(async (tx) => {
        const itemsResult = await tx.run(
          `${baseQuery} RETURN postId, score SKIP $offset LIMIT $limit`,
          { userId, limit, offset },
        );

        const countResult = await tx.run(`${baseQuery} RETURN count(postId) AS total`, {
          userId,
          limit,
          offset,
        });

        const items = itemsResult.records.map((record) => ({
          postId: record.get('postId').toNumber(),
          score: record.get('score').toNumber(),
        }));

        const total = countResult.records[0]?.get('total').toNumber() ?? 0;

        return { items, total };
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to get post recommendations', {
        error,
        context: SocialService.name,
      });
      throw error;
    } finally {
      await session.close();
    }
  }

  async userRecommendation(
    userId: number,
    limit: number,
    offset = 0,
  ): Promise<{ items: IUserRecommendationItem[]; total: number }> {
    const session = this.neo4jDriver.session();

    try {
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
        RETURN userId, commonFollowers, likedPostsScore, (commonFollowers + likedPostsScore) AS score
        ORDER BY score DESC
      `;

      const result = await session.executeRead(async (tx) => {
        const itemsResult = await tx.run(`${baseQuery} SKIP $offset LIMIT $limit`, {
          userId,
          limit,
          offset,
        });

        const countResult = await tx.run(`${baseQuery} RETURN count(userId) AS total`, {
          userId,
          limit,
          offset,
        });

        const items = itemsResult.records.map((record) => ({
          userId: record.get('userId').toNumber(),
          commonFollowers: record.get('commonFollowers').toNumber(),
          likedPostsScore: record.get('likedPostsScore').toNumber(),
          score: record.get('score').toNumber(),
        }));

        const total = countResult.records[0]?.get('total').toNumber() ?? 0;

        return { items, total };
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to get user recommendations', {
        error,
        context: SocialService.name,
      });
      throw error;
    } finally {
      await session.close();
    }
  }

  async unfollow({ followerId, followingId }: IFollowUnfollow): Promise<IFollowerFollowingCount> {
    if (followerId === followingId) {
      throw new Error('Cannot unfollow yourself');
    }

    const session = this.neo4jDriver.session();

    try {
      const counts = await session.executeWrite(async (tx) => {
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
      });

      return counts;
    } catch (error) {
      this.logger.error('Failed to unfollow user', {
        error,
        context: SocialService.name,
      });
      throw error;
    } finally {
      await session.close();
    }
  }

  async userCounts(userId: number): Promise<IFollowerFollowingCount> {
    const session = this.neo4jDriver.session();

    try {
      const result = await session.executeWrite((tx) =>
        tx.run(
          `MERGE (u:User {id: $userId})
          RETURN
            COUNT { (u)<-[:FOLLOWS]-() } AS followers,
            COUNT { (u)-[:FOLLOWS]->() } AS followings
          `,
          { userId },
        ),
      );

      const record = result.records?.[0];

      if (!record) {
        throw new Error('Not a valid user');
      }

      return {
        followers: record.get('followers').toNumber(),
        followings: record.get('followings').toNumber(),
      };
    } catch (error) {
      this.logger.error('Failed to get user counts', {
        error,
        context: SocialService.name,
      });
      throw error;
    } finally {
      await session.close();
    }
  }

  async like({ userId, postId }: LikeInput): Promise<ILike> {
    const like = this.likeRepository.create({ userId, postId });
    const saved = await this.likeRepository.save(like);

    const session = this.neo4jDriver.session();

    try {
      await session.executeWrite(async (tx) => {
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
      });
    } catch (error) {
      await this.likeRepository.delete(saved.id);
      this.logger.error('Failed to sync like to Neo4j', { error, context: SocialService.name });
      throw new Error('Failed to sync like to Neo4j');
    } finally {
      await session.close();
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

    const session = this.neo4jDriver.session();

    try {
      await session.executeWrite(async (tx) => {
        await tx.run(
          `
            MATCH (u:User {id: $userId})-[r:LIKED]->(p:Post {id: $postId})
            DELETE r
            `,
          { userId, postId },
        );
      });
      return true;
    } catch (error) {
      await this.likeRepository.save(like);
      this.logger.error('Failed to sync unlike to Neo4j, MySQL row restored', {
        error,
        context: SocialService.name,
      });
      throw error;
    } finally {
      await session.close();
    }
  }

  async likeCount(postId: number): Promise<number> {
    return this.likeRepository.count({ where: { postId } });
  }

  async hasLiked(userId: number, postId: number): Promise<boolean> {
    const count = await this.likeRepository.count({ where: { userId, postId } });
    return count > 0;
  }

  async onModuleDestroy(): Promise<void> {
    await this.neo4jDriver.close();
  }
}
