let fs = global.require('fs');
let path = global.require('path');
let childProcess = global.require('child_process');
import { Record } from 'immutable';
import _ from 'lodash';
import ffmpeg from 'fluent-ffmpeg';
import denodeify from 'denodeify';
import Zip from 'adm-zip';
import Jimp from 'jimp';
import { sprintf } from 'sprintf-js';
import { parse } from 'shell-quote';
import { fsAccess, ensureDir} from './helpers/path_helper';

const MOVIE_EXTENSIONS = [
  "3g2",
  "3gp",
  "asf",
  "avi",
  "divx",
  "flv",
  "m2v",
  "m4v",
  "mkv",
  "mov",
  "mp2",
  "mp4",
  "mpe",
  "mpeg",
  "mpg",
  "nsv",
  "ogm",
  "qt",
  "rm",
  "rmvb",
  "vob",
  "wmv",
];

const IMAGE_EXTENSIONS = [
  "bmp",
  "jpg",
  "png",
]

export default class MediaFile extends Record({
  id: null,
  basename: null,
  fullpath: null,
  filesize: null,
  ctime: null,
  width: null,
  height: null,
  duration: null,
  vcodec: null,
  vBitRate: null,
  acodec: null,
  aBitRate: null,
  sampleRate: null
}) {
  get basenameWithoutExtension() {
    return path.basename(this.basename, path.extname(this.basename));
  }

  get extname() {
    return path.extname(this.basename).substr(1);
  }

  get isMovie() {
    return false;
  }

  get thumbnailDir() {
    return path.dirname(path.join(global.config.thumbnail.dir, this.fullpath));
  }

  get thumbnails() {
    let results = [];
    for (let i = 1; i <= global.config.thumbnail.count; ++i) {
      results.push(this.thumbnailPath(i));
    }
    return results;
  }

  get resolution() {
    return null;
  }

  get durationStr() {
    return null;
  }

  get mainCommand() {
    return global.config.getCommand(this.extname);
  }

  get commands() {
    return global.config.getAllCommands(this.extname);
  }

  thumbnailPath(index) {
    return path.join(this.thumbnailDir, `${this.basenameWithoutExtension}_${index}.png`)
  }

  execute(commandName = null) {
    let cmd, args = null;

    if (commandName) {
      [cmd, ...args] = parse(this.commands[commandName]);
    } else {
      [cmd, ...args] = parse(this.mainCommand);
    }

    childProcess.spawn(
      cmd,
      [...args, this.fullpath],
      {detached: true}
    );
  }

  async createThumbnail({ count, size }) {
    return true;
  }

  getMediaInfo() {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }

  async toDbData() {
    return {
      basename: this.basename,
      fullpath: this.fullpath,
      filesize: this.filesize,
      ctime: this.ctime,
    };
  }
}

class MovieFile extends MediaFile {
  get isMovie() {
    return true;
  }

  get resolution() {
    return `${this.width}x${this.height}`;
  }

  get durationStr() {
    if (isNaN(this.duration)) {
      return "NaN";
    }
    const hour = Math.floor(this.duration / 3600);
    const min = Math.floor((this.duration - hour * 3600) / 60);
    const sec = Math.floor((this.duration - hour * 3600 - min * 60) % 60);
    return sprintf("%d:%02d:%02d", hour, min, sec);
  }

  async createThumbnail({ count, size }) {
    await ensureDir(this.thumbnailDir);
    let results = [];
    for (let i = 1; i <= count; ++i) {
      results.push(new Promise((resolve, reject) => {
        fsAccess(this.thumbnailPath(i)).then(hasThumbnail => {
          if (!hasThumbnail) {
            childProcess.execFile(
              'ffmpegthumbnailer',
              [
                "-i", this.fullpath,
                "-o", this.thumbnailPath(i),
                "-s", size,
                "-t", `${Math.round(Math.min(100/(count + 1 - i), 99))}%`,
              ],
              (err, stdout, stderr) => {
                if (err) {
                  console.log(err);
                  resolve(false);
                } else {
                  resolve(true);
                }
              }
            );
          } else {
            resolve(false);
          }
        });
      }));
    }
    return await Promise.all(results);
  }

  getMediaInfo() {
    return new Promise((resolve, reject) => {
      ffmpeg(this.fullpath).ffprobe((err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async toDbData() {
    let info = await this.getMediaInfo();
    let videoStream = _.find(info.streams, stream => {
      return stream.codec_type == "video";
    });
    let audioStream = _.find(info.streams, stream => {
      return stream.codec_type == "audio";
    });
    let videoInfo = videoStream === null ? {} : {
      width: videoStream.width,
      height: videoStream.height,
      duration: parseInt(videoStream.duration),
      vcodec: videoStream.codec_name,
      vBitRate: parseInt(videoStream.bit_rate),
    }
    if (isNaN(videoInfo.duration)) {
      videoInfo.duration = parseInt(info.format.duration);
    }
    let audioInfo = audioStream === null ? {} : {
      acodec: audioStream.codec_name,
      aBitRate: parseInt(audioStream.bit_rate),
      sampleRate: parseInt(audioStream.sample_rate),
    }

    return _.extend({
      basename: this.basename,
      fullpath: this.fullpath,
      filesize: this.filesize,
      ctime: this.ctime,
    }, videoInfo, audioInfo);
  }
}

class ArchiveFile extends MediaFile {
  async createThumbnail({ count, size }) {
    console.log(`create thumbnail: ${this.fullpath}`);
    let fsAccessResults = [];
    for (let i = 1; i <= count; ++i) {
      fsAccessResults.push(await fsAccess(this.thumbnailPath(i)));
    }
    if (_.all(fsAccessResults)) {
      return false;
    }

    await ensureDir(this.thumbnailDir);
    const zip = new Zip(this.fullpath);
    const imageEntries = _.chain(zip.getEntries())
      .filter(entry => {
        return _.includes(IMAGE_EXTENSIONS, path.extname(entry.name).substr(1))
      }).sortBy('entryName').value();
    const coverEntry = _.find(imageEntries, entry => {
      return entry.name.match(/cover/i);
    });

    const targets = _.chain([coverEntry].concat(imageEntries))
      .compact()
      .take(count)
      .value();

    let results = [];
    for (let i = 1; i <= targets.length; ++i) {
      results.push(new Promise((resolve, reject) => {
        fsAccess(this.thumbnailPath(i)).then(hasThumbnail => {
          if (!hasThumbnail) {
            zip.readFileAsync(targets[i-1], buf => {
              if (!buf) {
                resolve(false);
              }

              new Jimp(buf, (err, image) => {
                if (err) {
                  console.warn(err);
                  return resolve(false);
                }
                image
                  .scale(size / image.bitmap.width)
                  .write(this.thumbnailPath(i));

                resolve(true);
              });
            });
          } else {
            resolve(false);
          }
        });
      }));
    }
    return await Promise.all(results);
  }
}

MediaFile.build = (data) => {
  const extname = path.extname(data.basename).substr(1);
  if (_.includes(MOVIE_EXTENSIONS, extname)) {
    return new MovieFile(data);
  } else {
    return new ArchiveFile(data);
  }
};
