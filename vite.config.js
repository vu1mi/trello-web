import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
// https://vite.dev/config/
export default defineConfig({
  //cho phep vite xu dung process.env de lay cac bien moi truong tu file .env
  plugins: [react(), svgr()],
  resolve: {
    alias: [{ find: '~', replacement: '/src' }],
  },
});
