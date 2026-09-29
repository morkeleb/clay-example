Output docs/gifs/token-efficiency.gif
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
Type "# Let's add a mutation. Pay for this edit, not for each file."
Enter
Sleep 3s
Type "vi -u scripts/demo/vimrc clay/model.json"
Enter
Sleep 1s
Type "/New title."
Enter
Sleep 400ms
Type "jjjjA,"
Escape
Sleep 400ms
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
Sleep 400ms
Type ":wq"
Enter
Sleep 1s

Type "clear"
Enter
Type "# Generate. Clay writes the form, the handler, the page, the route, and the touch files."
Enter
Sleep 3s
Type "npm run generate"
Enter
Sleep 8s

Type "clear"
Enter
Type "# git add -N marks new files. --stat is the lines the LLM did not write."
Enter
Sleep 3s
Type "git add -N src"
Enter
Sleep 1s
Type "git --no-pager diff --stat -- clay/model.json src"
Enter
Sleep 6s
