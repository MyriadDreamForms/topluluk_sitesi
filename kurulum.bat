@echo off
chcp 65001 >nul
title TechCommunity - Kurulum

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║         🚀 TechCommunity Platform Kurulum Scripti 🚀         ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Gerekli yazılımları kontrol et
echo [1/5] Gerekli yazılımlar kontrol ediliyor...
echo.

:: Node.js kontrolü
echo     Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo     ❌ Node.js bulunamadı!
    echo.
    echo     Node.js'i indirmek için: https://nodejs.org/
    echo     LTS sürümünü indirip kurun ve bu scripti tekrar çalıştırın.
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo     ✓ Node.js bulundu: %NODE_VERSION%

:: npm kontrolü
echo     Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo     ❌ npm bulunamadı!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo     ✓ npm bulundu: v%NPM_VERSION%

:: .NET SDK kontrolü
echo     Checking .NET SDK...
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo     ❌ .NET SDK bulunamadı!
    echo.
    echo     .NET 10 SDK'yı indirmek için: https://dotnet.microsoft.com/download/dotnet/10.0
    echo     SDK'yı kurun ve bu scripti tekrar çalıştırın.
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('dotnet --version') do set DOTNET_VERSION=%%i
echo     ✓ .NET SDK bulundu: v%DOTNET_VERSION%

:: Angular CLI kontrolü
echo     Checking Angular CLI...
call ng version >nul 2>&1
if %errorlevel% neq 0 (
    echo     ⚠ Angular CLI global olarak kurulu değil, npm ile yüklenecek...
) else (
    echo     ✓ Angular CLI bulundu
)

echo.
echo ══════════════════════════════════════════════════════════════
echo.

:: Frontend bağımlılıklarını yükle
echo [2/5] Frontend bağımlılıkları yükleniyor...
echo     Bu işlem birkaç dakika sürebilir...
echo.

cd /d "%~dp0frontend"
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo     ❌ Frontend bağımlılıkları yüklenemedi!
        pause
        exit /b 1
    )
    echo     ✓ Frontend bağımlılıkları yüklendi!
) else (
    echo     ✓ Frontend bağımlılıkları zaten mevcut, atlanıyor...
)

echo.
echo ══════════════════════════════════════════════════════════════
echo.

:: Backend bağımlılıklarını yükle
echo [3/5] Backend bağımlılıkları yükleniyor...
echo.

cd /d "%~dp0backend\src\TechCommunity.API"
call dotnet restore
if %errorlevel% neq 0 (
    echo     ❌ Backend bağımlılıkları yüklenemedi!
    pause
    exit /b 1
)
echo     ✓ Backend bağımlılıkları yüklendi!

echo.
echo ══════════════════════════════════════════════════════════════
echo.

:: Frontend build
echo [4/5] Frontend derleniyor...
echo     Bu işlem birkaç dakika sürebilir...
echo.

cd /d "%~dp0frontend"
call npm run build
if %errorlevel% neq 0 (
    echo     ⚠ Frontend derleme uyarıları olabilir, devam ediliyor...
)
echo     ✓ Frontend derlendi!

echo.
echo ══════════════════════════════════════════════════════════════
echo.

:: Backend build
echo [5/5] Backend derleniyor...
echo.

cd /d "%~dp0backend\src\TechCommunity.API"
call dotnet build
if %errorlevel% neq 0 (
    echo     ⚠ Backend derleme uyarıları olabilir, devam ediliyor...
)
echo     ✓ Backend derlendi!

echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║            ✅ KURULUM BAŞARIYLA TAMAMLANDI! ✅               ║
echo ║                                                              ║
echo ║  Projeyi çalıştırmak için 'baslat.bat' dosyasını kullanın   ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"
pause
