import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { Collaboration, TaskItem, FileLink, MeetingNote, ReviewNote } from '@/types/collaborate';
import { mockCollaborations } from '@/data/collaborate';

interface CollabState {
  collaborations: Collaboration[];

  getCollabById: (id: string) => Collaboration | undefined;
  getMyCollaborations: () => Collaboration[];
  updateTaskStatus: (collabId: string, taskId: string, status: TaskItem['status']) => void;
  addTask: (collabId: string, task: Omit<TaskItem, 'id'>) => void;
  addFile: (collabId: string, file: Omit<FileLink, 'id' | 'uploadedAt'>) => void;
  addMeeting: (collabId: string, meeting: Omit<MeetingNote, 'id'>) => void;
  addReview: (collabId: string, review: Omit<ReviewNote, 'id'>) => void;
  recalculateProgress: (collabId: string) => void;
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

export const useCollabStore = create<CollabState>()(
  persist(
    (set, get) => ({
      collaborations: JSON.parse(JSON.stringify(mockCollaborations)),

      getCollabById: (id) => get().collaborations.find(c => c.id === id),

      getMyCollaborations: () => get().collaborations,

      updateTaskStatus: (collabId, taskId, status) => set(state => {
        const collabs = state.collaborations.map(c => {
          if (c.id !== collabId) return c;
          const tasks = c.tasks.map(t => t.id === taskId ? { ...t, status } : t);
          const doneCount = tasks.filter(t => t.status === 'done').length;
          const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : c.progress;
          return { ...c, tasks, progress };
        });
        return { collaborations: collabs };
      }),

      addTask: (collabId, task) => set(state => ({
        collaborations: state.collaborations.map(c =>
          c.id !== collabId ? c : {
            ...c,
            tasks: [...c.tasks, { ...task, id: `t_${Date.now()}` }]
          }
        )
      })),

      addFile: (collabId, file) => set(state => ({
        collaborations: state.collaborations.map(c =>
          c.id !== collabId ? c : {
            ...c,
            files: [...c.files, { ...file, id: `f_${Date.now()}`, uploadedAt: new Date().toISOString().split('T')[0] }]
          }
        )
      })),

      addMeeting: (collabId, meeting) => set(state => ({
        collaborations: state.collaborations.map(c =>
          c.id !== collabId ? c : {
            ...c,
            meetings: [...c.meetings, { ...meeting, id: `m_${Date.now()}` }]
          }
        )
      })),

      addReview: (collabId, review) => set(state => ({
        collaborations: state.collaborations.map(c =>
          c.id !== collabId ? c : {
            ...c,
            reviews: [...c.reviews, { ...review, id: `rv_${Date.now()}` }]
          }
        )
      })),

      recalculateProgress: (collabId) => set(state => ({
        collaborations: state.collaborations.map(c => {
          if (c.id !== collabId) return c;
          const doneCount = c.tasks.filter(t => t.status === 'done').length;
          const progress = c.tasks.length > 0 ? Math.round((doneCount / c.tasks.length) * 100) : 0;
          return { ...c, progress };
        })
      }))
    }),
    {
      name: 'sidejob-collab-store',
      storage: createJSONStorage(() => taroStorage)
    }
  )
);
