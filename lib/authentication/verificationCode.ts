import { randomInt, createHash } from 'node:crypto';

export function generateCode(): string {
  return randomInt(100000, 1000000).toString();
}

export function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}
