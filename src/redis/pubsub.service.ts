import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ActivityService } from '../activity/activity.service';

/**
 * Serviço Pub/Sub do ActivityService
 * - Escuta eventos de usuários (user.created, etc.)
 * - Publica seus próprios eventos (activity.created, activity.updated)
 */
@Injectable()
export class PubSubService implements OnModuleInit {
  private readonly logger = new Logger(PubSubService.name);
  private subscriber: Redis;

  constructor(
    @Inject('REDIS_CLIENT') private readonly publisher: Redis,
    private readonly activityService: ActivityService,
  ) {}

  /**
   * Inicializa o subscriber Redis e define os canais a escutar
   */
  async onModuleInit() {
    this.subscriber = this.publisher.duplicate();

    this.subscriber.on('connect', () => {
      this.logger.log('Subscriber conectado ao Redis');
    });

    this.subscriber.on('message', (channel, message) => {
      this.logger.log(`Evento recebido no canal [${channel}]: ${message}`);
      this.handleEvent(channel, message);
    });

    // Ouvindo apenas os eventos vindos de UsersService
    await this.subscriber.subscribe(
      'user.created',
      'user.updated',
      'user.deleted',
    );

    this.logger.log('PubSubService pronto e escutando eventos de usuários.');
  }

  /**
   * Publica eventos próprios do ActivityService
   */
  async publish(channel: string, message: any) {
    try {
      const payload = JSON.stringify(message);
      await this.publisher.publish(channel, payload);
      this.logger.log(`Evento publicado → [${channel}] ${payload}`);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          `Erro ao publicar evento (${channel}): ${err.message}`,
        );
      }
    }
  }

  /**
   * Processa eventos recebidos de outros microsserviços (Users)
   */
  private handleEvent(channel: string, message: string) {
    try {
      interface UserEventPayload {
        id: string;
        email?: string;
      }
      const data = JSON.parse(message) as UserEventPayload;

      switch (channel) {
        case 'user.created':
          this.logger.log(
            `Novo usuário criado detectado: ${data.email} (id=${data.id})`,
          );
          this.activityService.handleUserCreatedEvent(data);
          break;

        case 'user.updated':
          this.logger.log(`Usuário atualizado: ${data.id}`);
          break;

        case 'user.deleted':
          this.logger.warn(`Usuário removido: ${data.id}`);
          break;

        default:
          this.logger.warn(`Canal desconhecido: ${channel}`);
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        this.logger.error(`Erro ao processar mensagem Redis: ${err.message}`);
      } else {
        this.logger.error(`Erro desconhecido: ${String(err)}`);
      }
    }
  }
}
