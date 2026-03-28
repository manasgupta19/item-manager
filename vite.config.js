import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Allows using 'describe', 'it', 'expect' without imports
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // <--- Add this line
  },
})