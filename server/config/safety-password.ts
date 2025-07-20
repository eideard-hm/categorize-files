import argon2 from 'argon2';

import { catchError } from './promises';

export const hashPassword = async (password: string): Promise<string> => {
    const [hash] = await catchError(argon2.hash(password));
    if (!hash) throw new Error('Failed to hash password');
    return hash;
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    const [isValid] = await catchError(argon2.verify(hash, password));
    if (isValid === null) throw new Error('Failed to verify password');
    return isValid;
}