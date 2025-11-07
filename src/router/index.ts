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
      path: '/packages/create',
      name: 'package-create',
      component: () => import('../views/PackageCreateView.vue')
    },
    {
      path: '/packages/:id',
      name: 'package-detail',
      component: () => import('../views/PackageDetailView.vue')
    },
    {
      path: '/plans/:id',
      name: 'plan-detail',
      component: () => import('../views/PlanDetailView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    // RUTE BARU (Fitur 6)
    {
      path: '/packages/:id/edit',
      name: 'package-edit',
      component: () => import('../views/PackageEditView.vue') // Halaman baru
    },
    // RUTE BARU (Fitur 8)
    {
      path: '/packages/:id/plans/create',
      name: 'plan-create',
      component: () => import('../views/PlanCreateView.vue') // Halaman baru
    },
    {
      path: '/plans/:id',
      name: 'plan-detail',
      component: () => import('../views/PlanDetailView.vue')
    },
    // RUTE BARU (Fitur 10)
    {
      path: '/plans/:id/edit',
      name: 'plan-edit',
      component: () => import('../views/PlanEditView.vue') // Halaman baru
    },
  ]
})

export default router
