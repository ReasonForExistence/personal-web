<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const projects = []

const selectedIndex = ref(0)

const handleKeydown = (e) => {
  if (projects.length === 0) return
  
  if (e.key === 'ArrowDown' || e.key === 'j') {
    e.preventDefault()
    if (selectedIndex.value < projects.length - 1) selectedIndex.value++
  } else if (e.key === 'ArrowUp' || e.key === 'k') {
    e.preventDefault()
    if (selectedIndex.value > 0) selectedIndex.value--
  } else if (e.key === 'Enter') {
    alert('>> EXEC: OPENING PROJECT: ' + projects[selectedIndex.value].name)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <section class="mt-4">
    <div class="inline-block bg-tui-muted text-tui-bg px-4 py-1 font-bold mb-4 text-xs sm:text-sm uppercase tracking-wider">
      SELECTED_WORK
    </div>
    
    <div class="flex flex-col w-full text-xs sm:text-sm">
      <div class="hidden sm:flex px-4 py-2 border-b border-gray-800 text-tui-muted font-bold">
        <div class="w-1/2">PROJECT</div>
        <div class="w-1/4">CATEGORY</div>
        <div class="w-1/4 text-right">YEAR</div>
      </div>
      
      <div v-if="projects.length === 0" class="px-4 py-8 text-tui-muted text-center border-b border-gray-800 sm:border-none">
        [NO_DATA_AVAILABLE]
      </div>
      
      <div v-else v-for="(project, index) in projects" :key="project.id" 
           @mouseover="selectedIndex = index"
           @click="selectedIndex = index; handleKeydown({key: 'Enter'})"
           :class="['flex flex-col sm:flex-row px-4 py-5 sm:py-2 cursor-pointer transition-colors border-b border-gray-800 sm:border-none gap-2 sm:gap-0', 
                    selectedIndex === index ? 'bg-tui-text text-tui-bg' : 'hover:bg-tui-text hover:text-tui-bg']">
        
        <div class="w-full sm:w-1/2 font-bold text-base sm:text-sm mb-1 sm:mb-0">
          <span v-if="selectedIndex === index" class="hidden sm:inline mr-2">></span>
          {{ project.name }}
        </div>
        
        <div :class="['w-full sm:w-1/4 transition-colors flex justify-between sm:block', selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted']">
          <span :class="['sm:hidden px-1 mr-2', selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted']">TYPE:</span> 
          <span>{{ project.type }}</span>
        </div>
        
        <div :class="['w-full sm:w-1/4 transition-colors flex justify-between sm:text-right sm:block', selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted']">
          <span :class="['sm:hidden px-1 mr-2', selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted']">YEAR:</span> 
          <span>{{ project.year }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
