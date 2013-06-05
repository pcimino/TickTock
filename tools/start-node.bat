:: Target build directory
set DEPLOY=TickTock

:: Current directory
set BASE=%CD%

cd %BASE%\deploy

rm -f *.ipk
CALL palm-package.bat %DEPLOY%

cd %BASE%

REM Development is the default environment, showing how to do it explicitly
set NODE_ENV=development

node node-server.js
pause