import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: { // /api 로 요청이 들어가면 http://localhost:9090 으로 요청을 보낸다.
            '/api': {
                target: 'http://localhost:9090',
                changeOrigin: true, // 프록시로 넘길 때 요청의 출발지(origin) 정보를 대상 서버에 맞게 바꿔줄지 여부
            },
        },
    },
})