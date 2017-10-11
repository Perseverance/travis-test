::Deployment
echo Handling swip frontend deployment.

:: 1. Install npm packages
IF EXIST "%DEPLOYMENT_SOURCE%\package.json" (
  pushd "%DEPLOYMENT_SOURCE%"
  call npm install npm@latest -g
  call npm install
  call npm cache clean  
  call ng build
  IF /I "%IN_PLACE_DEPLOYMENT%" NEQ "1" (
    call "%KUDU_SYNC_CMD%" -v 50 -f "%DEPLOYMENT_SOURCE%\dist" -t "%DEPLOYMENT_TARGET%" -n "%NEXT_MANIFEST_PATH%" -p "%PREVIOUS_MANIFEST_PATH%" -i ".git;.hg;.deployment;deploy.cmd"
    IF !ERRORLEVEL! NEQ 0 goto error
  )
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)