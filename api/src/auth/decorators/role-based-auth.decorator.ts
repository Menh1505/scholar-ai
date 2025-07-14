import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export function AuthWithRoles(...roles: string[]) {
    return applyDecorators(
        UseGuards(JwtAuthGuard),
        Roles(...roles),
    );
}

export function AdminOnly() {
    return applyDecorators(
        UseGuards(JwtAuthGuard),
        Roles('admin'),
    );
}

export function ScholarOnly() {
    return applyDecorators(
        UseGuards(JwtAuthGuard),
        Roles('scholar'),
    );
}
