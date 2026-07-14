<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const contacts = [
  { name: 'INSTAGRAM', href: 'https://instagram.com/agasenka_', value: '@agasenka_', target: '_blank' },
  { name: 'GITHUB', href: 'https://github.com/agasenka', value: 'github.com/agasenka', target: '_blank' }
]

const selectedIndex = ref(0)

const handleKeydown = (e) => {
  if (e.key === 'ArrowDown' || e.key === 'j') {
    if (e.preventDefault) e.preventDefault()
    if (selectedIndex.value < contacts.length - 1) selectedIndex.value++
  } else if (e.key === 'ArrowUp' || e.key === 'k') {
    if (e.preventDefault) e.preventDefault()
    if (selectedIndex.value > 0) selectedIndex.value--
  } else if (e.key === 'Enter') {
    if (e.preventDefault) e.preventDefault()
    const contact = contacts[selectedIndex.value]
    if (contact.target === '_blank') {
      window.open(contact.href, '_blank')
    } else {
      window.location.href = contact.href
    }
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
  <div class="mt-8">
    <h1 class="text-2xl font-bold mb-6 pb-2 border-b-2 border-tui-text inline-block">>> CONTACT_ME</h1>
    
    <div class="mt-4">
      <p class="mb-6 text-tui-muted">/* REACH OUT VIA THE FOLLOWING CHANNELS */</p>
      
      <div class="flex flex-col gap-4 max-w-lg">
        <a v-for="(contact, index) in contacts" 
           :key="index"
           :href="contact.href"
           :target="contact.target"
           @mouseover="selectedIndex = index"
           @click.prevent="selectedIndex = index; handleKeydown({key: 'Enter'})"
           :class="['group border border-tui-text p-4 transition-colors flex items-center justify-between',
                    selectedIndex === index ? 'bg-tui-text text-tui-bg' : 'hover:bg-tui-text hover:text-tui-bg']">
          <div>
            <span :class="['block text-sm transition-colors mb-1',
                           selectedIndex === index ? 'text-tui-bg/70' : 'text-tui-muted group-hover:text-tui-bg/70']">
              $&gt; {{ contact.name }}
            </span>
            <span class="font-bold text-lg">
              <span v-if="selectedIndex === index" class="mr-2">></span>
              {{ contact.value }}
            </span>
          </div>
          <span class="font-bold hidden sm:block">[ ENTER ]</span>
        </a>
      </div>
    </div>
  </div>
</template>
