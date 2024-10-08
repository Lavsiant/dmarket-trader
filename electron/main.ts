import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";

let win: BrowserWindow | null;
require('@electron/remote/main').initialize();


function createWindow() {
  win = new BrowserWindow({
      width: 800,
      height: 500,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false
        
    }
  }); 

  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

  // win.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, `/../../dist/action-binder/index.html`),
  //     protocol: "file:", 
  //     slashes: true
  //   })
  // );

  // win.webContents.session.webRequest.onBeforeSendHeaders(
  //   (details, callback) => {
  //     callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } });
  //   },
  // );

  // win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       'Access-Control-Allow-Origin': '*',
  //       ...details.responseHeaders,
  //     },
  //   });
  // });

  win.loadURL('http://localhost:4200');
 
  win.webContents.openDevTools();

  require("@electron/remote/main").enable(win.webContents)

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});