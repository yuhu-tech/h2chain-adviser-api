// 使用 Mock
var Mock = require('mockjs')
var Random = Mock.Random
var json_merger = require('json_merger');

_occupations = Mock.mock({ "occupations|5-10": ['@cword(2)'] })
//console.log(_occupations)
_advisers = Mock.mock({ "advisers|3-5": [{ "companyname|5-5": '@cword(3)', "phone|18015565550-18015565999": 0, "name": '@cname' }] })
//console.log(_advisers)
_needs = { _occupations, _advisers }
//console.log(_needs)
//
//

const orderpayload = {
  "orderid": "order123",
  "error": false
}



const advisers = {
  "advisers": [{ "companyname": "海明人力资源", "phone": "16621381222", "name": "沈海明" },
  { "companyname": "青云人力资源", "phone": "18915586833", "name": "王兆辉" },
  { "companyname": "明辉人力资源", "phone": "13337100991", "name": "沈明南" },
  { "companyname": "景风人力资源", "phone": "18015565633", "name": "张琳旺" },
  { "companyname": "朝明人力资源", "phone": "13961283422", "name": "钱大满" }]
}


const occupations = { "occupations": ["洗碗", "整理", "前台", "打扫", "端菜", "厨师"] }

const need = json_merger.merge(advisers, occupations)


const originorder1 = {
  "originorder": {
    "orderid": "orderid123",
    "occupation": "端菜",
    "datetime": 2000000,
    "duration": 2,
    "mode": 1,
    "count": 10,
    "male": 6,
    "female": 4,
    "orderstate": 1
  }
}

const adviser1 = {
  "adviser": {
    "name": "王兆辉",
    "phone": "16621381456",
    "companyname": "青云人力资源",
    "introduction": "青云人力资源成立于1998年，是青岛资深的人力资源公司"
  }
}

const adviser2 = {
  "adviser": {
    "name": "张琳旺",
    "phone": "162621381456",
    "companyname": "景风人力资源",
    "introduction": "景风人力资源的前身是京风人力，曾经为海尔集团提供人力资源服务"
  }
}

const adviser3 = {
  "adviser": {
    "name": "钱大满",
    "phone": "16621381456",
    "companyname": "朝明人力资源",
    "introduction": "朝明人力成立于2009年，是青岛本地的人力资源公司"
  }
}
const modifiedorder1 = {
  "modifiedorder": [{
    "orderid": "orderid123",
    "changeddatetime": "110000",
    "changedduration": "3",
    "changedmode": "1",
    "changedcount": "12",
    "changedmale": "5",
    "changedfemale": "7"
  }]
}

const maleyet1 = { "maleyet": 3 }
const femaleyet1 = { "femaleyet": 2 }
const countyet1 = { "countyet": 5 }
const state1 = { "state": 1 }

const originorder2 = {
  "originorder": {
    "orderid": "order234",
    "occupation": "厨师",
    "datetime": 200000,
    "duration": 3,
    "mode": 1,
    "count": 10,
    "male": 6,
    "female": 4,
    "orderstate": 1

  }
}



const modifiedorder2 = {
  "modifiedorder": [
    {
      "orderid": "order234",
      "changeddatetime": "210000",
      "changedduration": "4",
      "changedmode": "1",
      "changedcount": "12",
      "changedmale": "5",
      "changedfemale": "7"
    },
    {
      "orderid": "order234",
      "changeddatetime": "210001",
      "changedduration": "5",
      "changedmode": "1",
      "changedcount": "12",
      "changedmale": "5",
      "changedfemale": "7"
    }
  ]
}
const maleyet2 = { "maleyet": 2 }
const femaleyet2 = { "femaleyet": 1 }
const countyet2 = { "countyet": 3 }
const state2 = { "state": 1 }

const originorder3 = {
  "originorder": {
    "orderid": "order345",
    "occupation": "端菜",
    "datetime": 100000,
    "duration": 4,
    "mode": 1,
    "count": 10,
    "male": 6,
    "female": 4,
    "orderstate": 0
  }
}

