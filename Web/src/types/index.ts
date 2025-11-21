// Hierarchy Types
export interface HierarchyNode {
  id: string;
  name: string;
  parentId: string | null;
  children?: HierarchyNode[];
  permissions?: Permission[];
}

export interface CreateHierarchyDto {
  name: string;
  parentId: string | null;
}

// Permission Types
export interface Permission {
  id: string;
  name: string;
  description?: string;
  hierarchyId?: string;
  inherited?: boolean;
}

export interface CreatePermissionDto {
  name: string;
  description?: string;
  hierarchyId?: string;
}

export interface EffectivePermission {
  id: string;
  code: string;
  description: string;
  hierarchyId: string;
}

// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  bloodType: string;
  hierarchyId: string;
  hierarchy?: HierarchyNode;
  email?: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  bloodType: string;
  hierarchyId: string;
  email?: string;
}

export interface UserPermission {
  userId: string;
  permissionId: string;
  permissionName: string;
  hierarchyId: string;
  hierarchyName: string;
  inherited: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type?: "info" | "warning" | "success" | "error";
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalHierarchies: number;
  totalPermissions: number;
  unreadNotifications: number;
}
