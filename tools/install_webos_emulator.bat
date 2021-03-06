@ECHO OFF
:: Set to true to install on a webOS device, false for the emulator
set DEVICE=false

:: Target build directory
set DEPLOY=TickTock

:: Current directory
set BASE=%CD%

cd %BASE%\deploy

rm -f *.ipk
CALL palm-package.bat %DEPLOY%

if %DEVICE% == true (
  :: Use this to install on a connected webOS device
  CALL palm-install.bat -d usb *.ipk
  CALL palm-launch.bat -d usb com.translunardesigns.ticktock
) else (
  :: Use this to install on an emulator
  CALL palm-install.bat -d emulator *.ipk
  CALL palm-launch.bat -d emulator com.translunardesigns.ticktock
)

cd %BASE%
