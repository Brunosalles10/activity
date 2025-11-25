import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateActivityDto {
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'O professor é obrigatório' })
  @IsString()
  professor: string;

  @IsNotEmpty({ message: 'A data de entrega é obrigatória' })
  @IsDateString({}, { message: 'Data inválida' })
  date: string; // vem como string, mas deve ser uma data válida

  @IsNotEmpty({ message: 'O status é obrigatório' })
  @IsIn(['concluído', 'em andamento', 'cancelado'], {
    message: 'Status deve ser: concluído, em andamento ou cancelado',
  })
  status: string;

  @IsOptional()
  @IsUrl({}, { message: 'Link inválido. Use uma URL válida' })
  link?: string;
}
