Output docs/gifs/role-check.gif
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
Type "node scripts/demo/strip-role-check.mjs"
Enter
Sleep 3s
Type "git add -A"
Enter
Type "git commit -q -m before"
Enter
Sleep 1s
Type "clear"
Enter
Sleep 200ms
Show

Type "clear"
Enter
Type `comment "Poke-yoke: add the role check once. Every handler enforces it."`
Enter
Sleep 3s
Type "vi -u scripts/demo/vimrc clay/generators/handlers/templates/handler/{{kebabCase clay_parent.name}}/{{kebabCase name}}.ts.hbs"
Enter
Sleep 1s
Type "/clay_parent.name}} {"
Enter
Sleep 500ms
Type "o"
Sleep 200ms
Type `  requirePermission(ctx.user, "{{permission}}");`
Escape
Sleep 500ms
Type ":wq"
Enter
Sleep 1s

Type "clear"
Enter
Type `comment "Create and rename now both refuse a caller who lacks permission."`
Enter
Sleep 3s
Type "npm run generate"
Enter
Sleep 4s
Type "clear"
Enter
Type "git --no-pager diff -U1 -- src/generated/handlers"
Enter
Sleep 6s
