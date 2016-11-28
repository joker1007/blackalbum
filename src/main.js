let electron = require('electron');
let app = electron.app;  // Module to control application life.
let BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
let process = require('process');
let path = require('path');
let fs = require('fs');

// avoid https://github.com/atom/electron/issues/550
if (process.platform == "darwin") {
  process.env['PATH'] = "/usr/local/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
global.mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  let windowSizePath = path.join(app.getPath('userData'), 'window-size.json');
  let windowSize;
  try {
    windowSize = JSON.parse(fs.readFileSync(windowSizePath, 'utf8'));
  } catch (err) {
    windowSize = {width: 1024, height: 600};
  }

  // Create the browser window.
  global.mainWindow = new BrowserWindow(windowSize);

  // and load the index.html of the app.
  global.mainWindow.loadURL('file://' + __dirname + '/index.html');

  global.mainWindow.on('close', () => {
    fs.writeFileSync(windowSizePath, JSON.stringify(mainWindow.getBounds()));
  });

  // Emitted when the window is closed.
  global.mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    global.mainWindow = null;
  });
});
