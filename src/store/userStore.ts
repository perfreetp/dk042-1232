import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { UserProfile, Skill, Work, IncomeType } from '@/types/user';
import { mockCurrentUser } from '@/data/users';

interface UserState {
  profile: UserProfile;
  applications: ApplicationRecord[];
  receivedApplications: ReceivedApplication[];
  voiceAppointments: VoiceAppointment[];

  updateProfile: (data: Partial<UserProfile>) => void;
  updateSkills: (skillNames: string[]) => void;
  addWork: (work: Work) => void;
  removeWork: (workId: string) => void;
  updateWork: (workId: string, data: Partial<Work>) => void;
  addApplication: (app: ApplicationRecord) => void;
  updateApplicationStatus: (appId: string, status: ApplicationRecord['status']) => void;
  addReceivedApplication: (app: ReceivedApplication) => void;
  approveReceivedApplication: (appId: string) => void;
  rejectReceivedApplication: (appId: string) => void;
  addVoiceAppointment: (appt: VoiceAppointment) => void;
}

export interface ApplicationRecord {
  id: string;
  projectId: string;
  projectTitle: string;
  projectCover: string;
  roleName: string;
  roleId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: string;
  founderId: string;
  founderName: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
}

export interface ReceivedApplication extends ApplicationRecord {}

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

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: { ...mockCurrentUser },
      applications: [
        {
          id: 'app_demo',
          projectId: 'p1',
          projectTitle: '小红书美妆品牌独立站搭建运营',
          projectCover: 'https://picsum.photos/id/119/750/500',
          roleName: '前端开发',
          roleId: 'r1',
          status: 'pending',
          message: '有5年前端经验，做过电商项目',
          createdAt: '2026-06-12',
          founderId: 'u1',
          founderName: '李创业',
          applicantId: 'me',
          applicantName: mockCurrentUser.name,
          applicantAvatar: mockCurrentUser.avatar
        }
      ],
      receivedApplications: [
        {
          id: 'app_recv_1',
          projectId: 'p_new_1',
          projectTitle: '我发起的测试项目',
          projectCover: 'https://picsum.photos/id/119/750/500',
          roleName: '前端开发',
          roleId: 'r1',
          status: 'pending',
          message: '你好，我对这个项目很感兴趣！',
          createdAt: '2026-06-13',
          founderId: 'me',
          founderName: '我是合伙人',
          applicantId: 'u_other',
          applicantName: '王小明',
          applicantAvatar: 'https://picsum.photos/id/64/200/200'
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

      updateWork: (workId, data) => set(state => ({
        profile: {
          ...state.profile,
          works: state.profile.works.map(w => w.id === workId ? { ...w, ...data } : w)
        }
      })),

      addApplication: (app) => set(state => ({
        applications: [app, ...state.applications]
      })),

      updateApplicationStatus: (appId, status) => set(state => ({
        applications: state.applications.map(a => a.id === appId ? { ...a, status } : a)
      })),

      addReceivedApplication: (app) => set(state => ({
        receivedApplications: [app, ...state.receivedApplications]
      })),

      approveReceivedApplication: (appId) => set(state => ({
        receivedApplications: state.receivedApplications.map(a =>
          a.id === appId ? { ...a, status: 'approved' as const } : a
        )
      })),

      rejectReceivedApplication: (appId) => set(state => ({
        receivedApplications: state.receivedApplications.map(a =>
          a.id === appId ? { ...a, status: 'rejected' as const } : a
        )
      })),

      addVoiceAppointment: (appt) => set(state => ({
        voiceAppointments: [appt, ...state.voiceAppointments]
      }))
    }),
    {
      name: 'sidejob-user-store',
      storage: createJSONStorage(() => taroStorage)
    }
  )
);
