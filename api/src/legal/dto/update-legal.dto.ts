import { PartialType } from '@nestjs/mapped-types';
import { CreateLegalDto, CreateDocumentDto } from './create-legal.dto';

export class UpdateLegalDto extends PartialType(CreateLegalDto) {}

export class UpdateDocumentDto {
  name?: string;
  status?: 'pending' | 'done' | 'expired';
  note?: string;
  uploadedFileUrl?: string;
}

export class AddDocumentDto {
  name: string;
  status?: 'pending' | 'done' | 'expired';
  note?: string;
  uploadedFileUrl?: string;
}
