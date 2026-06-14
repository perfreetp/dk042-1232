import { Project, ProjectCategory } from '@/types/project';

export const mockProjects: Project[] = [
  {
    id: 'p1',
    title: '小红书美妆品牌独立站搭建运营',
    category: 'ecommerce',
    description: '打造一个专注于小众美妆品牌的独立站，从0到1搭建并通过小红书种草引流，目标是3个月内实现月销10万GMV。',
    goals: '1. 完成独立站搭建上线\n2. 小红书账号粉丝破万\n3. 月销GMV突破10万',
    budget: '总预算5万，按收益分成模式',
    period: '3-6个月',
    city: '上海',
    riskWarning: '独立站冷启动流量获取难度较大，美妆赛道竞争激烈，需做好6个月内无正向现金流的准备。',
    status: 'recruiting',
    coverImage: 'https://picsum.photos/id/119/750/500',
    founderId: 'u1',
    founderName: '李创业',
    founderAvatar: 'https://picsum.photos/id/64/200/200',
    roles: [
      { id: 'r1', name: '前端开发', skills: ['前端开发', '小程序开发'], slots: 1, filled: 0, description: '负责独立站前端页面开发' },
      { id: 'r2', name: '内容运营', skills: ['内容创作', '短视频'], slots: 2, filled: 1, description: '负责小红书内容策划和发布' },
      { id: 'r3', name: '设计师', skills: ['UI设计', '品牌设计'], slots: 1, filled: 0, description: '负责品牌视觉和产品图设计' }
    ],
    milestones: [
      { id: 'm1', title: '品牌定位与视觉设计', deadline: '2026-07-15', status: 'in_progress' },
      { id: 'm2', title: '独立站开发上线', deadline: '2026-08-01', status: 'pending' },
      { id: 'm3', title: '内容矩阵冷启动', deadline: '2026-08-15', status: 'pending' }
    ],
    tasks: [
      { id: 'pt1', title: '品牌VI设计', description: '完成品牌Logo、色彩、字体等视觉规范', deadline: '2026-07-15', status: 'doing' },
      { id: 'pt2', title: '独立站首页开发', description: '首页页面结构和核心模块开发', deadline: '2026-07-20', status: 'todo' },
      { id: 'pt3', title: '小红书账号冷启动', description: '注册账号并发布前10篇种草笔记', deadline: '2026-08-01', status: 'todo' }
    ],
    createdAt: '2026-06-10',
    tags: ['电商', '美妆', '独立站'],
    totalSlots: 4,
    appliedCount: 12,
    isFavorite: false
  },
  {
    id: 'p2',
    title: '职场成长类播客节目制作',
    category: 'content',
    description: '制作一档面向30+职场人的深度访谈播客，邀请各行业资深人士分享职业成长经验，通过广告和知识付费变现。',
    goals: '1. 上线12期节目\n2. 全平台累计播放10万+\n3. 建立粉丝社群500人',
    budget: '按广告分成+知识付费',
    period: '长期合作',
    city: '北京',
    riskWarning: '播客变现周期长，需要持续投入至少半年以上才可能有正向收益。',
    status: 'recruiting',
    coverImage: 'https://picsum.photos/id/1027/750/500',
    founderId: 'u2',
    founderName: '王主播',
    founderAvatar: 'https://picsum.photos/id/91/200/200',
    roles: [
      { id: 'r1', name: '内容策划', skills: ['内容创作', '营销策划'], slots: 1, filled: 0, description: '选题策划和嘉宾邀约' },
      { id: 'r2', name: '音频剪辑', skills: ['短视频'], slots: 1, filled: 0, description: '音频剪辑和后期制作' }
    ],
    milestones: [
      { id: 'm1', title: '节目定位与嘉宾储备', deadline: '2026-07-01', status: 'pending' }
    ],
    tasks: [
      { id: 'pt1', title: '确定节目定位', description: '明确播客主题方向和目标受众', deadline: '2026-06-25', status: 'todo' },
      { id: 'pt2', title: '邀约首批嘉宾', description: '联系5位以上行业嘉宾确认档期', deadline: '2026-07-01', status: 'todo' }
    ],
    createdAt: '2026-06-08',
    tags: ['播客', '职场', '内容'],
    totalSlots: 2,
    appliedCount: 8,
    isFavorite: true
  },
  {
    id: 'p3',
    title: '自由职业者记账工具',
    category: 'tool',
    description: '开发一款面向自由职业者的轻量级记账与项目管理小程序，支持多币种、发票管理、客户管理等功能。',
    goals: '1. MVP上线\n2. 获取1000名种子用户\n3. 付费转化率5%',
    budget: '股权+后期付费分成',
    period: '2个月MVP',
    city: '深圳',
    riskWarning: 'SaaS工具类产品获客成本高，需要做好长期运营准备。',
    status: 'recruiting',
    coverImage: 'https://picsum.photos/id/201/750/500',
    founderId: 'u3',
    founderName: '张产品',
    founderAvatar: 'https://picsum.photos/id/177/200/200',
    roles: [
      { id: 'r1', name: '全栈开发', skills: ['前端开发', '后端开发', '小程序开发'], slots: 2, filled: 1, description: '负责前后端开发' },
      { id: 'r2', name: 'UI设计师', skills: ['UI设计', '产品设计'], slots: 1, filled: 0, description: '产品UI和交互设计' }
    ],
    milestones: [
      { id: 'm1', title: '需求文档与原型', deadline: '2026-06-30', status: 'completed' },
      { id: 'm2', title: 'MVP开发', deadline: '2026-08-15', status: 'in_progress' }
    ],
    tasks: [
      { id: 'pt1', title: '完成需求文档', description: '梳理核心功能和非功能需求', deadline: '2026-06-30', status: 'done' },
      { id: 'pt2', title: 'UI设计稿', description: '完成主要页面UI设计', deadline: '2026-07-10', status: 'doing' },
      { id: 'pt3', title: '前后端开发', description: 'MVP版本前后端功能开发', deadline: '2026-08-15', status: 'todo' }
    ],
    createdAt: '2026-06-05',
    tags: ['SaaS', '工具', '小程序'],
    totalSlots: 3,
    appliedCount: 15,
    isFavorite: false
  },
  {
    id: 'p4',
    title: '周末城市微旅游策划',
    category: 'offline',
    description: '组织城市年轻人的周末微旅游活动，包括citywalk、探店、手作体验等，通过小程序预约报名收费。',
    goals: '1. 策划20场活动\n2. 服务500人次\n3. 单场盈亏平衡',
    budget: '活动收费分成',
    period: '长期',
    city: '杭州',
    riskWarning: '线下活动受天气和疫情影响较大，需做好备选方案。',
    status: 'in_progress',
    coverImage: 'https://picsum.photos/id/1082/750/500',
    founderId: 'u4',
    founderName: '陈活动',
    founderAvatar: 'https://picsum.photos/id/338/200/200',
    roles: [
      { id: 'r1', name: '活动策划', skills: ['营销策划', '社群运营'], slots: 2, filled: 2, description: '活动策划和社群运营' }
    ],
    milestones: [
      { id: 'm1', title: '首批活动上线', deadline: '2026-06-20', status: 'completed' }
    ],
    tasks: [
      { id: 'pt1', title: '活动场地确认', description: '确认首批5场活动场地和路线', deadline: '2026-06-15', status: 'done' },
      { id: 'pt2', title: '首场活动执行', description: '执行首场citywalk活动', deadline: '2026-06-20', status: 'done' }
    ],
    createdAt: '2026-05-20',
    tags: ['线下', '旅游', '社群'],
    totalSlots: 2,
    appliedCount: 20,
    isFavorite: false
  },
  {
    id: 'p5',
    title: '宠物用品抖音直播带货',
    category: 'ecommerce',
    description: '组建宠物用品直播带货团队，抖音平台运营，聚焦猫狗粮和宠物零食等类目。',
    goals: '1. 账号粉丝5万\n2. 月销50万\n3. 稳定选品100+',
    budget: '佣金分成',
    period: '3个月',
    city: '广州',
    riskWarning: '直播赛道竞争激烈，需要大量前期投入。',
    status: 'recruiting',
    coverImage: 'https://picsum.photos/id/237/750/500',
    founderId: 'me',
    founderName: '我是合伙人',
    founderAvatar: 'https://picsum.photos/id/1005/200/200',
    roles: [
      { id: 'r1', name: '主播', skills: ['销售', '短视频'], slots: 2, filled: 1, description: '直播间主播和短视频出镜' },
      { id: 'r2', name: '运营', skills: ['运营推广', '电商运营'], slots: 1, filled: 0, description: '直播间运营和投流' }
    ],
    milestones: [
      { id: 'm1', title: '账号启动', deadline: '2026-07-01', status: 'pending' }
    ],
    tasks: [],
    createdAt: '2026-06-12',
    recruitEndDate: '2026-06-30',
    tags: ['直播', '宠物', '电商'],
    totalSlots: 3,
    appliedCount: 6,
    isFavorite: true
  },
  {
    id: 'p6',
    title: '程序员技术专栏写作平台',
    category: 'content',
    description: '建立一个面向中高级开发者的技术内容平台，深耕技术深度内容付费专栏，广告和付费课程变现。',
    goals: '1. 专栏文章100篇\n2. 付费用户1000人',
    budget: '付费分成',
    period: '6个月',
    city: '成都',
    riskWarning: '技术内容生产门槛高，需要持续高质量输出。',
    status: 'in_progress',
    coverImage: 'https://picsum.photos/id/1/750/500',
    founderId: 'me',
    founderName: '我是合伙人',
    founderAvatar: 'https://picsum.photos/id/1005/200/200',
    roles: [
      { id: 'r1', name: '技术作者', skills: ['内容创作'], slots: 3, filled: 2, description: '撰写技术文章' }
    ],
    milestones: [],
    tasks: [],
    createdAt: '2026-05-20',
    recruitEndDate: '2026-06-10',
    tags: ['技术', '内容', '付费'],
    totalSlots: 3,
    appliedCount: 4,
    isFavorite: false
  },
  {
    id: 'p7',
    title: '本地生活探店小程序',
    category: 'tool',
    description: '开发本地生活服务类小程序，聚合本地优质吃喝玩乐推荐，商家付费入驻。',
    goals: '1. 覆盖100家商家\n2. 用户1万',
    budget: '商家入驻费+广告',
    period: '4个月',
    city: '武汉',
    riskWarning: '需要较强的线下拓展能力和运营能力。',
    status: 'recruiting',
    coverImage: 'https://picsum.photos/id/431/750/500',
    founderId: 'u7',
    founderName: '周本地',
    founderAvatar: 'https://picsum.photos/id/1012/200/200',
    roles: [
      { id: 'r1', name: 'BD拓展', skills: ['销售', '运营推广'], slots: 2, filled: 0, description: '商家拓展和洽谈' }
    ],
    milestones: [],
    tasks: [],
    createdAt: '2026-06-03',
    tags: ['本地', '小程序', 'O2O'],
    totalSlots: 2,
    appliedCount: 3,
    isFavorite: false
  },
  {
    id: 'p8',
    title: '亲子手工线下手作工作室',
    category: 'offline',
    description: '开设亲子手作工作室，提供陶艺、绘画、手工等线下体验课程。',
    goals: '1. 月客流200人次\n2. 复购率30%',
    budget: '收益分成',
    period: '长期',
    city: '南京',
    riskWarning: '需要固定场地投入，装修和获客成本高。',
    status: 'recruiting',
    coverImage: 'https://picsum.photos/id/582/750/500',
    founderId: 'me',
    founderName: '我是合伙人',
    founderAvatar: 'https://picsum.photos/id/1005/200/200',
    roles: [
      { id: 'r1', name: '手作老师', skills: ['品牌设计', 'UI设计'], slots: 2, filled: 1, description: '手作课程设计和教学' }
    ],
    milestones: [],
    tasks: [
      { id: 'pt1', title: '场地选址与装修', description: '确定工作室位置并完成装修', deadline: '2026-07-15', status: 'todo' },
      { id: 'pt2', title: '课程体系设计', description: '设计5门以上手作课程', deadline: '2026-07-20', status: 'todo' }
    ],
    createdAt: '2026-05-28',
    recruitEndDate: '2026-07-10',
    tags: ['亲子', '手作', '线下'],
    totalSlots: 2,
    appliedCount: 5,
    isFavorite: false
  },
  {
    id: 'p9',
    title: 'AI工具测评自媒体',
    category: 'content',
    description: '做一个专注AI工具测评的自媒体账号，多平台分发，广告和付费社群变现。',
    goals: '1. 全平台粉丝10万\n2. 月更30条内容',
    budget: '广告分成+付费',
    period: '3个月',
    city: '不限城市',
    riskWarning: '需要持续跟进AI行业动态。',
    status: 'recruiting',
    coverImage: 'https://picsum.photos/id/3/750/500',
    founderId: 'u9',
    founderName: '钱AI',
    founderAvatar: 'https://picsum.photos/id/1005/200/200',
    roles: [
      { id: 'r1', name: '内容创作者', skills: ['内容创作', '短视频'], slots: 2, filled: 0, description: '视频脚本和拍摄' }
    ],
    milestones: [],
    tasks: [],
    createdAt: '2026-06-09',
    tags: ['AI', '自媒体', '内容'],
    totalSlots: 2,
    appliedCount: 10,
    isFavorite: true
  },
  {
    id: 'p10',
    title: '二手书循环小程序',
    category: 'tool',
    description: '打造高校二手书交易小程序，以书换书+低价交易模式。',
    goals: '1. 覆盖10所高校\n2. 用户5000人',
    budget: '后期增值服务',
    period: '3个月',
    city: '西安',
    riskWarning: '物流和品控难度较大。',
    status: 'recruiting',
    coverImage: 'https://picsum.photos/id/24/750/500',
    founderId: 'u10',
    founderName: '郑二手',
    founderAvatar: 'https://picsum.photos/id/1006/200/200',
    roles: [
      { id: 'r1', name: '校园合伙人', skills: ['运营推广', '社群运营'], slots: 5, filled: 2, description: '各高校校园推广' }
    ],
    milestones: [],
    tasks: [],
    createdAt: '2026-06-02',
    tags: ['二手', '高校', '小程序'],
    totalSlots: 5,
    appliedCount: 7,
    isFavorite: false
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(p => p.id === id);
};

export const getProjectsByCategory = (category?: ProjectCategory | 'all'): Project[] => {
  if (!category || category === 'all') return mockProjects;
  return mockProjects.filter(p => p.category === category);
};
