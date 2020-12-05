path=$(grep --exclude-dir=node_modules/ --include=\*.{js,ts} -rnl $1 -e '.listen(')

timeout 5 node $path
if [ $? -eq 124 ]; then
    echo "tudo certo"
    exit 0
else
    echo "servidor falhou ao iniciar"
    exit 1
fi