import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserActivity } from '../../shared/entities/user-activity.entity';
import { JwtPayload } from '../../shared/interfaces/jwt-payload.interface';

export async function findOrCreateUser(
  userRepo: Repository<UserActivity>,
  userJwt: JwtPayload,
  logger: Logger,
): Promise<UserActivity> {
  logger.log(`Buscando usuário ID: ${userJwt.sub}`);

  let user = await userRepo.findOne({ where: { id: userJwt.sub } });

  if (!user) {
    logger.log(`Usuário não encontrado. Criando usuário ID: ${userJwt.sub}`);

    const newUser = userRepo.create({
      id: userJwt.sub,
      name: userJwt.name ?? userJwt.email.split('@')[0],
      email: userJwt.email,
    });

    user = await userRepo.save(newUser);
    logger.log(`Usuário criado: ${user.email}`);
  }

  return user;
}
