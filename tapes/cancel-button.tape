Output docs/gifs/cancel-button.gif
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
Type `comment "One line in the form template. Every mutation form gets a Cancel button."`
Enter
Sleep 3s
Type "vi -u scripts/demo/vimrc clay/generators/forms/templates/{{kebabCase clay_parent.name}}/{{kebabCase name}}.html.hbs"
Enter
Sleep 1s
Type "/submit"
Enter
Sleep 500ms
Type `O  <button type="button">Cancel</button>`
Escape
Sleep 500ms
Type ":wq"
Enter
Sleep 1s

Type "clear"
Enter
Type `comment "Same idea as a role check: one template edit, every handler or form follows."`
Enter
Sleep 3s
Type "npm run generate"
Enter
Sleep 4s
Type "clear"
Enter
Type "git --no-pager diff --stat -- src/generated/forms"
Enter
Sleep 5s
