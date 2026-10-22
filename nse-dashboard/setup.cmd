@echo off
cd /d "%~dp0"
node scripts\setup.mjs
if errorlevel 1 pause
