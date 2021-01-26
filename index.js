const electron = require('electron');
const path = require('path');
const url = require('url');
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;
const fs = require('fs');
let window;
let mainDat;



app.on('ready', function() {
    window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.setIcon(__dirname + '/edit.ico')

    window.maximize()

    window.loadURL(url.format({
        pathname: path.join(__dirname, 'window.html'),
        protocol: 'file:',
        slashes: true
    }));
    window.on('closed', function() {
        app.quit();
    });

    ipcMain.on('open-file', (event, arg) => {
        showOpenDialog(event);
    })

    ipcMain.on('save-data', (event, arg) => {

        fs.writeFile(mainDat, arg, function(err) {});

    })


    Menu.setApplicationMenu(null);

});

function showOpenDialog(ev) {

    const {
        dialog
    } = require('electron')

    let options = {
        title: "Open a Text File",

        buttonLabel: "Open Text File!",

        filters: [{
            name: 'Text Files',
            extensions: ['txt']
        }, ],
        properties: ['openFile', 'multiSelections']
    }

    let filePaths = dialog.showOpenDialog(window, options).then(result => {
        if (!result.canceled) {

            let fPath = result.filePaths;
            mainDat = fPath[0];

            fs.readFile(fPath.toString(), 'utf8', function(err, data) {
                if (!err) {

                    ev.reply('recieved-file', data);
                    ev.reply('file-title', path.basename(mainDat));

                }
            });

        }
    });

}