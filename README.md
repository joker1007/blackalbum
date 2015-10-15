[![Stories in Ready](https://badge.waffle.io/joker1007/blackalbum.png?label=ready&title=Ready)](https://waffle.io/joker1007/blackalbum)
# Blackalbum

Movie Media Browser by Electron

## Screenshot
![blackalbum.png](https://cloud.githubusercontent.com/assets/116996/10122588/7003cb2a-6559-11e5-8755-e1819265a002.png)

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
Write config file at `~/.blackalbum/config.json`.

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
