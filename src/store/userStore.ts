import { create } from 'zustand';
import { UserProfile, Skill, Work, IncomeType } from '@/types/user';
import { mockCurrentUser } from '@/data/users';

interface UserState {
  profile: UserProfile;
  applications: ApplicationRecord[];
  voiceAppointments: VoiceAppointment[];

  updateProfile: (data: Partial<UserProfile>) => void;
  updateSkills: (skillNames: string[]) => void;
  addWork: (work: Work) => void;
  removeWork: (workId: string) => void;
  addApplication: (app: ApplicationRecord) => void;
  updateApplicationStatus: (appId: string, status: ApplicationRecord['status']) => void;
  addVoiceAppointment: (appt: VoiceAppointment) => void;
}

export interface ApplicationRecord {
  id: string;
  projectId: string;
  projectTitle: string;
  projectCover: string;
  roleName: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: string;
  founderId: string;
  founderName: string;
}

export interface VoiceAppointment {
  id: string;
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar: string;
  projectId: string;
  projectTitle: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: { ...mockCurrentUser },
  applications: [
    {
      id: 'app_demo',
      projectId: 'p1',
      projectTitle: '小红书美妆品牌独立站搭建运营',
      projectCover: 'https://picsum.photos/id/119/750/500',
      roleName: '前端开发',
      status: 'pending',
      message: '有5年前端经验，做过电商项目',
      createdAt: '2026-06-12',
      founderId: 'u1',
      founderName: '李创业'
    }
  ],
  voiceAppointments: [],

  updateProfile: (data) => set(state => ({
    profile: { ...state.profile, ...data }
  })),

  updateSkills: (skillNames) => set(state => ({
    profile: {
      ...state.profile,
      skills: skillNames.map((name, i) => ({ id: `s_${Date.now()}_${i}`, name }))
    }
  })),

  addWork: (work) => set(state => ({
    profile: { ...state.profile, works: [...state.profile.works, work] }
  })),

  removeWork: (workId) => set(state => ({
    profile: { ...state.profile, works: state.profile.works.filter(w => w.id !== workId) }
  })),

  addApplication: (app) => set(state => ({
    applications: [app, ...state.applications]
  })),

  updateApplicationStatus: (appId, status) => set(state => ({
    applications: state.applications.map(a => a.id === appId ? { ...a, status } : a)
  })),

  addVoiceAppointment: (appt) => set(state => ({
    voiceAppointments: [appt, ...state.voiceAppointments]
  }))
}));
