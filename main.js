const { app, BrowserWindow } = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width: 300,
        height: 70,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.setAlwaysOnTop(true);
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);