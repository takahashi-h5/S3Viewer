let regexp = /(.*?)\s.*(.*?)\s(.*?)\s(.*?)$/g
let boo = false
console.log(boo)

let match;
// if((match = regexp.exec('2020-07-21 08:08:12     129941 9350c2a4262aed71ecf73302dd7b1bb5')) != null){
//   console.log(match[0])
//   console.log(match[1])
//   console.log(match[2])
//   console.log(match[3])
//   console.log(match[4])
// }


if((match = regexp.exec('2020-05-19 14:51:25    7733748 index.zip')) != null){
  console.log(match[0])
  console.log(match[1])
  console.log(match[2])
  console.log(match[3])
  console.log(match[4])
}