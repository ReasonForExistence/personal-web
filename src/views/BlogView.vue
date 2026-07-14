<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { marked } from 'marked'

const mdFiles = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true })

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + 'B'
  return (bytes / 1024).toFixed(1) + 'K'
}

const parseFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  let date = 'Unknown'
  let cleanContent = content
  
  if (match) {
    const lines = match[1].split('\n')
    lines.forEach(line => {
      if (line.startsWith('date:')) {
        date = line.replace('date:', '').trim()
      }
    })
    cleanContent = content.slice(match[0].length).trim()
  }
  let contentID = cleanContent
  let contentEN = cleanContent
  let hasTranslation = false
  
  if (cleanContent.includes('<!-- EN -->')) {
    const parts = cleanContent.split('<!-- EN -->')
    contentID = parts[0].trim()
    contentEN = parts[1].trim()
    hasTranslation = true
  }
  
  return { date, contentID, contentEN, hasTranslation }
}

const posts = Object.keys(mdFiles).map(path => {
  const rawContent = mdFiles[path]
  const { date, contentID, contentEN, hasTranslation } = parseFrontmatter(rawContent)
  const name = path.split('/').pop()
  const size = formatSize(new Blob([rawContent]).size)
  
  return {
    permissions: '-rw-r--r--',
    owner: 'agasenka',
    size,
    date,
    name,
    contentID,
    contentEN,
    hasTranslation
  }
}).sort((a, b) => b.name.localeCompare(a.name))

const selectedIndex = ref(-1)
const readingPost = ref(null)
const activeLang = ref('ID')

