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
    {
      path: '/packages/:id/edit',
      name: 'package-edit',
      component: () => import('../views/PackageEditView.vue')
    },
    {
      path: '/packages/:id/plans/create',
      name: 'plan-create',
      component: () => import('../views/PlanCreateView.vue')
    },
    {
      path: '/plans/:id',
      name: 'plan-detail',
      component: () => import('../views/PlanDetailView.vue')
    },
    {
      path: '/plans/:id/edit',
      name: 'plan-edit',
      component: () => import('../views/PlanEditView.vue')
    },
        {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/StatisticsView.vue')
    },
        {
      path: '/loyalty/coupons',
      name: 'loyalty-coupons',
      component: () => import('../views/loyalty/AvailableCouponsView.vue')
    },
    {
      path: '/loyalty/my-coupons',
      name: 'loyalty-my-coupons',
      component: () => import('../views/loyalty/PurchasedCouponsView.vue')
    },
    {
      path: '/loyalty/create',
      name: 'loyalty-create',
      component: () => import('../views/loyalty/CouponFormView.vue')
    },
    {
      path: '/loyalty/edit/:id',
      name: 'loyalty-edit',
      component: () => import('../views/loyalty/CouponFormView.vue')
    },
        {
      path: '/activities',
      name: 'activity-list',
      component: () => import('../views/ActivityListView.vue')
    },
    {
      path: '/activities/create',
      name: 'activity-create',
      component: () => import('../views/ActivityFormView.vue')
    },
    {
      path: '/activities/:id',
      name: 'activity-detail',
      component: () => import('../views/ActivityDetailView.vue')
    },
    {
      path: '/activities/:id/edit',
      name: 'activity-edit',
      component: () => import('../views/ActivityFormView.vue')
    },
  ]
})

export default router
