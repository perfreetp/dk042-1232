import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { Project, ProjectCategory, ProjectRole, Milestone, ProjectTask } from '@/types/project';
import { mockProjects } from '@/data/projects';

interface ProjectState {
  projects: Project[];
  favoriteIds: string[];

  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'appliedCount' | 'isFavorite' | 'status' | 'founderId' | 'founderName' | 'founderAvatar' | 'totalSlots'> & {
    roles: ProjectRole[];
    milestones: Milestone[];
    tasks?: ProjectTask[];
    recruitEndDate?: string;
  }) => void;
  toggleFavorite: (projectId: string) => boolean;
  isFavorite: (projectId: string) => boolean;
  incrementAppliedCount: (projectId: string) => void;
  approveApplication: (projectId: string, roleId: string) => void;
  updateProjectStatus: (projectId: string, status: Project['status']) => void;
  updateMilestone: (projectId: string, milestoneId: string, data: Partial<Milestone>) => void;
  updateProjectTask: (projectId: string, taskId: string, data: Partial<ProjectTask>) => void;
  getRecruitingProjects: () => Project[];
  getProjectsByCategory: (category: ProjectCategory | 'all') => Project[];
  getProjectById: (id: string) => Project | undefined;
  getMyProjects: () => Project[];
}

const taroStorage = {
  getItem: (name: string) => {
    const value = Taro.getStorageSync(name);
    return value || null;
  },
  setItem: (name: string, value: string) => {
    Taro.setStorageSync(name, value);
  },
  removeItem: (name: string) => {
    Taro.removeStorageSync(name);
  }
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: JSON.parse(JSON.stringify(mockProjects)),
      favoriteIds: mockProjects.filter(p => p.isFavorite).map(p => p.id),

      addProject: (data) => set(state => {
        const totalSlots = data.roles.reduce((sum, r) => sum + r.slots, 0);
        const newProject: Project = {
          ...data,
          id: `p_${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          appliedCount: 0,
          isFavorite: false,
          status: 'recruiting',
          founderId: 'me',
          founderName: '我是合伙人',
          founderAvatar: 'https://picsum.photos/id/1005/200/200',
          totalSlots,
          tasks: data.tasks || []
        };
        return { projects: [newProject, ...state.projects] };
      }),

      toggleFavorite: (projectId) => {
        const isFav = get().favoriteIds.includes(projectId);
        set(state => ({
          favoriteIds: isFav
            ? state.favoriteIds.filter(id => id !== projectId)
            : [...state.favoriteIds, projectId]
        }));
        return !isFav;
      },

      isFavorite: (projectId) => get().favoriteIds.includes(projectId),

      incrementAppliedCount: (projectId) => set(state => ({
        projects: state.projects.map(p =>
          p.id === projectId ? { ...p, appliedCount: p.appliedCount + 1 } : p
        )
      })),

      approveApplication: (projectId, roleId) => set(state => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p;
          return {
            ...p,
            roles: p.roles.map(r =>
              r.id === roleId ? { ...r, filled: Math.min(r.filled + 1, r.slots) } : r
            )
          };
        })
      })),

      updateProjectStatus: (projectId, status) => set(state => ({
        projects: state.projects.map(p =>
          p.id === projectId ? { ...p, status } : p
        )
      })),

      updateMilestone: (projectId, milestoneId, data) => set(state => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p;
          return {
            ...p,
            milestones: p.milestones.map(m =>
              m.id === milestoneId ? { ...m, ...data } : m
            )
          };
        })
      })),

      updateProjectTask: (projectId, taskId, data) => set(state => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p;
          return {
            ...p,
            tasks: p.tasks.map(t =>
              t.id === taskId ? { ...t, ...data } : t
            )
          };
        })
      })),

      getRecruitingProjects: () => get().projects.filter(p => p.status === 'recruiting'),

      getProjectsByCategory: (category) => {
        const all = get().getRecruitingProjects();
        if (category === 'all') return all;
        return all.filter(p => p.category === category);
      },

      getProjectById: (id) => get().projects.find(p => p.id === id),

      getMyProjects: () => get().projects.filter(p => p.founderId === 'me')
    }),
    {
      name: 'sidejob-project-store',
      storage: createJSONStorage(() => taroStorage)
    }
  )
);
