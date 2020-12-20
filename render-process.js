const { ipcRenderer, clipboard } = require('electron')
const execSync = require('child_process').execSync
const bucketsNameBtn = document.getElementById('bucket-name-button')
const clearBtn = document.getElementById('bucket-name-clear')
const buckets = document.getElementById('bucket-name-list')
const objectkeyList = document.getElementById('objectkey-list')
const objectkeyClearBtn = document.getElementById('objectkey-name-clear')
const proxyText = document.getElementById('proxy')
const regionName = document.getElementById('regionName')
const arnName = document.getElementById('arn')
const s3uri = document.getElementById('s3uri')
const createDate = document.getElementById('createDate')
const pankuzuList = document.getElementById('pankuzu-list')
const Store = require('electron-store')
const store = new Store()

proxyText.value = ipcRenderer.sendSync('invoke-test', '')

objectkeyClearBtn.style.visibility = 'hidden' // 非表示
let s3 = undefined

// proxy設定blur時
proxyText.onblur = function() {
  store.set('window.proxy',proxyText.value)
}

// バケットボタンクリック時
bucketsNameBtn.addEventListener('click', function(event) {
  // S3インスタンス生成
  const AWS = require('aws-sdk')
  const s3Config = {
    region: 'ap-northeast-1',
    apiVersion: '2006-03-01'
  }
  const proxyUrl = proxyText.value
  if(proxyUrl) {
    const proxyagent = require('proxy-agent')
    s3Config.httpOptions = { agent: proxyagent(proxyUrl) }
  }
  s3 = new AWS.S3(s3Config)

  objectkeyClearBtn.style.visibility = 'visible' // 表示
  const result =  execSync('aws s3 ls --profile default')
  const arr = result.toString().split('\r\n')

  let htmlText = '<table class=\'table table-striped\'><thead><tr><th scope=\'col\'>#</th><th scope=\'col\'>Bucket Name</th></thead><tbody>'
  for(let i=0;i< arr.length - 1; i++) {
    htmlText += '<tr><th scope=\'row\'>' + (i + 1) + '</th><td>'
    htmlText += '<a href=\'#\' onClick=getBucket(this.innerHTML);>' + arr[i].substring(20) + '</a><br>'
    htmlText += '</td></tr>'
  }
  htmlText += '</tbody></table>'
  buckets.innerHTML = htmlText
  bucketsNameBtn.setAttribute('disabled', true)
  clearBtn.removeAttribute('disabled')
  proxyText.setAttribute('disabled', true)
})

// クリアボタンクリック時
clearBtn.addEventListener('click',function(event) {
  bucketsNameBtn.removeAttribute('disabled')
  proxyText.removeAttribute('disabled')
  clearBtn.setAttribute('disabled', true)
  objectkeyClearBtn.setAttribute('disabled', true)
  buckets.innerHTML = ''
  objectkeyList.innerHTML = ''
  pankuzuList.innerHTML = ''
  regionName.innerHTML = ''
  arnName.innerHTML = ''
  s3uri.innerHTML = ''
})

// クリアボタンクリック時
objectkeyClearBtn.addEventListener('click',function(event) {
  objectkeyClearBtn.setAttribute('disabled', true)
  objectkeyList.innerHTML = ''
  pankuzuList.innerHTML = ''
  regionName.innerHTML = ''
  arnName.innerHTML = ''
  s3uri.innerHTML = ''
})

function getBucket(bucket) {
  objectkeyClearBtn.removeAttribute('disabled')
  objectkeyList.innerHTML = '' // clear
  pankuzuList.innerHTML = '' // clear
  const region =  execSync('aws s3api get-bucket-location --bucket ' + bucket + ' --profile default') // region get
  regionName.innerHTML = JSON.parse(region.toString()).LocationConstraint // region set
  arnName.innerHTML = 'arn:aws:s3:::' + bucket
  s3uri.innerHTML = 's3://' + bucket

  const result =  execSync('aws s3 ls ' + bucket + ' --profile default')
  const arr = result.toString().split('\r\n')
  let htmlText = '<table class=\'table table-striped\'><thead><tr><th scope=\'col\'>#</th><th scope=\'col\'>ObjectKey</th></thead><tbody>'
  for(let i=0;i< arr.length - 1; i++) {
    htmlText += '<tr><th scope=\'row\'>' + (i + 1) + '</th><td>'
    if(arr[i].includes('PRE')) {
      htmlText += '<a href=\'#\' onClick=objectkey(\'' + bucket + '\',' + 'this.innerHTML);>' + arr[i].substr(31) + '</a><br>' // リンク
    } else {
      htmlText += '<span>' + arr[i].substr(31) + '</span><br>' // リンク外す
    }
    htmlText += '</td></tr>'
  }
  htmlText += '</tbody></table>'
  objectkeyList.innerHTML = htmlText
}

async function objectkey(bucket, key) {
  objectkeyList.innerHTML = '' // clear
  s3uri.innerHTML = 's3://' + bucket + '/' + key
  const params = {
    'Bucket': bucket,
    'Prefix': key
  }
  const data = await s3.listObjectsV2(params).promise()
  let htmlText = '<table class=\'table table-striped\'><thead><tr><th scope=\'col\'>#</th><th scope=\'col\'>ObjectKey</th></thead><tbody>'
  const arr = data.Contents.map(function(elem){
    let objectkey = elem.Key.replace(key, '')
    if(objectkey.includes('/')) {
      return objectkey.split('/')[0] + '/'
    } else {
      return objectkey
    }
  }).filter(function(e){
    return e !== ''
  })
  const uniqueData = [...new Set(arr)] // unique
  uniqueData.forEach(function(elem,i){
    htmlText += '<tr><th scope=\'row\'>' + (i + 1) + '</th><td>'
    if(elem.includes('/')) {
      console.log(bucket)
      console.log(key + elem)
      htmlText += '<a href=\'#\' onClick=objectkey(\'' + bucket + '\',\''+ key + elem + '\');>' + elem + '</a><br>'
    } else {
      htmlText += '<span>' + elem + '</span><br>' // リンク外す
    }
    htmlText += '</td></tr>'
  })
  htmlText += '</tbody></table>'
  objectkeyList.innerHTML = htmlText
  pankuzuList.innerHTML = pankuzuList.innerHTML === '' ? 
    '<a href=\'#\' onClick=getBucket(this.innerHTML);>' + bucket + '</a>&nbsp;&gt;' + key :
      // (pankuzuList.innerHTML += nextkey)
      (pankuzuList.innerHTML = '<a href=\'#\' onClick=getBucket(this.innerHTML);>' + bucket + '</a>&nbsp;&gt;' + key)
}

function copyArn() {
  clipboard.writeText(arnName.innerHTML)
}

function copyS3Uri() {
  clipboard.writeText(s3uri.innerHTML)
}
