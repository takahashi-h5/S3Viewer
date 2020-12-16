const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'})
const execSync = require('child_process').execSync

const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')

const manageWindowBtn = document.getElementById('bucket-name-button')
const buckets = document.getElementById('bucket-name-list')

// ボタンクリック時に、レンダラープロセスから別ウィンドウを表示
manageWindowBtn.addEventListener('click', function(event) {
  /*const myNotification = new Notification('通知', {
    body: '通知本文'
  })
  myNotification.onclick = () => {
    console.log('Notification clicked')
  }*/

  const result =  execSync('aws s3 ls --profile default')
  // console.log(result.toString())
  const arr = result.toString().split('\n')
  for(let i=0;i< arr.length; i++) {
    buckets.innerHTML += arr[i].substring(20) + '<br>'
  }
  manageWindowBtn.setAttribute('disabled', true)
  // const modalPath = path.join('file://', __dirname, '/childwindow.html')
  // win = new BrowserWindow({
  //   width: 400,
  //   height: 275,
  //   webPreferences: {
  //     nodeIntegration: false, // node API許可
  //     contextIsolation: true
  //   }
  // })
  // // win.on('resize', updateReply)
  // // win.on('move', updateReply)
  // // win.on('focus', hideFocusBtn)
  // // win.on('blur', showFocusBtn)
  // // win.on('close', function() {
  // //   hideFocusBtn()
  // //   win = null
  // // })
  // console.log(modalPath)
  // win.loadURL(modalPath)
  // // win.show()

  // function updateReply() {
  //   const manageWindowReply = document.getElementById('manage-window-reply')
  //   const message = `Size: ${win.getSize()} Position: ${win.getPosition()}`
  //   manageWindowReply.innerText = message
  // }

  // const focusModalBtn = document.getElementById('focus-on-modal-window')

  // function showFocusBtn(btn) {
  //   if (!win) return
  //   focusModalBtn.classList.add('smooth-appear')
  //   focusModalBtn.classList.remove('disappear')
  //   focusModalBtn.addEventListener('click', function() {
  //     win.focus()
  //   })
  // }

  // function hideFocusBtn() {
  //   focusModalBtn.classList.add('disappear')
  //   focusModalBtn.classList.remove('smooth-appear')
  // }
})
