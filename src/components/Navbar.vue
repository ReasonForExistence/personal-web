<template>
  <header class="bg-tui-text text-tui-bg font-bold px-0 sm:px-4 flex flex-col sm:flex-row justify-between items-center text-sm sm:text-base border-b-4 border-tui-muted sm:border-none">
    <div class="w-full sm:w-auto text-center sm:text-left py-4 sm:py-1.5 bg-tui-text text-tui-bg max-w-full overflow-hidden">
      <span class="tracking-widest font-extrabold text-lg sm:text-base truncate block sm:inline px-4 sm:px-0">REASONFOREXISTENCE_</span>
    </div>
    
    <nav class="flex flex-wrap w-full sm:w-auto">
      <router-link to="/" class="w-1/2 sm:w-auto text-center px-2 py-4 sm:py-1.5 hover:bg-tui-bg hover:text-tui-text transition-colors border-t border-r border-gray-700 sm:border-none" active-class="bg-tui-bg text-tui-text">
        [1] ABOUT
      </router-link>
      <router-link to="/projects" class="w-1/2 sm:w-auto text-center px-2 py-4 sm:py-1.5 hover:bg-tui-bg hover:text-tui-text transition-colors border-t border-gray-700 sm:border-none" active-class="bg-tui-bg text-tui-text">
        [2] WORK
      </router-link>
      <router-link to="/blog" class="w-1/2 sm:w-auto text-center px-2 py-4 sm:py-1.5 hover:bg-tui-bg hover:text-tui-text transition-colors border-t border-r border-gray-700 sm:border-none" active-class="bg-tui-bg text-tui-text">
        [3] BLOG
      </router-link>
      <router-link to="/contact" class="w-1/2 sm:w-auto text-center px-2 py-4 sm:py-1.5 hover:bg-tui-bg hover:text-tui-text transition-colors border-t border-gray-700 sm:border-none" active-class="bg-tui-bg text-tui-text">
        [4] CONTACT
      </router-link>
    </nav>
  </header>
</template>
