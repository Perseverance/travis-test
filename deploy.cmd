::Deployment
echo Handling Propy frontend deployment.

:: 1. Install npm packages
IF EXIST "%DEPLOYMENT_SOURCE%\package.json" (
  pushd "%DEPLOYMENT_SOURCE%"
  call npm install npm@latest -g
  call npm install --no-optional
  call npm cache clean --force
  call npm rebuild node-sass
  
  IF NOT DEFINED IsProdEnvironment (
    SET IsProdEnvironment="false"
  )

  IF /I "%IsProdEnvironment%"=="true" (
     call .\node_modules\.bin\ng build --prod --aot
  ) ELSE (
    call .\node_modules\.bin\ng build --aot
  )
  
  IF /I "%IN_PLACE_DEPLOYMENT%" NEQ "1" (
    call "%KUDU_SYNC_CMD%" -v 50 -f "%DEPLOYMENT_SOURCE%\dist" -t "%DEPLOYMENT_TARGET%" -n "%NEXT_MANIFEST_PATH%" -p "%PREVIOUS_MANIFEST_PATH%" -i ".git;.hg;.deployment;deploy.cmd"
    IF !ERRORLEVEL! NEQ 0 goto error
  )
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)
