export default defineAppConfig({
  pages: [
    'pages/plaza/index',
    'pages/collaborate/index',
    'pages/create/index',
    'pages/profile/index',
    'pages/project-detail/index',
    'pages/profile-edit/index',
    'pages/chat/index',
    'pages/collaborate-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '副业合伙人',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#94A3B8',
    selectedColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/plaza/index',
        text: '广场'
      },
      {
        pagePath: 'pages/collaborate/index',
        text: '协作'
      },
      {
        pagePath: 'pages/create/index',
        text: '发布'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
