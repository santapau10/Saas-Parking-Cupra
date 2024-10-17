import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    port: 8080
  },
  plugins: [react()],
  define: {
    'process.env': {
      VITE_REACT_APP_API_URL: process.env.VITE_REACT_APP_API_URL,
    },
  },
});
