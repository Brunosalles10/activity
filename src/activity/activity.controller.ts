import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activity')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class ActivityController {
  private readonly logger = new Logger(ActivityController.name);

  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateActivityDto,
    @UploadedFile() image: Express.Multer.File | undefined,
    @Request() req: { user: JwtPayload },
  ) {
    const { title } = dto;
    const { email, sub } = req.user;

    this.logger.log(
      `Recebendo requisição para criar atividade "${title}" para userID=${sub} (${email})`,
    );

    return this.activityService.create(dto, image, req.user);
  }

  @Get()
  findAll(@Request() req: { user: JwtPayload }) {
    const { sub } = req.user;
    this.logger.log(`Listando atividades do usuário ID: ${sub}`);
    return this.activityService.findAll(sub);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: JwtPayload },
  ) {
    const { sub } = req.user;
    this.logger.log(`Buscando atividade ID=${id} para userID=${sub}`);

    return this.activityService.findOne(id, sub);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActivityDto,
    @UploadedFile() image: Express.Multer.File | undefined,
    @Request() req: { user: JwtPayload },
  ) {
    const { sub } = req.user;

    this.logger.log(
      `Atualizando atividade ID=${id} para userID=${sub} — campos enviados: ${Object.keys(
        dto,
      ).join(', ')}`,
    );

    return this.activityService.update(id, dto, image, sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: JwtPayload },
  ): Promise<void> {
    const { sub } = req.user;

    this.logger.log(`Removendo atividade ID=${id} para userID=${sub}`);

    await this.activityService.remove(id, sub);

    this.logger.log(`Atividade ID=${id} removida com sucesso`);
  }
}
