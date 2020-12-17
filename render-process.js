const execSync = require('child_process').execSync
const bucketsNameBtn = document.getElementById('bucket-name-button')
const clearBtn = document.getElementById('bucket-name-clear')
const buckets = document.getElementById('bucket-name-list')
const objectkeyList = document.getElementById('objectkey-list')
const objectkeyClearBtn = document.getElementById('objectkey-name-clear')

objectkeyClearBtn.style.visibility = 'hidden' // 非表示
let s3 = undefined
// バケットボタンクリック時
bucketsNameBtn.addEventListener('click', function(event) {
  // S3インスタンス生成
  const AWS = require('aws-sdk')
  const s3Config = {
    region: 'ap-northeast-1',
    apiVersion: '2006-03-01'
  }
  const proxyUrl = document.getElementById('proxy').value
  if(proxyUrl) {
    const proxyagent = require('proxy-agent')
    s3Config.httpOptions = { agent: proxyagent(proxyUrl) }
  }
  s3 = new AWS.S3(s3Config)

  objectkeyClearBtn.style.visibility = 'visible' // 表示
  const result =  execSync('aws s3 ls --profile default')
  const arr = result.toString().split('\r\n')

  let htmlText = '<table class="table table-striped"><thead><tr><th scope="col">#</th><th scope="col">Bucket Name</th></thead><tbody>'
  for(let i=0;i< arr.length - 1; i++) {
    htmlText += '<tr><th scope="row">' + (i + 1) + '</th><td>'
    htmlText += '<a href=\"#\" onClick=getBucket(this.innerHTML);>' + arr[i].substring(20) + '</a><br>'
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

function getBucket(hoge) {
  objectkeyClearBtn.removeAttribute('disabled')
  objectkeyList.innerHTML = '' // 初期化

  const result =  execSync('aws s3 ls ' + hoge + ' --profile default')
  const arr = result.toString().split('\r\n')
  let htmlText = '<table class="table table-striped"><thead><tr><th scope="col">#</th><th scope="col">ObjectKey</th></thead><tbody>'
  for(let i=0;i< arr.length - 1; i++) {
    htmlText += '<tr><th scope="row">' + (i + 1) + '</th><td>'
    if(arr[i].includes('PRE')) {
      htmlText += '<a href=\"#\" onClick=objectkey(\"' + hoge + '\",' + 'this.innerHTML);>' + arr[i].substr(31) + '</a><br>' // リンク
    } else {
      htmlText += '<span>' + arr[i].substr(31) + '</span><br>' // リンク外す
    }
    htmlText += '</td></tr>'
  }
  htmlText += '</tbody></table>'
  console.log(htmlText)
  objectkeyList.innerHTML = htmlText
}

async function objectkey(bucket, key) {
  objectkeyList.innerHTML = '' // 初期化
  const params = {
    'Bucket': bucket,
    'Prefix': key
  }
  const data = await s3.listObjectsV2(params).promise()
  let htmlText = '<table class="table table-striped"><thead><tr><th scope="col">#</th><th scope="col">ObjectKey</th></thead><tbody>'
  data.Contents.forEach(function(elem,i){
    htmlText += '<tr><th scope="row">' + (i + 1) + '</th><td>'
    htmlText += '<span>' + elem.Key + '</span><br>' // リンク外す
    htmlText += '</td></tr>'
  })
  htmlText += '</tbody></table>'
  objectkeyList.innerHTML = htmlText
}