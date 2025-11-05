// Permission utilities for role-based access control

export const ADMIN_EMAILS = [
  'mhansen@cmgfi.com',
  'andyg@cmgfi.com'
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.some(adminEmail =>
    email.toLowerCase() === adminEmail.toLowerCase()
  );
}

export function canEdit(userEmail: string | null | undefined, toolCreatedBy?: string): boolean {
  // Admin can edit anything
  if (isAdmin(userEmail)) {
    return true;
  }

  // Non-admin users cannot edit
  return false;
}

export function canPublish(userEmail: string | null | undefined): boolean {
  // Only admin can publish/unpublish
  return isAdmin(userEmail);
}

export function canApprove(userEmail: string | null | undefined): boolean {
  // Only admin can approve
  return isAdmin(userEmail);
}

export function getDefaultStatus(userEmail: string | null | undefined): 'published' | 'pending' {
  // All items need approval, including admin items
  // This ensures a consistent workflow where all tools go through the queue
  return 'pending';
}
