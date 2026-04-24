import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';

import { Driver } from 'neo4j-driver';

import { IFollowUnfollow } from '@app/shared/interfaces/social/follow-unfollow.interface';
import { NEO4J_DRIVER } from '@app/shared/providers.constant';

@Injectable()
export class SocialService implements OnModuleDestroy {
  constructor(
    @Inject(NEO4J_DRIVER)
    private readonly neo4jDriver: Driver,
  ) {}

  async follow({ followerId, followingId }: IFollowUnfollow): Promise<void> {
    const session = this.neo4jDriver.session();

    await session.executeWrite((tx) =>
      tx.run(
        `MERGE (u1:User {id: $followerId})
          MERGE (u2:User {id: $followingId})
          MERGE (u1)-[:FOLLOWS]->(u2)`,
        { followerId, followingId },
      ),
    );

    await session.close();
  }

  async unfollow({ followerId, followingId }: IFollowUnfollow): Promise<void> {
    const session = this.neo4jDriver.session();

    await session.executeWrite((tx) =>
      tx.run(
        `MATCH (u1:User {id: $followerId})-[r:FOLLOWS]->(u2:User {id:$followingId})
          DELETE r`,
        { followerId, followingId },
      ),
    );

    await session.close();
  }

  async followerCount(userId: number): Promise<number> {
    const session = this.neo4jDriver.session();

    const result = await session.executeRead((tx) =>
      tx.run(
        `MATCH (u1:User {id: $userId})-[:FOLLOWS]-(f)
          RETURN count(f) as count`,
        { userId },
      ),
    );
    await session.close();

    if (result?.records?.length < 1) {
      throw new Error('Not a valid user');
    }

    return result.records[0].get('count').toNumber();
  }

  async onModuleDestroy(): Promise<void> {
    await this.neo4jDriver.close();
  }
}
