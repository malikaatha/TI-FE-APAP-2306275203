import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/packages',
      name: 'packages-list',
      component: () => import('../views/PackagesListPage.vue')
    },
    {
      path: '/packages/:id',
      name: 'package-detail',
      component: () => import('../views/PackageDetailView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
