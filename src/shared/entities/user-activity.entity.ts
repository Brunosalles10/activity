import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';

@Entity()
export class UserActivity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];
}
