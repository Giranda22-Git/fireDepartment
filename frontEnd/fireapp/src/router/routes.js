const routes = [
  {
    path: '/',
    component: () => import('layouts/MapLayout.vue'),
    children: [
      { path: '', name: 'main', component: () => import('pages/2GIS.vue') }
    ]
  },
  {
    path: '/settings',
    component: () => import('layouts/SettingLayout.vue'),
    children: [
      { path: '', name: 'settings', component: () => import('pages/Settings.vue') }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Login.vue')
  },
  {
    name: 'error',
    path: '/error',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
