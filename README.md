[![Stories in Ready](https://badge.waffle.io/joker1007/blackalbum.png?label=ready&title=Ready)](https://waffle.io/joker1007/blackalbum)
# Blackalbum

Movie Media Browser by Electron

## Screenshot
<img width="1200" alt="blackalbum.png" src="https://cloud.githubusercontent.com/assets/116996/10564504/28bcbcb4-75f2-11e5-8010-d011edced361.png">

## Requirements
- ffmpegthumbnailer
- ffprobe

On OSX

```
brew install ffmpeg ffmpegthumbnailer
```

## Download
download from [Release](https://github.com/joker1007/blackalbum/releases)

## Usage
Write config file at

- `~/Library/Application Support/blackalbum/config.yml` (Mac)
- `~/.blackalbum/config.json` (Linux)

### Sample

```yaml
directories:
  - "/path/to/target/directory"
filterWords:
  - NGWORD
thumbnail:
  concurrency: 3
players:
  mplayer: open -a "/Applications/MPlayer OSX Extended.app"
  vlc: open -a "/Applications/VLC.app"
  cooViewer: open -a "/Applications/cooViewer.app"
extensions:
  avi:
    - mplayer
    - vlc
  mkv:
    - mplayer
    - vlc
  mp4:
    - mplayer
    - vlc
  m4v:
    - mplayer
    - vlc
  mpg:
    - mplayer
    - vlc
  wmv:
    - mplayer
    - vlc
  zip:
    - cooViewer
```

And click menu `Tool -> Update Database`.
