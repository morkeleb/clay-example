Output docs/gifs/role-check.gif
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
Type "node scripts/demo/strip-role-check.mjs"
Enter
Sleep 4s
Type "git add -A"
Enter
Sleep 1s
Type "git commit -q -m before"
Enter
Sleep 1s
Type "clear"
Enter
Sleep 200ms
Show

Type "clear"
Enter
Type "# Let's add a role check to every handler"
Enter
Sleep 3s
Type `vi -u scripts/demo/vimrc "clay/generators/handlers/templates/handler/{{kebabCase clay_parent.name}}/{{kebabCase name}}.ts.hbs"`
Enter
Sleep 1s
Type "/clay_parent.name}} {"
Enter
Sleep 400ms
Type "o"
Sleep 200ms
Type `  requirePermission(ctx.user, "{{permission}}");`
Escape
Sleep 400ms
Type ":wq"
Enter
Sleep 1s

Type "clear"
Enter
Type "# Generate. The template line lands in every handler."
Enter
Sleep 3s
Type "npm run generate"
Enter
Sleep 4s

Type "clear"
Enter
Type "# git diff -U1 shows that one new line in create and in rename."
Enter
Sleep 3s
Type "git --no-pager diff -U1 -- src/generated/handlers"
Enter
Sleep 6s
