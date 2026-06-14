import { Collaboration } from '@/types/collaborate';

export const mockCollaborations: Collaboration[] = [
  {
    id: 'c1',
    projectId: 'p4',
    projectTitle: '周末城市微旅游策划',
    coverImage: 'https://picsum.photos/id/1082/750/500',
    collaborators: [
      { id: 'col1', userId: 'u4', name: '陈活动', avatar: 'https://picsum.photos/id/338/200/200', role: '发起人', joinedAt: '2026-05-20' },
      { id: 'col2', userId: 'me', name: '我是合伙人', avatar: 'https://picsum.photos/id/1005/200/200', role: '活动策划', joinedAt: '2026-05-25' }
    ],
    progress: 35,
    milestones: [
      { id: 'ms1', title: '路线规划完成', deadline: '2026-06-10', status: 'completed' },
      { id: 'ms2', title: '商家合作洽谈', deadline: '2026-06-25', status: 'in_progress' },
      { id: 'ms3', title: '首批活动上线', deadline: '2026-07-01', status: 'pending' }
    ],
    tasks: [
      { id: 't1', title: '完成西湖citywalk路线规划', description: '规划3条不同主题的citywalk路线', assigneeId: 'me', status: 'done', deadline: '2026-06-10' },
      { id: 't2', title: '联系3家探店合作', description: '与咖啡馆/书店达成合作', assigneeId: 'u4', status: 'doing', deadline: '2026-06-20' },
      { id: 't3', title: '活动海报设计', description: '设计首批活动宣传海报', assigneeId: 'me', status: 'todo', deadline: '2026-06-25' }
    ],
    files: [
      { id: 'f1', name: '活动方案V1.0.docx', url: '#', uploadedAt: '2026-06-01', uploadedBy: '陈活动' }
    ],
    meetings: [
      { id: 'm1', title: '首次项目启动会', content: '讨论活动方向、分工、时间节点确认', date: '2026-05-28', attendees: ['陈活动', '我是合伙人'] }
    ],
    reviews: [
      { id: 'rv1', phase: '第一阶段复盘', achievements: '完成了活动策划和路线初步规划', improvements: '需要加快合作洽谈进度', nextSteps: '确定首批活动上线宣传', date: '2026-06-08' }
    ],
    status: 'active'
  },
  {
    id: 'c2',
    projectId: 'p3',
    projectTitle: '自由职业者记账工具',
    coverImage: 'https://picsum.photos/id/201/750/500',
    collaborators: [
      { id: 'col1', userId: 'u3', name: '张产品', avatar: 'https://picsum.photos/id/177/200/200', role: '产品经理', joinedAt: '2026-06-01' },
      { id: 'col2', userId: 'me', name: '我是合伙人', avatar: 'https://picsum.photos/id/1005/200/200', role: '前端开发', joinedAt: '2026-06-05' }
    ],
    progress: 50,
    milestones: [
      { id: 'ms1', title: '需求文档完成', deadline: '2026-06-01', status: 'completed' },
      { id: 'ms2', title: 'MVP开发', deadline: '2026-07-15', status: 'in_progress' }
    ],
    tasks: [
      { id: 't1', title: '记账页面开发', description: '完成记账列表和新增功能', assigneeId: 'me', status: 'done', deadline: '2026-06-15' },
      { id: 't2', title: '报表模块开发', description: '统计图表展示', assigneeId: 'me', status: 'doing', deadline: '2026-06-30' }
    ],
    files: [],
    meetings: [],
    reviews: [],
    status: 'active'
  }
];

export const getCollaborationById = (id: string): Collaboration | undefined => {
  return mockCollaborations.find(c => c.id === id);
};
