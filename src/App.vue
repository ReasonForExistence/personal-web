<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { startMusicEngine } from './composables/useMusic'

const router = useRouter()

const handleGlobalKeydown = (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  
  if (e.key === '1') router.push('/')
  if (e.key === '2') router.push('/projects')
  if (e.key === '3') router.push('/blog')
  if (e.key === '4') router.push('/contact')
}

onMounted(() => {
  startMusicEngine()
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    
    <main class="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
      <router-view />
    </main>
    
    <footer class="hidden sm:flex bg-tui-text text-tui-bg font-bold px-4 py-1.5 justify-between items-center text-sm">
      <div class="flex gap-4">
        <span>[1-4] Navigate</span>
        <span>[&uarr;&darr;] Scroll</span>
        <span>[ENTER] Select</span>
      </div>
      <div>
        <span>&copy;26 ReasonForExistence_</span>
      </div>
    </footer>
  </div>
</template>
