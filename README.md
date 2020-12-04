<div align="center">
   <a href="https://github.com/fspoettel/pomodoro-discord-bot">
     <img src="https://user-images.githubusercontent.com/1682504/77572500-02a2ea80-6ec7-11ea-9f66-1feb637f3b6e.png" width="100" height="100" />
   </a>
  <h1>pomodoro-discord-bot</h1>
</div>

Discord bot that enables you to use and manage [🍅 pomodoro timers](https://en.wikipedia.org/wiki/Pomodoro_Technique) within channels and direct messages. It is written in Node.js and uses MongoDB as database layer. The bot currently runs on Dokku, hosted on Digital Ocean.

## Usage

1. [Invite the bot to your server](https://discordapp.com/oauth2/authorize?client_id=689784623592505372&scope=bot&permissions=51264)
2. Direct message `help` to user `pom#2785` or ping via `@pom help` to see a list of commands and usage instructions

## Available Commands

**Timers**

`start {min}` a 🍅 of a given duration. It is **25** minutes long by default. pom will send you a direct message once it completes.  
Shortcuts: `s`, `new`

`break {min}` starts a ☕. It is **5** minutes long by default. pom will send you a message once it completes.  
Shortcuts: `b`, `short`, `shortbreak`

`longbreak {min}` starts a long ☕. It is **30** minutes long by default. pom will send you a message once it completes.  
Shortcuts: `lb`, `long`

`timeleft` displays the time left on the current 🍅 or ☕.  
Shortcuts: `t`, `status`

`complete` a 🍅 or ☕ in progress.  
Shortcuts: `c`, `stop`

`restart` a 🍅 or ☕ in progress.  
Shortcuts: `r`, `reset`

**Stats**

`stats {today|all}` displays the amount of 🍅 and ☕ you have completed. By default, all stats will be shown.

`clearstats {today|all}` clears your stats. By default all stats will be cleared. This does not affect  🍅 or ☕ that are currently in progress.

**Documentation & Misc.**

`help` displays this help again.  
Shortcuts: `h`, `about`

`issue` displays a link to the issue tracker for this bot.  
Shortcuts: `bug`

`motivation` will try its best to help with lazy days.  
