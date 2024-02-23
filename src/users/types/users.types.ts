import { Cart, User } from '@prisma/client';

export type NullableUser = User | null;

export type UserWithCart = User & { cart: Cart[] };

export type UserWithCartOrNull = UserWithCart | null;
