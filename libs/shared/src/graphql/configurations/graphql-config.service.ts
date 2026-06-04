import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GraphqlConfigService {
  constructor(private readonly configService: ConfigService) {}

  get url(): string {
    return this.configService.get<string>('graphql.url');
  }
}
