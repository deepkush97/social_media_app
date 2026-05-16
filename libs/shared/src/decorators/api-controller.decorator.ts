import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function ApiController(name: string): ReturnType<typeof applyDecorators> {
  const tagName = name.charAt(0).toUpperCase() + name.slice(1);

  return applyDecorators(Controller(name), ApiTags(tagName));
}
