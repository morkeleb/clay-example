Output docs/gifs/cancel-button.gif
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
Type "# Let's add a cancel button to all our forms"
Enter
Sleep 3s
Type `vi -u scripts/demo/vimrc "clay/generators/forms/templates/{{kebabCase clay_parent.name}}/{{kebabCase name}}.html.hbs"`
Enter
Sleep 1s
Type "/submit"
Enter
Sleep 400ms
Type `O  <button type="button">Cancel</button>`
Escape
Sleep 400ms
Type ":wq"
Enter
Sleep 1s

Type "clear"
Enter
Type "# Generate. One template line updates every mutation form."
Enter
Sleep 3s
Type "npm run generate"
Enter
Sleep 4s

Type "clear"
Enter
Type "# git diff --stat on the forms. Create and rename both changed."
Enter
Sleep 3s
Type "git --no-pager diff --stat -- src/generated/forms"
Enter
Sleep 5s
