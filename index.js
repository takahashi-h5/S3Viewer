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
  for(var i = 0.00001;i<= 1; i= i+0.00001){
    win.setProgressBar(i)
  }

  win.webContents.on('did-finish-load', ()=>{
    win.show();
  });
  win.on('close',()=> {
    console.log('win close.')
    console.log(win.getSize()) //[800, 600]
    console.log(win.getSize()[0])
    console.log(win.getSize()[1])
    console.log(store.path)
    store.set('window.width', win.getSize()[0]) // width
    store.set('window.height', win.getSize()[1]) // height
  })
}

app.whenReady().then(createWindow)

// windows only
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    console.log('window close.')
    app.quit()
  }
})

// コンテキストメニュー
const menu = new Menu()
menu.append(new MenuItem({ label: 'Hello' }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: 'クリックイベント', click:()=>{console.log('test')}}))
app.on('browser-window-created', function(event, win) {
  win.webContents.on('context-menu', function(e, params) {
    menu.popup(win, params.x, params.y)
  })
})

// macOSのみのイベント activate
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
