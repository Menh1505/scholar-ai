export class Legal {
  id: string;
  title: string;
  userId: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}
