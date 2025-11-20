import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ActivityPubSubService implements OnModuleInit {
  private readonly logger = new Logger(ActivityPubSubService.name);
  private subscriber: Redis;

  constructor(@Inject('REDIS_CLIENT') private publisher: Redis) {}

  //Inicializa o subscriber Redis
  async onModuleInit() {
    this.subscriber = this.publisher.duplicate();

    //  Canais que deseja ouvir
    await this.subscriber.subscribe(
      'user.created',
      'user.updated',
      'user.deleted',
    );

    // Manipula mensagens recebidas
    this.subscriber.on('message', (channel, message) => {
      this.logger.log(`Evento recebido → ${channel}: ${message}`);
      this.handleEvent(channel, JSON.parse(message));
    });
  }

  // Publicar eventos de atividade
  async publish(channel: string, message: any): Promise<void> {
    try {
      const payload = JSON.stringify(message);
      await this.publisher.publish(channel, payload);
      this.logger.debug(`Evento publicado → [${channel}] ${payload}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Erro ao publicar no canal ${channel}: ${msg}`);
    }
  }

  // Logica para lidar com eventos recebidos
  private handleEvent(channel: string, data: any) {
    try {
      // Mapeia canais para ações específicas
      const handlers: Record<string, () => void> = {
        'user.created': () =>
          this.logger.log(`Novo usuário criado: ${data.email} (id=${data.id})`),
        'user.updated': () =>
          this.logger.debug(`Usuário atualizado: ${data.id}`),
        'user.deleted': () => this.logger.warn(`Usuário removido: ${data.id}`),
      };

      const handler = handlers[channel];
      if (handler) {
        handler();
      } else {
        this.logger.warn(`Canal desconhecido: ${channel}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Erro ao processar mensagem: ${msg}`);
    }
  }
}
