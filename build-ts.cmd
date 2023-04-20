@echo off

cd src\main\webapp

echo Clean dist folder..
del /Q .\wux\js\*.*

echo Compile WUX...
call tsc --declaration --project ./ts/wux/tsconfig.json

echo Compile FHW...
call tsc --noEmitHelpers --declaration --project ./ts/fhw/tsconfig.json

rem Install first https://www.npmjs.com/package/minifier
echo Minify...
call minify ./wux/js/wux.js
call minify ./wux/js/fhw.js

rem Install first https://www.npmjs.com/package/uglify-js
rem call uglifyjs -c -o ./wux/js/wux.min.js -m -- ./wux/js/wux.js

echo Minimize foodhub.css..
call uglifycss ./css/theme.css --output ./css/theme.min.css

echo Minimize main.css..
call uglifycss ./css/main.css --output ./css/main.min.css