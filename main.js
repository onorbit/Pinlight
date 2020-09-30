const { app, ipcMain, BrowserWindow } = require('electron');

const Store = require('electron-store');
const store = new Store();

function saveConfig(event, arg) {
    store.set('config', arg);
}

ipcMain.on('config-modified', saveConfig);

function createWindow() {
    let config = {
        subject: 'Do Something Meaningful',
        cooldownSpanMin: 15,
        sprintSpanMin: 45
    }

    savedConfig = store.get('config', null);
    if (savedConfig != null) {
        config = savedConfig;
    }

    const win = new BrowserWindow({
        width: 300,
        height: 68,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.setAlwaysOnTop(true);
    win.setResizable(false);
    win.loadFile('index.html', {query: config});
}

app.whenReady().then(createWindow);
