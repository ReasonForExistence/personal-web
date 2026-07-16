<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { marked } from 'marked'

const mdFiles = import.meta.glob('../content/blog/**/*.md', { query: '?raw', import: 'default', eager: true })

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

const allFiles = Object.keys(mdFiles).map(path => {
  const rawContent = mdFiles[path]
  const { date, contentID, contentEN, hasTranslation } = parseFrontmatter(rawContent)
  const relativePath = path.replace('../content/blog/', '')
  const rawSizeBytes = new Blob([rawContent]).size
  const size = formatSize(rawSizeBytes)
  
  return {
    permissions: '-rw-r--r--',
    owner: 'agasenka',
    size,
    rawSizeBytes,
    date,
    name: relativePath.split('/').pop(),
    pathPart: relativePath.split('/'),
    contentID,
    contentEN,
    hasTranslation,
    rawContent
  }
})

const currentDir = ref([])
const selectedIndex = ref(0)
const readingPost = ref(null)
const activeLang = ref('ID')

const currentEntries = computed(() => {
  const entries = []
  const currentDepth = currentDir.value.length
  
  if (currentDepth > 0) {
    entries.push({
      type: 'dir',
      name: '..',
      permissions: 'drwxr-xr-x',
      owner: 'agasenka',
      size: '4.0K',
      date: 'System'
    })
  }

  const dirsMap = new Map()
  
  allFiles.forEach(file => {
    let isMatch = true
    for (let i = 0; i < currentDepth; i++) {
      if (file.pathPart[i] !== currentDir.value[i]) {
        isMatch = false
        break
      }
    }
    
    if (isMatch) {
      if (file.pathPart.length === currentDepth + 1) {
        entries.push({
          type: 'file',
          name: file.name,
          permissions: file.permissions,
          owner: file.owner,
          size: file.size,
          date: file.date,
          fileData: file
        })
      } else if (file.pathPart.length > currentDepth + 1) {
        const dirName = file.pathPart[currentDepth]
        if (!dirsMap.has(dirName)) {
          dirsMap.set(dirName, {
            type: 'dir',
            name: dirName,
            permissions: 'drwxr-xr-x',
            owner: 'agasenka',
            rawSizeBytes: 0,
            date: 'System' // Or you could use the most recent file's date here
          })
        }
        // Accumulate size for the directory
        dirsMap.get(dirName).rawSizeBytes += file.rawSizeBytes
      }
    }
  })
  
  // Format the sizes for all directories
  for (const dir of dirsMap.values()) {
    dir.size = formatSize(dir.rawSizeBytes)
    entries.push(dir)
  }
  
  return entries.sort((a, b) => {
    if (a.name === '..') return -1
    if (b.name === '..') return 1
    if (a.type !== b.type) {
      return a.type === 'dir' ? -1 : 1
    }
    return b.name.localeCompare(a.name)
  })
})

const currentPathString = computed(() => {
  if (currentDir.value.length === 0) return '~/blog'
  return `~/blog/${currentDir.value.join('/')}`
})

