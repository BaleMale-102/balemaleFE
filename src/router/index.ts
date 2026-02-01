import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AdminLoginView from '@/views/AdminLoginView.vue'
import AdminDetailView from '@/views/AdminDetailView.vue'
import SelectView from '@/views/SelectView.vue'
import EntryListView from '@/views/EntryListView.vue'
import EntryRegisterView from '@/views/EntryRegisterView.vue'
import EntryCompleteView from '@/views/EntryCompleteView.vue'
import ExitListView from '@/views/ExitListView.vue'
import ExitPaymentView from '@/views/ExitPaymentView.vue'
import ExitCompleteView from '@/views/ExitCompleteView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/admin/login',
    name: 'AdminLoginView',
    component: AdminLoginView
  },
  {
    path: '/admin/detail',
    name: 'AdminDetailView',
    component: AdminDetailView
  },
  {
    path: '/select',
    name: 'SelectView',
    component: SelectView
  },
  {
    path: '/entry/list',
    name: 'EntryListView',
    component: EntryListView
  },
  {
    path: '/entry/register',
    name: 'EntryRegisterView',
    component: EntryRegisterView
  },
  {
    path: '/entry/complete',
    name: 'EntryCompleteView',
    component: EntryCompleteView
  },
  {
    path: '/exit/list',
    name: 'ExitListView',
    component: ExitListView
  },
  { path: '/exit/payment', name: 'ExitPaymentView', component: ExitPaymentView },
  {
    path: '/exit/complete',
    name: 'ExitCompleteView',
    component: ExitCompleteView
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
