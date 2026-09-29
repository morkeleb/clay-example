Output docs/gifs/layout.gif
Set Shell bash
Set FontSize 16
Set Width 1080
Set Height 608
Set Padding 12
Set TypingSpeed 14ms

Hide
Type "export PS1='$ '"
Enter
Type "unset NO_COLOR"
Enter
Type "export FORCE_COLOR=1"
Enter
Type "export TERM=xterm-256color"
Enter
Type "clear"
Enter
Sleep 200ms
Show

Type "clear"
Enter
Type "# Shelf is the demo. One Note, a list, and the selected note."
Enter
Type "# Setup: a Clay model, TypeScript, reader and editor, in-memory store."
Enter
Sleep 5s

Type "clear"
Enter
Type "# The top. clay is the model. src is the running app."
Enter
Sleep 3s
Type `tree -L 1 -C --dirsfirst -I 'node_modules|.git'`
Enter
Sleep 5s

Type "clear"
Enter
Type "# clay/model.json is the source. One folder here per generator."
Enter
Sleep 3s
Type "tree -L 2 -C --dirsfirst clay"
Enter
Sleep 5s

Type "clear"
Enter
Type "# generated is overwritten. logic is the touch file and its spec."
Enter
Sleep 3s
Type "tree -L 2 -C --dirsfirst src/generated src/logic src/runtime"
Enter
Sleep 6s
