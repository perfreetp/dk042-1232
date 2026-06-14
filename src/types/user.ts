export type IncomeType = 'revenue_share' | 'fixed_salary' | 'equity' | 'project_bonus';

export interface Skill {
  id: string;
  name: string;
}

export interface Work {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  city: string;
  skills: Skill[];
  availableTime: string;
  incomeTypes: IncomeType[];
  works: Work[];
  bio: string;
  completedProjects: number;
  rating: number;
}

export const INCOME_TYPE_MAP: Record<IncomeType, string> = {
  revenue_share: '收益分成',
  fixed_salary: '固定报酬',
  equity: '股权',
  project_bonus: '项目奖金'
};

export const AVAILABLE_TIME_OPTIONS = [
  '每周5小时以下',
  '每周5-10小时',
  '每周10-20小时',
  '每周20小时以上'
];

export const SKILL_OPTIONS = [
  '产品设计', 'UI设计', '前端开发', '后端开发', '小程序开发',
  '运营推广', '内容创作', '短视频', '摄影', '社群运营',
  '电商运营', '供应链', '销售', '财务', '法律',
  '项目管理', '数据分析', '营销策划', '品牌设计', '摄影摄像'
];

export const CITY_OPTIONS = [
  '北京', '上海', '广州', '深圳', '杭州',
  '成都', '武汉', '西安', '南京', '苏州',
  '重庆', '长沙', '天津', '青岛', '厦门',
  '不限城市'
];
