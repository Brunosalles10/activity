import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivity } from '../shared/entities/user-activity.entity';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, UserActivity]), UploadModule],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
