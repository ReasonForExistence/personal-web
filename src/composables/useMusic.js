import { ref } from 'vue'

export const eqState = ref('▃▄▅█▆▄▃▂')
export const progressSeconds = ref(0)
export const totalSeconds = 269
export const rainState = ref([
  '        ',
  '        ',
  '        ',
  '        '
])

let isPlaying = false

export const startMusicEngine = () => {
  if (isPlaying) return
  isPlaying = true

  const chars = [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█']
  const rainChars = [' ', ' ', ' ', ' ', '|', '.', ',']
  
  setInterval(() => {
    let bars = ''
    for(let i = 0; i < 8; i++) {
      bars += chars[Math.floor(Math.random() * chars.length)]
    }
    eqState.value = bars
  }, 150)

  setInterval(() => {
    let newRow = ''
    for(let i = 0; i < 8; i++) {
      newRow += rainChars[Math.floor(Math.random() * rainChars.length)]
    }
    rainState.value = [newRow, rainState.value[0], rainState.value[1], rainState.value[2]]
  }, 200)

  setInterval(() => {
    if (progressSeconds.value < totalSeconds) {
      progressSeconds.value++
    }
  }, 1000)
}
