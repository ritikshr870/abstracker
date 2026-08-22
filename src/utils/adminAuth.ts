export const ADMIN_EMAILS = [
  'ritikshr864@gmail.com',
  'shrdevlopers@gmail.com',
  'divzbaby8084@gmail.com',
  'admin@abstracker.in',
  'help@abstracker.in',
  'info@abstracker.in'
];

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ADMIN_EMAILS.some(adm => adm.toLowerCase() === clean);
}
