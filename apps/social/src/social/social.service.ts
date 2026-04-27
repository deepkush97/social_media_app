import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';

import { Driver } from 'neo4j-driver';

import { IFollowUnfollow } from '@app/shared/interfaces/social/follow-unfollow.interface';
import { IFollowerFollowingCount } from '@app/shared/interfaces/social/follower-following-count.interface';
import { NEO4J_DRIVER } from '@app/shared/providers.constant';

@Injectable()
export class SocialService implements OnModuleDestroy {
  constructor(
    @Inject(NEO4J_DRIVER)
    private readonly neo4jDriver: Driver,
  ) {}

  async follow({ followerId, followingId }: IFollowUnfollow): Promise<IFollowerFollowingCount> {
    const session = this.neo4jDriver.session();

    const counts = await session.executeWrite(async (tx) => {
      const result = await tx.run(
        `
        MERGE (u1:User {id: $followerId})
        MERGE (u2:User {id: $followingId})
        MERGE (u1)-[:FOLLOWS]->(u2)
        
        WITH u1
        RETURN 
        COUNT { (u1)<-[:FOLLOWS]-() } AS followers,
        COUNT { (u1)-[:FOLLOWS]->() } AS followings
        `,
        { followerId, followingId },
      );

      const record = result.records[0];

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
    const session = this.neo4jDriver.session();

    const counts = await session.executeWrite(async (tx) => {
      const result = await tx.run(
        `
        MATCH (u1:User {id: $followerId})-[r:FOLLOWS]->(u2:User {id:$followingId})
        DELETE r
        
        WITH u1
        RETURN 
        COUNT { (u1)<-[:FOLLOWS]-() } AS followers,
        COUNT { (u1)-[:FOLLOWS]->() } AS followings
        `,
        { followerId, followingId },
      );

      const record = result.records[0];

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

    const result = await session.executeRead((tx) =>
      tx.run(
        `MATCH (u:User {id: $userId})
        RETURN 
          COUNT { (u)<-[:FOLLOWS]-() } AS followers,
          COUNT { (u)-[:FOLLOWS]->() } AS followings
        `,
        { userId },
      ),
    );
    await session.close();

    const record = result.records[0];

    if (!record) {
      throw new Error('Not a valid user');
    }

    return {
      followers: record.get('followers').toNumber(),
      followings: record.get('followings').toNumber(),
    };
  }

  async onModuleDestroy(): Promise<void> {
    await this.neo4jDriver.close();
  }
}
