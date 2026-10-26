@echo off
chcp 65001 >nul
cd /d %~dp0

rem 已经开着就直接开浏览器
powershell -NoProfile -Command "try{$c=New-Object Net.Sockets.TcpClient('127.0.0.1',5173);$c.Close();exit 0}catch{exit 1}" >nul 2>&1
if %errorlevel%==0 goto open

set NODE="C:\Program Files\nodejs\node.exe"
if not exist %NODE% set NODE=node

echo 正在启动本地预览……
start "raine-blog" /min %NODE% node_modules\vite\bin\vite.js --port 5173 --strictPort --host 127.0.0.1
timeout /t 4 >nul

:open
start "" http://127.0.0.1:5173/
