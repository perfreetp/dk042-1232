import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { Collaboration, TaskItem, FileLink, MeetingNote, ReviewNote, Collaborator, Milestone } from '@/types/collaborate';
import { mockCollaborations } from '@/data/collaborate';

interface CollabState {
  collaborations: Collaboration[];

  getCollabById: (id: string) => Collaboration | undefined;
  getCollabByProjectId: (projectId: string) => Collaboration | undefined;
  getMyCollaborations: () => Collaboration[];
  createCollaboration: (data: {
    projectId: string;
    projectTitle: string;
    coverImage: string;
    founder: { id: string; name: string; avatar: string };
    members: { id: string; name: string; avatar: string; role: string }[];
    milestones?: Omit<Milestone, 'id'>[];
    tasks?: Omit<TaskItem, 'id'>[];
  }) => Collaboration;
  addCollaborator: (collabId: string, member: Omit<Collaborator, 'id' | 'joinedAt'>) => void;
  updateTask: (collabId: string, taskId: string, data: Partial<TaskItem>) => void;
  updateTaskStatus: (collabId: string, taskId: string, status: TaskItem['status']) => void;
  addTask: (collabId: string, task: Omit<TaskItem, 'id'>) => void;
  updateMilestone: (collabId: string, milestoneId: string, data: Partial<Milestone>) => void;
  addMilestone: (collabId: string, milestone: Omit<Milestone, 'id'>) => void;
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

      getCollabByProjectId: (projectId) => get().collaborations.find(c => c.projectId === projectId),

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
        const milestones: Milestone[] = (data.milestones || []).map((m, i) => ({
          ...m,
          id: `ms_${Date.now()}_${i}`
        }));
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
          milestones,
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

      updateTask: (collabId, taskId, data) => set(state => ({
        collaborations: state.collaborations.map(c => {
          if (c.id !== collabId) return c;
          const tasks = c.tasks.map(t => t.id === taskId ? { ...t, ...data } : t);
          const doneCount = tasks.filter(t => t.status === 'done').length;
          const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : c.progress;
          return { ...c, tasks, progress };
        })
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

      updateMilestone: (collabId, milestoneId, data) => set(state => ({
        collaborations: state.collaborations.map(c =>
          c.id !== collabId ? c : {
            ...c,
            milestones: c.milestones.map(m =>
              m.id === milestoneId ? { ...m, ...data } : m
            )
          }
        )
      })),

      addMilestone: (collabId, milestone) => set(state => ({
        collaborations: state.collaborations.map(c =>
          c.id !== collabId ? c : {
            ...c,
            milestones: [...c.milestones, { ...milestone, id: `ms_${Date.now()}` }]
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
