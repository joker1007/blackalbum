# Blackalbum

Movie Media Browser by Electron

## Screenshot

## Usage
Write config file at `~/.blackalbum/config.json`.

### Sample

```json
{
  "directories": [
    "/Users/joker/pasokara_test_data"
  ],
  "extensions": {
    "avi": {
      "mplayer": "open -a \"/Users/joker/Applications/MPlayer OSX Extended.app\"",
      "vlc": "open -a \"/Users/joker/Applications/VLC.app\""
    },
    "mkv": {
      "mplayer": "open -a \"/Users/joker/Applications/MPlayer OSX Extended.app\"",
      "vlc": "open -a \"/Users/joker/Applications/VLC.app\""
    },
    "mp4": {
      "mplayer": "open -a \"/Users/joker/Applications/MPlayer OSX Extended.app\"",
      "vlc": "open -a \"/Users/joker/Applications/VLC.app\""
    },
    "mpg": {
      "mplayer": "open -a \"/Users/joker/Applications/MPlayer OSX Extended.app\"",
      "vlc": "open -a \"/Users/joker/Applications/VLC.app\""
    },
    "mov": {
      "mplayer": "open -a \"/Users/joker/Applications/MPlayer OSX Extended.app\"",
      "vlc": "open -a \"/Users/joker/Applications/VLC.app\""
    },
    "wmv": {
      "mplayer": "open -a \"/Users/joker/Applications/MPlayer OSX Extended.app\"",
      "vlc": "open -a \"/Users/joker/Applications/VLC.app\""
    }
  }
}
```

And click menu `Tool -> Update Database`.
