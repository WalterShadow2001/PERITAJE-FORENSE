@echo off
cd /d "%~dp0"
title Desplegar a Vercel
color 0B
cls

echo.
echo  ================================================
echo   DESPLEGAR WEB DE LICENCIAS A VERCEL
echo   Peritaje Digital Pro - WalterDP
echo  ================================================
echo.

:: Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  ERROR: Node.js no encontrado.
    echo  Descarga e instala desde: https://nodejs.org
    echo  Marca "Add to PATH" al instalar.
    pause & exit /b 1
)
echo [OK] Node.js: 
node --version

echo.
echo [*] Instalando dependencias...
call npm install --legacy-peer-deps --silent
echo [OK] Listo.

echo.
echo [*] Iniciando deploy a Vercel...
echo     Se abrira el navegador para iniciar sesion.
echo     Cuando pregunte el nombre del proyecto: peritaje-digital-licencias
echo     Cuando pregunte la carpeta: presiona Enter (usa ./)
echo.
call npx vercel --prod --yes

echo.
echo  IMPORTANTE - Ahora configura las variables de entorno:
echo  1. Ve a vercel.com, abre tu proyecto
echo  2. Settings - Environment Variables
echo  3. Agrega las variables del archivo .env.example
echo  4. Settings - Redeploy
echo.
pause
