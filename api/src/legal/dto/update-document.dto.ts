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
