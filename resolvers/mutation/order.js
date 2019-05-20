const { getUserId } = require('../../utils/utils')
const messages = require('../../grpc/mutation/mutation_pb');
const services = require('../../grpc/mutation/mutation_grpc_pb');
const grpc = require('grpc');
const config = require('../../conf/config')
const sd = require('silly-datetime')
const formid = require('../../msg/msghandle/formid/redis')
const sendtoh = require('../../msg/msghandle/sendmsg/hotelmsg')
const client = new services.MutationClient(config.localip, grpc.credentials.createInsecure());
const handles = require('../handle/adviser')
const sendtop = require('../../msg/msghandle/sendmsg/ptmsg')

const order = {
  async postorder(parent, args, ctx, info) {
    const id = getUserId(ctx)
    var request = new messages.PostRequest('');
    request.setOrderid(args.postorder.orderid);    //发布订单的Id(可以通过订单创建接口得到)
    request.setIsfloat(args.postorder.isfloat);                              //雇佣人数是否浮动
    request.setHourlysalary(args.postorder.salary);                        //时薪
    request.setWorkcontent(args.postorder.workcontent);             //工作内容
    request.setAttention(args.postorder.attention);                   //注意事项
    client.postOrder(request, function (err, response) {});
    //TODO  we will add formid into args in graphql
    // set formid which is created when adviser post order
    var userId = id
    var orderId = args.postorder.orderid
    var formId = args.formid
    var setRes = await formid.setFormId(userId, orderId, formId)
    console.log('set formid after creating :', setRes)

    todo = await handles.AdviserGetOrderList(ctx, id, args.postorder.orderid, 0)
    doing = await handles.AdviserGetOrderList(ctx, id, args.postorder.orderid, 1)
    Array.prototype.push.apply(todo, doing)
    var hotelUsers = await ctx.prismaHotel.users({ where: { id: todo[0].originorder.hotelid } })
    // send msg to hotel after posting

    // we will fulfill all the blanks in the messages
    var advisers = await ctx.prismaHr.users({where :{id:id}})
    var profiles = await ctx.prismaHr.profiles({where:{user:{id:advisers[0].id}}})
    var advisername = advisers[0].name
    var advisercompany = profiles[0].companyname
    var occupation = todo[0].originorder.occupation
    if (todo[0].modifiedorder.length){
    var datetime = todo[0].modifiedorder[0].changeddatetime
    } else {
    var datetime = todo[0].originorder.datetime
    }
    var date = new Date(datetime*1000)
    var HotelMsgData = {
      userId: todo[0].originorder.hotelid,
      orderId: todo[0].originorder.orderid,
      openId:  hotelUsers[0].wechat,
      num: 1,
      content: {
        keyword1: advisercompany + ' '+ advisername,
        keyword2: date.getFullYear()+'年'+date.getMonth()+'月'+date.getDate()+'日'+date.getHours()+'时开始' + ' ' + occupation,
        keyword3: sd.format(new Date(), 'YYYY/MM/DD HH:mm'),
      }
    }
    var sendHRes = await sendtoh.sendTemplateMsgToHotel(HotelMsgData);
    console.log('send msg to hotel after posting', sendHRes)
    var error = false
    return error
  },

  async modifyptoforder(parent, args, ctx, info) {
    try {
      const id = getUserId(ctx)
      todo = await handles.AdviserGetOrderList(ctx, id, args.orderid, 1)
      var request = new messages.ModifyPtRequest();
      request.setOrderid(args.orderid);       // OrderID 必传
      request.setPtid(args.ptid);
      request.setTargetstatus(args.ptstatus);                           // PT 目标状态 筛选条件，不同传 -1
      // we will refuse anyone whatever his status is   
      // request.setSourcestatus(1);                           // PT 原始状态  
      client.modifyPTOfOrder(request, function (err, response) { })
      // to generate and save orderid
      var userId = id
      var orderId = args.orderid
      var formId = args.formid
      var setRes = await formid.setFormId(userId, orderId, formId)
      console.log('set formid after creating :', setRes)
      // to send msgs to a pt
      var advisers  = await ctx.prismaHr.users({where:{id:id}})
      var profiles = await ctx.prismaHr.profiles({where:{user:{id:advisers[0].id}}})
      var advisername = advisers[0].name
      var advisercompany = profiles[0].companyname
      var occupation = todo[0].originorder.occupation
      if (todo[0].modifiedorder.length){
        var datetime = todo[0].modifiedorder[0].changeddatetime
      } else {
        var datetime = todo[0].originorder.datetime
      }
      var date = new Date(datetime*1000)
      if (args.ptstatus == 2) {
        for (i=0; i<todo[0].pt.length;i++){
          var users = await ctx.prismaClient.users({ where: { id: todo[0].pt[i].ptid } } )
          var openId = users[0].wechat
          var PtMsgData = {
          userId: todo[0].pt[i].ptid,
          orderId: args.orderid,
          openId: openId,
          num: 2,
          content: {
            keyword1: date.getFullYear()+'年'+date.getMonth()+'月'+date.getDate()+'日'+date.getHours()+'时开始' + ' ' + occupation,
            keyword2: "对不起，您申请的职位没有通过哦，下次再接再厉！",
            keyword3: advisercompany + '' + advisername,
          }
        }
         var sendPRes = await sendtop.sendTemplateMsgToPt(PtMsgData)
         console.log('send msg to pt after refusing', sendPRes)
        }
      }
      return true
    } catch (error) {
      throw (error)
    }
  },

  async closeorder(parent, args, ctx, info) {
    var client = new services.MutationClient(config.localip, grpc.credentials.createInsecure());
    var request = new messages.CloseRequest();
    request.setOrderid(args.orderid)
    client.closeOrder(request, function (err, response) { })
  },

  async editremark(parent, args, ctx, info) {
    const id = getUserId(ctx)
    try {
      var request = new messages.EditRequest();

      request.setOrderid(args.orderid)     // 订单id         必传
      request.setPtid(args.ptid)                            // ptid          必传
      request.setStartdate(args.startdate)                         // 用工开始时间     
      request.setEnddate(args.enddate)                          // 用工结束时间
      request.setRealsalary(args.realsalary)                           // 实际时薪
      request.setIsworked(args.isworked)                              // 是否参加了工作  必传  状态码： 1 - 表示参加工作  2 - 表示未参加
      request.setType(args.type)
      client.editRemark(request, function (err, response) { })
    } catch (error) {
      throw (error)
    }
    return true
  }
}

module.exports = { order }
