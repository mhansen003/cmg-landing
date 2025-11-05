// Permission utilities for role-based access control

export const ADMIN_EMAIL = 'mhansen@cmgfi.com';

export function isAdmin(email: string | null | undefined): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
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
  // Admin items go straight to published
  if (isAdmin(userEmail)) {
    return 'published';
  }

  // Non-admin items need approval
  return 'pending';
}
