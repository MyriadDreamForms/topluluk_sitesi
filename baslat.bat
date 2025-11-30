@echo off
chcp 65001 >nul
title TechCommunity - Başlatıcı

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║          🚀 TechCommunity Platform Başlatılıyor 🚀           ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: node_modules kontrolü
if not exist "%~dp0frontend\node_modules" (
    echo ❌ Kurulum yapılmamış görünüyor!
    echo.
    echo Önce 'kurulum.bat' dosyasını çalıştırın.
    echo.
    pause
    exit /b 1
)

echo ══════════════════════════════════════════════════════════════
echo.
echo   Frontend ve Backend ayrı pencerelerde başlatılacak...
echo.
echo   🌐 Frontend: http://localhost:4200
echo   🔧 Backend:  http://localhost:5000 (API)
echo.
echo   ⚠️  Backend aktif olmadan da frontend çalışır (Demo mod)
echo.
echo ══════════════════════════════════════════════════════════════
echo.

:: Frontend'i yeni pencerede başlat
echo [1/2] Frontend başlatılıyor...
start "TechCommunity - Frontend" cmd /k "cd /d "%~dp0frontend" && title TechCommunity - Frontend [http://localhost:4200] && echo. && echo 🌐 Frontend başlatılıyor... && echo. && npm start"

:: 3 saniye bekle
timeout /t 3 /nobreak >nul

:: Backend'i yeni pencerede başlat
echo [2/2] Backend başlatılıyor...
start "TechCommunity - Backend" cmd /k "cd /d "%~dp0backend\src\TechCommunity.API" && title TechCommunity - Backend [http://localhost:5000] && echo. && echo 🔧 Backend başlatılıyor... && echo. && dotnet run"

echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo ✅ Servisler başlatıldı!
echo.
echo    Tarayıcınızda açmak için birkaç saniye bekleyin...
echo.
echo ══════════════════════════════════════════════════════════════
echo.

:: 5 saniye bekle ve tarayıcıyı aç
timeout /t 5 /nobreak >nul
start http://localhost:4200

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║   📝 NOT: Servisleri durdurmak için açılan terminal         ║
echo ║      pencerelerini kapatın veya Ctrl+C tuşlayın.            ║
echo ║                                                              ║
echo ║   Bu pencereyi kapatabilirsiniz.                            ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
pause
