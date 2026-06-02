import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Driver } from 'neo4j-driver';
import { Repository } from 'typeorm';

import { ILike } from '@app/shared/interfaces/like/like.interface';
import { IFollowUnfollow } from '@app/shared/interfaces/social/follow-unfollow.interface';
import { IFollowerFollowingCount } from '@app/shared/interfaces/social/follower-following-count.interface';
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
    } finally {
      await session.close();
    }
  }

  async follow({ followerId, followingId }: IFollowUnfollow): Promise<IFollowerFollowingCount> {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    const session = this.neo4jDriver.session();

    const counts = await session.executeWrite(async (tx) => {
      const result = await tx.run(
        `
        MERGE (u1:User {id: $followerId})
        MERGE (u2:User {id: $followingId})
        MERGE (u1)-[:FOLLOWS]->(u2)
        
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

    await session.close();

    return counts;
  }

  async unfollow({ followerId, followingId }: IFollowUnfollow): Promise<IFollowerFollowingCount> {
    if (followerId === followingId) {
      throw new Error('Cannot unfollow yourself');
    }

    const session = this.neo4jDriver.session();

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

    await session.close();

    return counts;
  }

  async userCounts(userId: number): Promise<IFollowerFollowingCount> {
    const session = this.neo4jDriver.session();

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
    await session.close();

    const record = result.records?.[0];

    return {
      followers: record.get('followers').toNumber(),
      followings: record.get('followings').toNumber(),
    };
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
    } catch {
      await this.likeRepository.delete(saved.id);
      throw new Error('Failed to sync like to Neo4j');
    } finally {
      await session.close();
    }

    return saved;
  }

  async unlike({ userId, postId }: LikeInput): Promise<boolean> {
    await this.likeRepository.delete({ userId, postId });

    const session = this.neo4jDriver.session();

    await session.executeWrite(async (tx) => {
      await tx.run(
        `
          MATCH (u:User {id: $userId})-[r:LIKED]->(p:Post {id: $postId})
          DELETE r
          `,
        { userId, postId },
      );
    });

    await session.close();
    return true;
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
