Output docs/gifs/reject-unknown-key.gif
Set Shell bash
Set FontSize 16
Set Width 1600
Set Height 900
Set Padding 24
Set TypingSpeed 12ms

Hide
Type "export PS1='$ '"
Enter
Type "unset NO_COLOR"
Enter
Type "export FORCE_COLOR=1"
Enter
Type "export TERM=xterm-256color"
Enter
Type `comment() { printf '\033[33m# %s\033[0m\n' "$*"; }`
Enter
Type "clear"
Enter
Sleep 200ms
Show

Type "clear"
Enter
Type `comment "Poke-yoke: the model rejects a key we did not define."`
Enter
Sleep 3s
Type "vi -u scripts/demo/vimrc clay/model.json"
Enter
Sleep 1s
Type "/mutations"
Enter
Sleep 500ms
Type `O        "commands": [],`
Escape
Sleep 500ms
Type ":wq"
Enter
Sleep 1s

Type "clear"
Enter
Type `comment "An LLM has to model mutations. It cannot invent commands."`
Enter
Sleep 3s
Type "npm run validate"
Enter
Sleep 6s
