@ECHO OFF

:: Change this for the specific deploy directory
set TARGET=TopWatch

:: Current directory
set BASE=%CD%

rmdir /S /Q %BASE%\deploy
rmdir /S /Q %BASE%\build

call tools\deploy.bat

xcopy /S /Q /R /Y %BASE%\www\* %BASE%\deploy\%TARGET%\.

