const { app, BrowserWindow, Menu, MenuItem, dialog } = require('electron')
const Store = require('electron-store')
const store = new Store()
function createWindow () {
  const win = new BrowserWindow({
    width: store.get('window.width',800),
    height: store.get('window.height',600),
    center: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true, // node API許可
      enableRemoteModule: true, // 永続化
    }
  })
  win.hide()
  win.loadFile('index.html')
  win.webContents.openDevTools() // 開発者ツール open
  win.webContents.on('did-finish-load', ()=>{
    win.show();
  });
  win.on('close',()=> {
    store.set('window.width', win.getSize()[0]) // width
    store.set('window.height', win.getSize()[1]) // height
  })
}

app.whenReady().then(createWindow)

// windows only
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
