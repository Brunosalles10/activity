import { Logger } from '@nestjs/common';
import { UserActivity } from '../../shared/entities/user-activity.entity';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { Activity } from '../entities/activity.entity';

export function buildActivity(
  dto: CreateActivityDto,
  image: Express.Multer.File | undefined,
  user: UserActivity,
  logger: Logger,
): Activity {
  logger.log('Criando Atividade.');

  const activity: Activity = {
    ...new Activity(),
    ...dto,
    date: new Date(dto.date),
    status: dto.status as Activity['status'],
    imagePath: image?.filename ?? null,
    user,
  };

  logger.log(
    `Atividade criada com sucesso: título "${activity.title}" para usuário ${user.email}`,
  );

  return activity;
}
