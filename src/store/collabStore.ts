import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { Collaboration, TaskItem, FileLink, MeetingNote, ReviewNote, Collaborator } from '@/types/collaborate';
import { mockCollaborations } from '@/data/collaborate';

interface CollabState {
  collaborations: Collaboration[];

  getCollabById: (id: string) => Collaboration | undefined;
  getMyCollaborations: () => Collaboration[];
  createCollaboration: (data: {
    projectId: string;
    projectTitle: string;
    coverImage: string;
    founder: { id: string; name: string; avatar: string };
    members: { id: string; name: string; avatar: string; role: string }[];
    tasks?: Omit<TaskItem, 'id'>[];
  }) => Collaboration;
  addCollaborator: (collabId: string, member: Omit<Collaborator, 'id' | 'joinedAt'>) => void;
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

      createCollaboration: (data) => {
        const today = new Date().toISOString().split('T')[0];
        const collaborators: Collaborator[] = [
          { id: `col_${data.founder.id}`, userId: data.founder.id, name: data.founder.name, avatar: data.founder.avatar, role: '发起人', joinedAt: today },
          ...data.members.map((m, i) => ({
            id: `col_${m.id}_${i}`,
            userId: m.id,
            name: m.name,
            avatar: m.avatar,
            role: m.role,
            joinedAt: today
          }))
        ];
        const tasks: TaskItem[] = (data.tasks || []).map((t, i) => ({
          ...t,
          id: `t_${Date.now()}_${i}`
        }));
        const newCollab: Collaboration = {
          id: `c_${Date.now()}`,
          projectId: data.projectId,
          projectTitle: data.projectTitle,
          coverImage: data.coverImage,
          collaborators,
          progress: 0,
          tasks,
          files: [],
          meetings: [],
          reviews: [],
          status: 'active'
        };
        set(state => ({ collaborations: [newCollab, ...state.collaborations] }));
        return newCollab;
      },

      addCollaborator: (collabId, member) => set(state => ({
        collaborations: state.collaborations.map(c =>
          c.id !== collabId ? c : {
            ...c,
            collaborators: [
              ...c.collaborators,
              { ...member, id: `col_${Date.now()}`, joinedAt: new Date().toISOString().split('T')[0] }
            ]
          }
        )
      })),

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
