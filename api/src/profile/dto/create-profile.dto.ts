export class CreateProfileDto {
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    avatar?: string;
    isActive?: boolean;
}
