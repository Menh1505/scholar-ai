export class CreateLegalDto {
  title: string;
  userId: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'expired';
}
