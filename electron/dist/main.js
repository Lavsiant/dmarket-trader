"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let win;
require('@electron/remote/main').initialize();
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 800,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    });
    electron_1.app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
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
    require("@electron/remote/main").enable(win.webContents);
    win.on("closed", () => {
        win = null;
    });
}
electron_1.app.on("ready", createWindow);
electron_1.app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=main.js.map