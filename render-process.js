const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'})
const execSync = require('child_process').execSync

const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')

const bucketsNameBtn = document.getElementById('bucket-name-button')
const clearBtn = document.getElementById('bucket-name-clear')
const buckets = document.getElementById('bucket-name-list')

// ボタンクリック時
bucketsNameBtn.addEventListener('click', function(event) {
  const result =  execSync('aws s3 ls --profile default')
  const arr = result.toString().split('\r\n')
  for(let i=0;i< arr.length; i++) {
    buckets.innerHTML += '<a href="' + arr[i].substring(20) + '">' + arr[i].substring(20) + '</a><br>'
  }
  bucketsNameBtn.setAttribute('disabled', true)
  clearBtn.removeAttribute('disabled')
})

// クリアボタンクリック時
clearBtn.addEventListener('click',function(event) {
  console.log('hogehoge')
  bucketsNameBtn.removeAttribute('disabled')
  clearBtn.setAttribute('disabled', true)
  buckets.innerHTML = ''
})
