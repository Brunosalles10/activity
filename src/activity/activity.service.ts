import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PubSubService } from '../redis/pubsub.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivityService implements OnModuleInit {
  private readonly logger = new Logger(ActivityService.name);

  constructor(private readonly pubSubService: PubSubService) {}

  async onModuleInit() {
    this.logger.log(' ActivityService iniciado e ouvindo eventos Redis...');
  }

  // Criação de atividades acadêmicas
  create(createActivityDto: CreateActivityDto) {
    this.logger.log(`📝 Criando nova atividade: ${createActivityDto.title}`);
    return {
      message: 'Atividade criada com sucesso!',
      data: createActivityDto,
    };
  }

  findAll() {
    this.logger.log('Buscando todas as atividades acadêmicas...');
    return `This action returns all activities`;
  }

  findOne(id: number) {
    this.logger.log(`Buscando atividade com id=${id}`);
    return `This action returns a #${id} activity`;
  }

  update(id: number, updateActivityDto: UpdateActivityDto) {
    this.logger.log(`Atualizando atividade id=${id}`);
    return {
      message: 'Atividade atualizada com sucesso!',
      data: updateActivityDto,
    };
  }

  remove(id: number) {
    this.logger.warn(`Removendo atividade id=${id}`);
    return `This action removes a #${id} activity`;
  }

  /**
   * Apenas reage a eventos Redis — sem criar usuário!
   * Pode ser usada futuramente para associar atividades automáticas.
   */
  handleUserCreatedEvent(data: any) {
    this.logger.log(
      `📢 Evento Redis Usuário criado detectado: ${data.email} (id=${data.id})`,
    );

    // Exemplo futuro:
    // Criar automaticamente uma "Atividade de boas-vindas" associada ao novo usuário
    // ou simplesmente registrar em log de auditoria.
  }
}
