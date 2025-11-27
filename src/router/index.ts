import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { login } from '@/services/auth.service'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/packages',
      name: 'packages-list',
      component: () => import('../views/PackagesListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/packages/create',
      name: 'package-create',
      component: () => import('../views/PackageCreateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/packages/:id',
      name: 'package-detail',
      component: () => import('../views/PackageDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/plans/:id',
      name: 'plan-detail',
      component: () => import('../views/PlanDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/packages/:id/edit',
      name: 'package-edit',
      component: () => import('../views/PackageEditView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/packages/:id/plans/create',
      name: 'plan-create',
      component: () => import('../views/PlanCreateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/plans/:id/edit',
      name: 'plan-edit',
      component: () => import('../views/PlanEditView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/StatisticsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/loyalty/coupons',
      name: 'loyalty-coupons',
      component: () => import('../views/loyalty/AvailableCouponsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/loyalty/my-coupons',
      name: 'loyalty-my-coupons',
      component: () => import('../views/loyalty/PurchasedCouponsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/loyalty/create',
      name: 'loyalty-create',
      component: () => import('../views/loyalty/CouponFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/loyalty/edit/:id',
      name: 'loyalty-edit',
      component: () => import('../views/loyalty/CouponFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activities',
      name: 'activity-list',
      component: () => import('../views/ActivityListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activities/create',
      name: 'activity-create',
      component: () => import('../views/ActivityFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activities/:id',
      name: 'activity-detail',
      component: () => import('../views/ActivityDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activities/:id/edit',
      name: 'activity-edit',
      component: () => import('../views/ActivityFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/auth/ott',
      name: 'auth-ott',
      component: () => import('../views/auth/OTTHandler.vue')
      // Public route - no auth required
    }
  ]
})

// Authentication guard
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    // Redirect to SSO login - login() will handle returnUrl
    login()
    return
  }

  next()
})

export default router
