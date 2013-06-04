@ECHO OFF
:: Set to true to install on a webOS device, false for the emulator
set DEVICE=true

:: Target build directory
set DEPLOY=TopWatch_Build

:: Current directory
set BASE=%CD%

cd %BASE%\deploy

rm -f *.ipk
CALL palm-package.bat %DEPLOY%

if %DEVICE% == true (
  :: Use this to install on a connected webOS device
  CALL palm-install.bat -d usb *.ipk
  CALL palm-launch.bat -d usb com.translunardesigns.topwatch
) else (
  :: Use this to install on an emulator
  CALL palm-install.bat -d emulator *.ipk
  CALL palm-launch.bat -d emulator com.translunardesigns.topwatch
)

cd %BASE%
