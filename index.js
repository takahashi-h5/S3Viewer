const { app, BrowserWindow, Menu, MenuItem, ipcMain, dialog } = require('electron')
const Store = require('electron-store')
const store = new Store()

ipcMain.on('invoke-test', (event, message) => {
  event.returnValue = store.get('window.proxy','')
  return
})

function createWindow () {
  const win = new BrowserWindow({
    width: store.get('window.width',800),
    height: store.get('window.height',1000),
    icon: __dirname + '/confrage.ico',
    center: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true, // node API許可
      enableRemoteModule: true // 永続化
    }
  })
  win.hide()
  win.loadFile('index.html')
  // win.webContents.openDevTools() // 開発者ツール
  win.webContents.on('did-finish-load', ()=>{
    win.show();
  });
  win.on('close',()=> {
    store.set('window.width', win.getSize()[0]) // width
    store.set('window.height', win.getSize()[1]) // height
  })
}
app.whenReady().then(createWindow) // 表示

// windows only
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
