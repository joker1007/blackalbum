let path = global.require('path');
let fs = global.require('fs');
let fsExtra = global.require('fs-extra');

export function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

export const appDir = path.join(getUserHome(), ".blackalbum");
export const configFile = path.join(appDir, "config.json");
export const defaultThumbnailDir = path.join(appDir, "thumnails");


export function fsAccess(filePath) {
  return new Promise((resolve, reject) => {
    fs.access(filePath, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export function ensureDir(dirPath) {
  return new Promise((resolve, reject) => {
    fsExtra.ensureDir(dirPath, (err) => {
      if (err) {
        console.log(err);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}
