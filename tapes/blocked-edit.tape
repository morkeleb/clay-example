Output docs/gifs/blocked-edit.gif
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
Type "# Let's edit a generated file, the way an LLM would."
Enter
Sleep 3s
Type "node scripts/demo/agent-edit.mjs src/generated/types.ts"
Enter
Sleep 6s

Type "clear"
Enter
Type "# The touch file is yours. The hook allows that write."
Enter
Sleep 3s
Type "node scripts/demo/agent-edit.mjs src/logic/note/rename.ts"
Enter
Sleep 4s