const modifiedorder3 = {
  "modifiedorder": [{
    "orderid": "order345",
    "changeddatetime": "210005",
    "changedduration": "4",
    "changedmode": "1",
    "changedcount": "12",
    "changedmale": "5",
    "changedfemale": "7"
  }]
}
const maleyet3 = { "maleyet": 0 }
const femaleyet3 = { "femaleyet": 0 }
const countyet3 = { "countyet": "0" }
const state3 = { "state": 0 }

const hotel1 = {
  "hotel": {
    "hotelid": "hotel123",
    "hotelname": "Hilton",
    "hotelphone": "17765009966",
    "hotelintroduction": "希尔顿酒店是一家五星级酒店",
    "hoteladdress": "青岛市大东海路2号"
  }
}

const hotel2 = {
  "hotel": {
    "hotelid": "hotel345",
    "hotelname": "crown",
    "hotelphone": "19987664500",
    "hotelintroduction": "青岛皇冠酒店是一家五星级酒店",
    "hoteladdress": "青岛市南海区大渡河路33号"
  }
}

const hotel3 = {
  hotel: {
    "hotelid": "hotel456",
    "hotelname": "喜来登",
    "hotelphone": "16642119988",
    "hotelintroduction": "喜来登酒店是青岛的一家五星级酒店",
    "hoteladdress": "青岛市南海区无锡路2号"
  }
}

const postorder1 = {
  "postorder": {
    "orderid": "order123",
    "salary": 100,
    "workcontent": "打扫打扫",
    "attention": "注意礼貌",
    "isfloat": 1
  }
}


const postorder2 = {
  postorder: {
    "orderid": "order23456",
    "salary": 200,
    "workcontent": "卫生工作",
    "attention": "有健康证",
    "isfloat": 0
  }
}

//postorder3 还没开始招募

var tmp = json_merger.merge(modifiedorder1, originorder1)
var tmp = json_merger.merge(tmp, maleyet1)
var tmp = json_merger.merge(tmp, femaleyet1)
var tmp = json_merger.merge(tmp, countyet1)
var tmp = json_merger.merge(tmp, adviser1)
var tmp = json_merger.merge(tmp, state1)
var tmp = json_merger.merge(tmp, hotel1)
var tmp = json_merger.merge(tmp, postorder1)
var orderbyorderid = tmp
//var orderbyorderid = {originorder1,modifiedorder1,femaleyet1,maleyet1,countyet1,adviser1}

var tmp = json_merger.merge(modifiedorder2, originorder2)
var tmp = json_merger.merge(tmp, maleyet2)
var tmp = json_merger.merge(tmp, femaleyet2)
var tmp = json_merger.merge(tmp, countyet2)
var tmp = json_merger.merge(tmp, adviser2)
var tmp = json_merger.merge(tmp, state2)
var tmp = json_merger.merge(tmp, hotel1)
var tmp = json_merger.merge(tmp, postorder2)
var order2 = tmp

console.log(order2)

var tmp = json_merger.merge(modifiedorder3, originorder3)
var tmp = json_merger.merge(tmp, maleyet3)
var tmp = json_merger.merge(tmp, femaleyet3)
var tmp = json_merger.merge(tmp, countyet3)
var tmp = json_merger.merge(tmp, adviser3)
var tmp = json_merger.merge(tmp, state3)
var tmp = json_merger.merge(tmp, hotel3)
var order3 = tmp


var orderbydate = JSON.stringify([order2, order3])
var orderbyid = JSON.stringify([orderbyorderid])

var user = {
  "id": "test93022",
  "email": "test@yuhu.tech",
  "password": "test123",
  "profile": {
    "id": "profileid123",
    "phone": "16331389909",
    "companyname": "海明人力资源",
    "name": "杨力青",
  }
}


const order = [order3, order2]
console.log(order)
console.log(orderbyorderid)

module.exports = { need, orderbyorderid, orderbydate, order2, order3, user, orderpayload }






