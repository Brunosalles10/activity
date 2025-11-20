import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { CacheService } from '../redis/cache.service';
import { UserActivity } from '../shared/entities/user-activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';
import { buildActivity } from './utils/build-activity.util';
import { invalidateActivityCache } from './utils/cache.utils';
import { findOrCreateUser } from './utils/find-or-create-user.util';
import { validateOwnership } from './utils/validate-ownership.util';

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,

    @InjectRepository(UserActivity)
    private readonly userRepo: Repository<UserActivity>,

    private readonly cacheService: CacheService,
  ) {}

  //CRIA UMA NOVA ATIVIDADE
  async create(
    dto: CreateActivityDto,
    image: Express.Multer.File | undefined,
    userJwt: JwtPayload,
  ): Promise<Activity> {
    this.logger.log(
      `Criando atividade "${dto.title}" para usuário ID: ${userJwt.sub}`,
    );

    const user = await findOrCreateUser(this.userRepo, userJwt, this.logger);

    const activity = buildActivity(dto, image, user, this.logger);

    const savedActivity = await this.activityRepo.save(activity);

    this.logger.log(
      `Atividade criada com ID ${savedActivity.id} para usuário ${user.email}`,
    );

    await invalidateActivityCache(
      this.cacheService,
      user.id,
      undefined,
      this.logger,
    );

    return savedActivity;
  }

  //LISTAR TODAS AS ATIVIDADES DE UM USUÁRIO
  async findAll(userId: number): Promise<Activity[]> {
    const cacheKey = `activities:user:${userId}`;
    const cached = await this.cacheService.get<Activity[]>(cacheKey);

    if (cached) {
      this.logger.debug(`Retornando ${cached.length} atividades do cache`);
      return cached;
    }

    const activities = await this.activityRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    this.logger.log(`Encontradas ${activities.length} atividades encontradas`);

    await this.cacheService.set(cacheKey, activities, 60);
    return activities;
  }

  //LISTAR UMA ATIVIDADE PELO ID
  async findOne(id: number, userId: number): Promise<Activity> {
    const cacheKey = `activity:${id}`;
    const cached = await this.cacheService.get<Activity>(cacheKey);

    if (cached) {
      validateOwnership(cached, userId, this.logger);
      return cached;
    }

    const activity = await this.activityRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!activity) {
      this.logger.warn(`Atividade ID ${id} não encontrada`);
      throw new NotFoundException(`Atividade com ID ${id} não encontrada`);
    }

    validateOwnership(activity, userId, this.logger);

    await this.cacheService.set(cacheKey, activity, 60);
    return activity;
  }

  //ATUALIZAR UMA ATIVIDADE
  async update(
    id: number,
    dto: UpdateActivityDto,
    image: Express.Multer.File | undefined,
    userId: number,
  ): Promise<Activity> {
    const activity = await this.findOne(id, userId);

    // Atualiza campos
    Object.assign(activity, dto);

    if (image) {
      this.logger.debug(`Nova imagem enviada: ${image.filename}`);
      activity.imagePath = image.filename;
    }

    const updated = await this.activityRepo.save(activity);

    this.logger.log(`Atividade ID ${id} atualizada com sucesso`);

    // Invalida cache
    await invalidateActivityCache(this.cacheService, userId, id, this.logger);

    return updated;
  }

  //DELETAR UMA ATIVIDADE
  async remove(id: number, userId: number): Promise<void> {
    const activity = await this.findOne(id, userId);

    await this.activityRepo.remove(activity);

    // Invalida cache
    await invalidateActivityCache(this.cacheService, userId, id);
  }
}
