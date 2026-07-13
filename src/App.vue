<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'

const router = useRouter()

const handleGlobalKeydown = (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  
  if (e.key === '1') router.push('/')
  if (e.key === '2') router.push('/projects')
}

onMounted(() => {
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
    
    <footer class="bg-tui-text text-tui-bg font-bold px-4 py-4 sm:py-1.5 flex flex-col sm:flex-row justify-between items-center text-sm gap-2 sm:gap-0">
      <div class="flex gap-6 sm:gap-4 w-full sm:w-auto justify-center">
        <span>[1-4] Navigate</span>
        <span>[&uarr;&darr;] Scroll</span>
        <span>[ENTER] Select</span>
      </div>
      <div class="w-full sm:w-auto text-center mt-2 sm:mt-0">
        <span>&copy;26 agasenka_</span>
      </div>
    </footer>
  </div>
</template>
