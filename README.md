Unicorn Kingdoms is a js13k game

## Architecture & Gameplay Summary

- stacked html layers; no canvas or webgl
- state machine
  - START (capture a user event so we can play audio, etc)
  - MENU
  - ABOUT
  - SETTINGS
  - OVERWORLD
  - MATCH
  - RESULT
- emojis for sprites and tiles
- synthesized sfx and music
- three points of interest per map (kingdom)
- each poi opens a gem matching minigame, requiring the player to match a specified numbe of unicorns in order to win
- the player can match rainbows to collect them for use later in the adventure
- generate a new kingdom after all poi's on the map have been visited and increase difficulty
