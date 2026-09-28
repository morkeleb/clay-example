Output docs/gifs/add-field.gif
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
Type `comment "Token efficiency: one field in the model."`
Enter
Sleep 3s
Type "vi -u scripts/demo/vimrc clay/model.json"
Enter
Sleep 1s
Type "/Note text."
Enter
Sleep 500ms
Type "jA,"
Escape
Sleep 300ms
Type "o          {"
Enter
Type `            "name": "pinned",`
Enter
Type `            "type": "boolean",`
Enter
Type `            "required": true,`
Enter
Type `            "description": "True when the note stays at the top."`
Enter
Type "          }"
Escape
Sleep 500ms
Type ":wq"
Enter
Sleep 1s

Type "clear"
Enter
Type `comment "Only the type and the page change. Handlers and queries stay put."`
Enter
Sleep 3s
Type "npm run generate"
Enter
Sleep 4s
Type "clear"
Enter
Type "git --no-pager diff --stat"
Enter
Sleep 5s

Type "clear"
Enter
Type `comment "Integrity: tsc fails until the touch file the handler calls returns pinned."`
Enter
Sleep 3s
Type "npm run typecheck"
Enter
Sleep 7s
