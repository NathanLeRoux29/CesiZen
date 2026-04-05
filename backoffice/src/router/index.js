import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Users from '../views/Users.vue'
import Articles from '../views/Articles.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/admin', 
    component: () => import('../components/AdminLayout.vue'),
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'users', component: Users },
      { path: 'articles', component: Articles },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
