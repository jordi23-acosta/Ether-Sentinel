@echo off
echo ========================================
echo   Ether Sentinel - Modo Desarrollo
echo   Backend: Python + Flask
echo ========================================
echo.

echo [1/2] Iniciando Backend Python...
start "Backend Python - Ether Sentinel" cmd /k "cd backend-python && python app.py"
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
