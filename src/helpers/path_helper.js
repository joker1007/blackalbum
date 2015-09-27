let path = global.require('path');
let fs = global.require('fs');

export function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

export const appDir = path.join(getUserHome(), ".blackalbum");
export const configFile = path.join(appDir, "config.json");
export const defaultThumbnailDir = path.join(appDir, "thumnails");
