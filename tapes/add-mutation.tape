Output docs/gifs/add-mutation.gif
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
Type `comment "Token efficiency: one mutation writes the form, the handler, and the touch files."`
Enter
Sleep 3s
Type "vi -u scripts/demo/vimrc clay/model.json"
Enter
Sleep 1s
Type "/New title."
Enter
Sleep 500ms
Type "jjjjA,"
Escape
Sleep 300ms
Type "o          {"
Enter
Type `            "name": "archive",`
Enter
Type `            "permission": "note.write",`
Enter
Type `            "description": "Keep the note and mark it done.",`
Enter
Type `            "input": {`
Enter
Type `              "fields": [`
Enter
Type "                {"
Enter
Type `                  "name": "id",`
Enter
Type `                  "type": "uuid",`
Enter
Type `                  "required": true,`
Enter
Type `                  "description": "Note to archive."`
Enter
Type "                }"
Enter
Type "              ]"
Enter
Type "            }"
Enter
Type "          }"
Escape
Sleep 500ms
Type ":wq"
Enter
Sleep 1s

Type "clear"
Enter
Type `comment "New files from that one mutation. The rest of the generated code stays put."`
Enter
Sleep 3s
Type "npm run generate"
Enter
Sleep 4s
Type "clear"
Enter
Type "git add -N src"
Enter
Sleep 1s
Type "git --no-pager diff --name-status"
Enter
Sleep 5s

Type "clear"
Enter
Type `comment "The touch spec stays a scaffold until the test is implemented."`
Enter
Sleep 3s
Type "npm test"
Enter
Sleep 6s
