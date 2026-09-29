Output docs/gifs/add-field.gif
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
Type "# Let's add a field"
Enter
Sleep 3s
Type "vi -u scripts/demo/vimrc clay/model.json"
Enter
Sleep 1s
Type "/Note text."
Enter
Sleep 400ms
Type "jA,"
Escape
Sleep 400ms
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
Sleep 400ms
Type ":wq"
Enter
Sleep 1s

Type "clear"
Enter
Type "# Generate. Clay rewrites only the files that show this field."
Enter
Sleep 3s
Type "npm run generate"
Enter
Sleep 4s

Type "clear"
Enter
Type "# git diff --stat -- src. Line counts for the type and the page only."
Enter
Sleep 3s
Type "git --no-pager diff --stat -- src"
Enter
Sleep 5s

Type "clear"
Enter
Type "# tsc fails. The touch file the handler calls still omits pinned."
Enter
Sleep 3s
Type "npm run typecheck"
Enter
Sleep 6s
