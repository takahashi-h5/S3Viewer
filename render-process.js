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
const objectkeyClearBtn = document.getElementById('objectkey-name-clear')

objectkeyClearBtn.style.visibility = 'hidden' // 非表示

// バケットボタンクリック時
bucketsNameBtn.addEventListener('click', function(event) {
  objectkeyClearBtn.style.visibility = 'visible' // 表示
  const result =  execSync('aws s3 ls --profile default')
  const arr = result.toString().split('\r\n')

  let htmlText = '<table class="table table-striped"><thead><tr><th scope="col">#</th><th scope="col">Bucket Name</th></thead><tbody>'
  for(let i=0;i< arr.length - 1; i++) {
    htmlText += '<tr><th scope="row">' + (i + 1) + '</th><td>'
    htmlText += '<a href=\"#\" onClick=objectkey(this.innerHTML);>' + arr[i].substring(20) + '</a><br>'
    htmlText += '</td></tr>'
  }
  htmlText += '</tbody></table>'
  buckets.innerHTML = htmlText
  bucketsNameBtn.setAttribute('disabled', true)
  clearBtn.removeAttribute('disabled')
})

// クリアボタンクリック時
clearBtn.addEventListener('click',function(event) {
  bucketsNameBtn.removeAttribute('disabled')
  clearBtn.setAttribute('disabled', true)
  objectkeyClearBtn.setAttribute('disabled', true)
  buckets.innerHTML = ''
  objectkeyList.innerHTML = ''
})

// クリアボタンクリック時
objectkeyClearBtn.addEventListener('click',function(event) {
  objectkeyClearBtn.setAttribute('disabled', true)
  objectkeyList.innerHTML = ''
})

function objectkey(hoge) {
  objectkeyClearBtn.removeAttribute('disabled')
  objectkeyList.innerHTML = '' // 初期化
  console.log(hoge)

  const result =  execSync('aws s3 ls ' + hoge + ' --profile default')
  // console.log(result.toString().split('\r\n'))
  const arr = result.toString().split('\r\n')
  for(let i=0;i< arr.length; i++) {
    let match = null
    if(arr[i].includes('PRE')) {
      objectkeyList.innerHTML += '<a href=\"#\" onClick=objectkey2(\"' + hoge + '\",' + 'this.innerHTML);>' + arr[i].substr(31) + '</a><br>' // リンク
    } else {
      objectkeyList.innerHTML += '<span>' + arr[i].substr(31) + '</span><br>' // リンク外す
    }
  }
}
async function objectkey2(bucket, key) {
  objectkeyList.innerHTML = '' // 初期化
  const params = {
    'Bucket': bucket,
    'Prefix': key
  }
  const data = await s3.listObjectsV2(params)//, function(err, data) {
    console.log(data.Contents)
    // data.Contents.forEach(function(elem){
    //   console.log(elem.Key)
    //   if(elem.Key.includes('PRE')) {
    //     objectkeyList.innerHTML += '<a href=\"#\" onClick=objectkey2(\"' + hoge + '\",' + 'this.innerHTML);>' + arr[i].substr(31) + '</a><br>' // リンク
    //   } else {
    //     objectkeyList.innerHTML += '<span>' + elem.Key.substr(31) + '</span><br>' // リンク外す
    //   }
    // })
  // })
}