const handleKeydown = (e) => {
  if (readingPost.value) {
    if (e.key === 'q' || e.key === 'Escape' || e.key === 'Backspace') {
      readingPost.value = null
    } else if ((e.key === 't' || e.key === 'T') && readingPost.value.hasTranslation) {
      activeLang.value = activeLang.value === 'ID' ? 'EN' : 'ID'
    }
    return
  }

  if (e.key === 'ArrowDown' || e.key === 'j') {
    if (e.preventDefault) e.preventDefault()
    if (selectedIndex.value < posts.length - 1) selectedIndex.value++
  } else if (e.key === 'ArrowUp' || e.key === 'k') {
    if (e.preventDefault) e.preventDefault()
    if (selectedIndex.value > 0) selectedIndex.value--
  } else if (e.key === 'Enter' && selectedIndex.value !== -1) {
    if (e.preventDefault) e.preventDefault()
    readingPost.value = posts[selectedIndex.value]
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const renderedMarkdown = computed(() => {
  if (!readingPost.value) return ''
  const content = activeLang.value === 'ID' ? readingPost.value.contentID : readingPost.value.contentEN
  return marked(content)
})
</script>

<template>
  <div class="mt-8 font-mono">
    
    <div v-if="!readingPost">
      <div class="mb-6 pb-2 border-b-2 border-tui-text inline-block">
        <span class="text-tui-muted font-bold mr-2">$&gt;</span><span class="text-xl font-bold">ls -lh ~/blog</span>
      </div>
      
      <div class="text-sm border border-tui-text p-4 md:p-6">
        <div class="text-tui-muted mb-4 font-bold">total {{ posts.length }} files</div>
        
        <div class="flex flex-col w-full">
          <div class="flex gap-2 md:gap-4 px-2 py-1 hover:bg-tui-text hover:text-tui-bg transition-colors group">
            <span class="w-24 text-tui-muted group-hover:text-tui-bg hidden md:inline-block">drwxr-xr-x</span>
            <span class="w-4 text-tui-muted group-hover:text-tui-bg hidden md:inline-block">2</span>
            <span class="w-16 text-tui-muted group-hover:text-tui-bg hidden md:inline-block">agasenka</span>
            <span class="w-16 text-tui-muted group-hover:text-tui-bg hidden md:inline-block">users</span>
            <span class="w-10 text-right text-tui-muted group-hover:text-tui-bg">4.0K</span>
            <span class="w-12 sm:w-24 text-tui-muted group-hover:text-tui-bg">System</span>
            <span class="font-bold text-blue-400 group-hover:text-blue-900 truncate flex-1">.</span>
          </div>
          
          <div class="flex gap-2 md:gap-4 px-2 py-1 hover:bg-tui-text hover:text-tui-bg transition-colors mb-4 group">
            <span class="w-24 text-tui-muted group-hover:text-tui-bg hidden md:inline-block">drwxr-xr-x</span>
            <span class="w-4 text-tui-muted group-hover:text-tui-bg hidden md:inline-block">5</span>
            <span class="w-16 text-tui-muted group-hover:text-tui-bg hidden md:inline-block">agasenka</span>
            <span class="w-16 text-tui-muted group-hover:text-tui-bg hidden md:inline-block">users</span>
            <span class="w-10 text-right text-tui-muted group-hover:text-tui-bg">4.0K</span>
            <span class="w-12 sm:w-24 text-tui-muted group-hover:text-tui-bg">System</span>
            <span class="font-bold text-blue-400 group-hover:text-blue-900 truncate flex-1">..</span>
          </div>

          <a href="#" 
             v-for="(post, index) in posts" 
             :key="index"
             @mouseover="selectedIndex = index"
             @click.prevent="selectedIndex = index; handleKeydown({key: 'Enter'})"
             :class="['flex gap-2 md:gap-4 px-2 py-1 transition-colors cursor-pointer',
                      selectedIndex === index ? 'bg-tui-text text-tui-bg' : 'hover:bg-tui-muted/20']">
            
            <span :class="[selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted', 'w-24 hidden md:inline-block']">{{ post.permissions }}</span>
            <span :class="[selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted', 'w-4 hidden md:inline-block']">1</span>
            <span :class="[selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted', 'w-16 hidden md:inline-block']">{{ post.owner }}</span>
            <span :class="[selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted', 'w-16 hidden md:inline-block']">users</span>
            <span :class="[selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted', 'w-10 text-right shrink-0']">{{ post.size }}</span>
            <span :class="[selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted', 'w-16 sm:w-24 shrink-0']">{{ post.date.substring(0,6) }}</span>
            <span :class="['font-bold truncate flex-1', selectedIndex === index ? 'text-tui-bg' : 'text-tui-text']">{{ post.name }}</span>
          </a>
        </div>
      </div>
      
      <div class="mt-4 text-tui-muted text-xs">
        <span class="bg-tui-text text-tui-bg px-2 py-1 mr-2 font-bold">[ENTER]</span> READ FILE
      </div>
    </div>

    <div v-else>
      <div class="mb-4 flex items-center justify-between border-b-2 border-tui-text pb-2">
        <div>
          <span class="text-tui-muted font-bold mr-2">$&gt;</span><span class="font-bold">less {{ readingPost.name }}</span>
        </div>
        <div class="flex gap-2">
          <button v-if="readingPost.hasTranslation" @click="activeLang = activeLang === 'ID' ? 'EN' : 'ID'" class="bg-tui-text text-tui-bg px-3 py-1 text-xs font-bold hover:bg-white transition-colors">
            [T] LANG: {{ activeLang }}
          </button>
          <button @click="readingPost = null" class="bg-tui-text text-tui-bg px-3 py-1 text-xs font-bold hover:bg-white transition-colors">
            [Q] QUIT
          </button>
        </div>
      </div>
      
      <div class="border border-tui-text p-3 sm:p-6 bg-[#0a0a0a] markdown-body overflow-x-auto" v-html="renderedMarkdown"></div>
      
      <div class="mt-4 flex justify-between text-xs text-tui-muted bg-tui-text text-tui-bg p-1 font-bold">
        <span>{{ readingPost.name }} (END)</span>
        <span>Press [Q] to quit</span>
      </div>
    </div>
    
  </div>
</template>

<style>
.markdown-body {
  font-family: inherit;
}
.markdown-body h1 { 
  font-size: 1.5rem; 
  font-weight: bold; 
  margin-bottom: 1.5rem; 
  border-bottom: 1px solid var(--color-tui-muted); 
  padding-bottom: 0.5rem; 
}
.markdown-body h2 { 
  font-size: 1.25rem; 
  font-weight: bold; 
  margin-top: 2rem; 
  margin-bottom: 1rem; 
  color: #ccc; 
}
.markdown-body p { 
  margin-bottom: 1rem; 
  line-height: 1.6; 
}
.markdown-body pre { 
  background-color: #000; 
  border: 1px solid var(--color-tui-muted); 
  padding: 1rem; 
  margin-bottom: 1rem; 
  overflow-x: auto; 
}
.markdown-body code { 
  color: #4ade80;
}
.markdown-body pre code {
  color: inherit;
}
.markdown-body strong { 
  font-weight: bold; 
  color: white; 
}
.markdown-body ul { 
  list-style-type: square; 
  list-style-position: inside; 
  margin-bottom: 1rem; 
}
.markdown-body li { 
  margin-bottom: 0.25rem; 
}
</style>
