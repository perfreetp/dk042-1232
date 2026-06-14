import { UserProfile, Skill, Work } from '@/types/user';

export const mockCurrentUser: UserProfile = {
  id: 'me',
  name: '我是合伙人',
  avatar: 'https://picsum.photos/id/1005/200/200',
  city: '杭州',
  skills: [
    { id: 's1', name: '前端开发' },
    { id: 's2', name: '小程序开发' },
    { id: 's3', name: 'UI设计' }
  ],
  availableTime: '每周10-20小时',
  incomeTypes: ['revenue_share', 'project_bonus'],
  works: [
    { id: 'w1', title: '电商小程序', description: '完整的电商小程序项目，月活5000+', imageUrl: 'https://picsum.photos/id/119/400/300' },
    { id: 'w2', title: '企业官网', description: '某科技公司品牌官网设计开发', imageUrl: 'https://picsum.photos/id/201/400/300' }
  ],
  bio: '5年前端开发经验，做过多个从0到1的项目，喜欢折腾副业',
  completedProjects: 3,
  rating: 4.8
};

export const mockUserList: UserProfile[] = [
  mockCurrentUser,
  {
    id: 'u1',
    name: '李创业',
    avatar: 'https://picsum.photos/id/64/200/200',
    city: '上海',
    skills: [{ id: 's1', name: '产品设计' }, { id: 's2', name: '运营推广' }],
    availableTime: '每周20小时以上',
    incomeTypes: ['equity'],
    works: [],
    bio: '连续创业者，热爱电商',
    completedProjects: 5,
    rating: 4.9
  }
];

export const getUserById = (id: string): UserProfile | undefined => {
  return mockUserList.find(u => u.id === id) || mockCurrentUser;
};