const handleKeydown = (e) => {
  if (readingPost.value) {
    if (e.key === 'q' || e.key === 'Escape' || e.key === 'Backspace') {
      readingPost.value = null
    } else if ((e.key === 't' || e.key === 'T') && readingPost.value.hasTranslation) {
      activeLang.value = activeLang.value === 'ID' ? 'EN' : 'ID'
    }
    return
  }

  const maxIndex = currentEntries.value.length - 1
  
  if (e.key === 'ArrowDown' || e.key === 'j') {
    if (e.preventDefault) e.preventDefault()
    if (selectedIndex.value < maxIndex) selectedIndex.value++
  } else if (e.key === 'ArrowUp' || e.key === 'k') {
    if (e.preventDefault) e.preventDefault()
    if (selectedIndex.value > 0) selectedIndex.value--
  } else if (e.key === 'Enter' && selectedIndex.value !== -1) {
    if (e.preventDefault) e.preventDefault()
    if (currentEntries.value.length === 0) return
    const entry = currentEntries.value[selectedIndex.value]
    if (entry.type === 'file') {
      readingPost.value = entry.fileData
    } else if (entry.type === 'dir') {
      if (entry.name === '..') {
        currentDir.value.pop()
      } else {
        currentDir.value.push(entry.name)
      }
      selectedIndex.value = 0
    }
  } else if (e.key === 'Backspace' && currentDir.value.length > 0) {
    if (e.preventDefault) e.preventDefault()
    currentDir.value.pop()
    selectedIndex.value = 0
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
        <span class="text-tui-muted font-bold mr-2">$&gt;</span><span class="text-xl font-bold">ls -lh {{ currentPathString }}</span>
      </div>
      
      <div class="text-sm border border-tui-text p-4 md:p-6">
        <div class="text-tui-muted mb-4 font-bold">total {{ currentEntries.length }} entries</div>
        
        <div class="flex flex-col w-full">
          <div :class="['flex gap-2 md:gap-4 px-2 py-1 transition-colors', currentDir.length === 0 ? 'mb-0' : 'mb-4']">
            <span class="w-24 text-tui-muted hidden md:inline-block">drwxr-xr-x</span>
            <span class="w-4 text-tui-muted hidden md:inline-block">2</span>
            <span class="w-16 text-tui-muted hidden md:inline-block">agasenka</span>
            <span class="w-16 text-tui-muted hidden md:inline-block">users</span>
            <span class="w-10 text-right text-tui-muted">4.0K</span>
            <span class="w-12 sm:w-24 text-tui-muted">System</span>
            <span class="font-bold text-blue-400 truncate flex-1">.</span>
          </div>
          
          <div v-if="currentDir.length === 0" class="flex gap-2 md:gap-4 px-2 py-1 transition-colors mb-4">
            <span class="w-24 text-tui-muted hidden md:inline-block">drwxr-xr-x</span>
            <span class="w-4 text-tui-muted hidden md:inline-block">5</span>
            <span class="w-16 text-tui-muted hidden md:inline-block">agasenka</span>
            <span class="w-16 text-tui-muted hidden md:inline-block">users</span>
            <span class="w-10 text-right text-tui-muted">4.0K</span>
            <span class="w-12 sm:w-24 text-tui-muted">System</span>
            <span class="font-bold text-blue-400 truncate flex-1">..</span>
          </div>

          <a href="#" 
             v-for="(entry, index) in currentEntries" 
             :key="entry.name"
             @mouseover="selectedIndex = index"
             @click.prevent="selectedIndex = index; handleKeydown({key: 'Enter', preventDefault: () => {}})"
             :class="['flex gap-2 md:gap-4 px-2 py-1 transition-colors cursor-pointer',
                      selectedIndex === index ? 'bg-tui-text text-tui-bg' : 'hover:bg-tui-muted/20']">
            
            <span :class="[selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted', 'w-24 hidden md:inline-block']">{{ entry.permissions }}</span>
            <span :class="[selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted', 'w-4 hidden md:inline-block']">{{ entry.type === 'dir' ? '2' : '1' }}</span>
            <span :class="[selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted', 'w-16 hidden md:inline-block']">{{ entry.owner }}</span>
            <span :class="[selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted', 'w-16 hidden md:inline-block']">users</span>
            <span :class="[selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted', 'w-10 text-right shrink-0']">{{ entry.size }}</span>
            <span :class="[selectedIndex === index ? 'text-tui-bg' : 'text-tui-muted', 'w-32 sm:w-40 shrink-0']">{{ entry.date.replace(' 2026', '') }}</span>
            <span :class="['font-bold truncate flex-1', selectedIndex === index ? 'text-tui-bg' : (entry.type === 'dir' ? 'text-blue-400' : 'text-tui-text')]">{{ entry.name }}</span>
          </a>
        </div>
      </div>
      
      <div class="mt-4 text-tui-muted text-xs flex gap-4">
        <span><span class="bg-tui-text text-tui-bg px-2 py-1 mr-2 font-bold">[ENTER]</span> OPEN</span>
        <span v-if="currentDir.length > 0"><span class="bg-tui-text text-tui-bg px-2 py-1 mr-2 font-bold">[BACKSPACE]</span> GO BACK</span>
      </div>
    </div>

    <div v-else>
      <div class="mb-4 flex items-center justify-between border-b-2 border-tui-text pb-2">
        <div>
          <span class="text-tui-muted font-bold mr-2">$&gt;</span><span class="font-bold">less {{ currentPathString }}/{{ readingPost.name }}</span>
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
.markdown-body blockquote {
  border-left: 2px solid var(--color-tui-muted);
  padding-left: 1rem;
  color: var(--color-tui-muted);
  font-style: italic;
  margin-bottom: 1rem;
}
.markdown-body a {
  color: #60a5fa;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.markdown-body a:hover {
  color: #93c5fd;
}
</style>
