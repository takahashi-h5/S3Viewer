const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'})
const execSync = require('child_process').execSync

const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path');
const { DirectoryService, DocDB } = require('aws-sdk');
const { DiffieHellman } = require('crypto');

const bucketsNameBtn = document.getElementById('bucket-name-button')
const clearBtn = document.getElementById('bucket-name-clear')
const buckets = document.getElementById('bucket-name-list')
const objectkeyList = document.getElementById('objectkey-list')

// ボタンクリック時
bucketsNameBtn.addEventListener('click', function(event) {
  const result =  execSync('aws s3 ls --profile default')
  const arr = result.toString().split('\r\n')
  for(let i=0;i< arr.length; i++) {
    buckets.innerHTML += '<a href=\"#\" onClick=dirr(this.innerHTML);>' + arr[i].substring(20) + '</a><br>'
  }
  bucketsNameBtn.setAttribute('disabled', true)
  clearBtn.removeAttribute('disabled')
})

// クリアボタンクリック時
clearBtn.addEventListener('click',function(event) {
  bucketsNameBtn.removeAttribute('disabled')
  clearBtn.setAttribute('disabled', true)
  buckets.innerHTML = ''
})

function dirr(hoge) {
  console.log('hoge')
  console.log(hoge)
  const result =  execSync('aws s3 ls ' + hoge + ' --profile default')
  console.log(result.toString().split('\r\n'))
  const arr = result.toString().split('\r\n')
  for(let i=0;i< arr.length; i++) {
    objectkeyList.innerHTML += '<a href=\"#\" onClick=dirr(this.innerHTML);>' + arr[i].substring(20) + '</a><br>'
  }

}