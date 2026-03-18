import { createRouter, createWebHistory } from 'vue-router'

import AdminDashboardView from '../views/AdminDashboardView.vue'
import AdminLoginView from '../views/AdminLoginView.vue'
import FormView from '../views/FormView.vue'
import LandingView from '../views/LandingView.vue'
import ThankYouView from '../views/ThankYouView.vue'
import { useAdminAuth } from '../composables/useAdminAuth'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingView },
    { path: '/form', name: 'form', component: FormView },
    { path: '/thank-you', name: 'thankYou', component: ThankYouView },
    { path: '/admin', name: 'adminLogin', component: AdminLoginView },
    { path: '/admin/dashboard', name: 'adminDashboard', component: AdminDashboardView, meta: { admin: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (!to.meta.admin) return true
  const { isAuthed } = useAdminAuth()
  if (!isAuthed.value) return { name: 'adminLogin' }
  return true
})

