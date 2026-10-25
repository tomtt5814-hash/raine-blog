@echo off
chcp 65001 >nul
cd /d %~dp0
echo 正在启动本地预览，请稍候……
start "raine-blog" /min cmd /c "npm run dev -- --port 5173 --strictPort --host 127.0.0.1"
timeout /t 4 >nul
start "" http://127.0.0.1:5173/
