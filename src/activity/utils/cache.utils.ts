import { Logger } from '@nestjs/common';
import { CacheService } from '../../redis/cache.service';

export async function invalidateActivityCache(
  cacheService: CacheService,
  userId: number,
  activityId?: number,
  logger?: Logger,
): Promise<void> {
  logger?.log(`Invalidando cache para usuário ID: ${userId}`);

  await cacheService.del(`activities:user:${userId}`);

  if (activityId) {
    logger?.log(`Invalidando cache para atividade ID: ${activityId}`);
    await cacheService.del(`activity:${activityId}`);
  }
}
