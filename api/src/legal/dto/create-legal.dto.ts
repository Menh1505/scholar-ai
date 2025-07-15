export class CreateDocumentDto {
  name: string;
  status?: 'pending' | 'done' | 'expired';
  note?: string;
  uploadedFileUrl?: string;
}

export class CreateLegalDto {
  userId: string;
  school: string;
  documents?: CreateDocumentDto[];
}
