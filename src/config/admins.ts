import { User } from 'firebase/auth';

export const SUPER_ADMIN_EMAILS = [
  'cebrailkara@gmail.com',
  'info@beyogluteknoloji.com',
  'cebokar@gmail.com',
];

export function isSuperAdmin(user: User | null | undefined): boolean {
  if (!user?.email) return false;
  return SUPER_ADMIN_EMAILS.includes(user.email.toLowerCase());
}
