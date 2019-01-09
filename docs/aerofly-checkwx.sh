cd ~/Documents/Aerofly FS 2 # Replace with actual save data directory
cp main.mcf main.bak
#  Replace 12345abcd with actual API key
CHECKWX_APIKEY=12345abcd
aerofly-checkwx $1 %CHECKWX_APIKEY% --verbose
