import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ContactView from '../views/ContactView.vue'
import BlogView from '../views/BlogView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/projects', name: 'projects', component: ProjectsView },
    { path: '/blog', name: 'blog', component: BlogView },
    { path: '/contact', name: 'contact', component: ContactView }
  ]
})

export default router
