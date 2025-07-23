export class CreateLegalDto {
  title: string;
  userId: string;
  content: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'expired';
}
