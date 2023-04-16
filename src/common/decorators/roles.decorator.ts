import { SetMetadata } from '@nestjs/common';

export const HasRoles = (...roles: number[]) => SetMetadata('roles', roles);
