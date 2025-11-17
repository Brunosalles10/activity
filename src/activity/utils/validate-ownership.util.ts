import { BadRequestException, Logger } from '@nestjs/common';
import { Activity } from '../entities/activity.entity';

export function validateOwnership(
  activity: Activity,
  userId: number,
  logger: Logger,
): void {
  if (activity.user.id !== userId) {
    logger.warn(
      `Usuário ID: ${userId} tentou acessar atividade ID: ${activity.id} sem permissão`,
    );
    throw new BadRequestException(
      'Você não tem permissão para acessar esta atividade',
    );
  }
}
