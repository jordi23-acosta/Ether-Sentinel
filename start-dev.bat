@echo off
echo ========================================
echo   Ether Sentinel - Modo Desarrollo
echo ========================================
echo.

echo [1/2] Iniciando Backend...
start "Backend - Ether Sentinel" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo [2/2] Iniciando Frontend...
start "Frontend - Ether Sentinel" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servicios iniciados correctamente
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
