import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

export function createMulterOptions(config: ConfigService) {
  const uploadPath = config.get<string>('UPLOAD_PATH') ?? './uploads/activity';
  const maxSize = config.get<number>('MAX_FILE_SIZE') ?? 5 * 1024 * 1024;

  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  //Configurações do Multer
  return {
    storage: diskStorage({
      destination: (_req, _file, cb) => {
        // Garante que o diretório de upload exista
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      // Define o nome do arquivo
      filename: (
        _req: any,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void,
      ) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`; // Gera um nome único para o arquivo
        const ext = extname(file.originalname).toLowerCase();
        cb(null, `${unique}${ext}`);
      },
    }),

    // Limita o tamanho do arquivo
    limits: {
      fileSize: maxSize,
    },

    // Filtra tipos de arquivo permitidos
    fileFilter: (
      _req: any,
      file: Express.Multer.File,
      cb: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      const allowedExt = ['.jpg', '.jpeg', '.png'];
      const allowedMime = ['image/jpeg', 'image/png'];

      const ext = extname(file.originalname).toLowerCase();

      if (!allowedExt.includes(ext) || !allowedMime.includes(file.mimetype)) {
        return cb(
          new BadRequestException(
            'Formato de arquivo inválido. Use apenas JPG, JPEG ou PNG.',
          ),
          false,
        );
      }

      cb(null, true);
    },
  };
}
