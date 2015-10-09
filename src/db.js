import Dexie from 'dexie';

export function initDB() {
  var db = new Dexie("blackalbum");
  db.version(1).stores({
    files: "++id,basename,&fullpath,filesize,ctime,width,height,duration,vcodec,vBitRate,acodec,aBitRate,sampleRate"
  });

  db.open();

  return db;
}
