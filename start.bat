@echo off
@title YumiGate Console
@color a

goto :init

:init
cls
echo ########################################
echo #                                      #
echo #           YumiGate Console           #
echo #                                      #
echo ########################################
echo.
ping 127.0.0.1 -n 2 > nul
echo..
ping 127.0.0.1:3000
echo...
echo....
echo Package : Com.Yuminako.YumiGate
echo Version : 1.0.0
echo Author  : Yuminako Team
echo Github  : https://github.com/yuminako/Gateway
echo ....
echo ....................
echo ..... COMPLETE .....
echo ....................
pause
goto :menu

:menu
cls
echo ########################################
echo #                                      #
echo #           YumiGate Manager           #
echo #                                      #
echo ########################################
echo # [start] : Start Yuminako Server      #
echo # [reset] : Delete Dev Logs            #
echo #                                      #
echo # [exit]  : Exit Program               #
echo ########################################
set /cmd choice=Choose an option :
set /p choice=  [start/reset/exit] :
if %choice%==start goto :start
if %choice%==reset goto :reset
if %choice%==exit goto :exit
goto :menu

:start
cls
echo ########################################
echo #                                      #
echo #         YumiGate Starting...         #
echo #                                      #
echo ########################################
echo #                                      #
echo # [CHECK] : YumiGate Checking...       #
if exist main.js (
    set mainExist= OK !
) else (
    set mainExist= FAIL
)
echo # [Check] : %mainExist%                      #  
echo # [LIB_1] : Library cheking ( 1 / 2 )  #
if exist template\index.html (
    if exist template\assets\ (
        set libExist= OK !
    ) else (
        set libExist= FAIL
    )
) else (
    set libExist= FAIL
)
echo # [LIB_1] : %libExist%                      #
echo # [LIB_2] : Library cheking ( 2 / 2 )  #
if exist assets\gateway.js (
    if exist assets\node.js (
        if exist assets\server.js (
            set assets= OK !
        ) else (
            set assets= FAIL
        )
    ) else (
        set assets= FAIL
    )
) else (
    set assets= FAIL
)

echo # [LIB_2] : %assets%                      #
echo # [LIB_3] : Library cheking ( 3 / 3 )  #
if exist node_modules\.package-lock.json (
    set node= OK !
) else (
    set node= FAIL
)
echo # [LIB_3] : %node%                      #
echo #                                      #
echo # [START]  : Starting Gateway...       #
echo #                                      #
if "%mainExist%"=="OK !" (
    if "%libExist%"=="OK !" (
        if "%assets%"=="OK !" (
            if "%node%"=="OK !" (
               
echo # [START]  : Starting Gateway...       #
            ) else (
echo # [FAIL]   : Gateway Dont Working      #
            )
        ) else (
echo # [FAIL]   : Gateway Dont Working      #
        )
    ) else (
echo # [FAIL]   : Gateway Dont Working      #
    )
) else (
echo # [FAIL]   : Gateway Dont Working      #
)
node main.js
echo #                                      #
echo # [STOP]   : Gateway Was Stoped        #
echo #                                      #
echo ########################################
pause
goto :menu

:reset
cls
echo ########################################
echo #                                      #
echo #         YumiGate Resetting...        #
echo #                                      #
echo ########################################
echo #                                      #
echo # [RESET]  : Resetting Gateway...      #
if exist log.ym (
    echo # [RESET]  : COMPLETE !                #
) else (
    echo # [RESET]  : FAIL !                    #
)
echo #                                      #
echo ########################################
pause
goto :menu

:exit
cls
echo ########################################
echo #                                      #
echo #         YumiGate Exiting...          #
echo #                                      #
echo ########################################
echo #                                      #
echo # [EXIT]   : Exiting Gateway...        #
echo #                                      #
echo ########################################
pause
exit