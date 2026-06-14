export type ProjectCategory = 'ecommerce' | 'content' | 'tool' | 'offline';

export type ProjectStatus = 'recruiting' | 'in_progress' | 'completed';

export interface ProjectRole {
  id: string;
  name: string;
  skills: string[];
  slots: number;
  filled: number;
  description: string;
}

export interface Milestone {
  id: string;
  title: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'todo' | 'doing' | 'done';
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  goals: string;
  budget: string;
  period: string;
  city: string;
  riskWarning: string;
  status: ProjectStatus;
  coverImage: string;
  founderId: string;
  founderName: string;
  founderAvatar: string;
  roles: ProjectRole[];
  milestones: Milestone[];
  tasks: ProjectTask[];
  createdAt: string;
  tags: string[];
  totalSlots: number;
  appliedCount: number;
  isFavorite: boolean;
}

export interface Application {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  roleId: string;
  roleName: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: string;
}

export const CATEGORY_MAP: Record<ProjectCategory, { label: string; color: string; bgColor: string }> = {
  ecommerce: { label: '电商', color: '#F97316', bgColor: '#FFF7ED' },
  content: { label: '内容', color: '#8B5CF6', bgColor: '#F5F3FF' },
  tool: { label: '工具', color: '#06B6D4', bgColor: '#ECFEFF' },
  offline: { label: '线下服务', color: '#84CC16', bgColor: '#F7FEE7' }
};
