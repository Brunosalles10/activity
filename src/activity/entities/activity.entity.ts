import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserActivity } from '../../shared/entities/user-activity.entity';

export enum ActivityStatus {
  CONCLUIDO = 'concluído',
  EM_ANDAMENTO = 'em andamento',
  CANCELADO = 'cancelado',
}

@Entity('activity')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 100 })
  professor: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: ActivityStatus,
    default: ActivityStatus.EM_ANDAMENTO, // Valor padrão
  })
  status: ActivityStatus;

  @Column({ type: 'text' })
  link: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagePath: string | null;

  // Ligação com o usuário, muitos para um
  @ManyToOne(() => UserActivity, (user) => user.activities, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: UserActivity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
