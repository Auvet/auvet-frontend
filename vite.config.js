import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        proxy: {
            '/auth-api': {
                target: 'https://auvet-autenticacao.onrender.com',
                changeOrigin: true,
                secure: true,
                rewrite: function (p) { return p.replace(/^\/auth-api/, '/api'); },
            },
            '/backend-api': {
                target: 'https://auvet-backend.onrender.com',
                changeOrigin: true,
                secure: true,
                rewrite: function (p) { return p.replace(/^\/backend-api/, '/api'); },
            },
        },
    },
});
