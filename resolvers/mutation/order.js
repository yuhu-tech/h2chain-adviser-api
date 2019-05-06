const { getUserId } = require('../../utils/utils')
const messages = require('../../grpc/mutation/mutation_pb');
const services = require('../../grpc/mutation/mutation_grpc_pb');
const grpc = require('grpc')
const client = new services.MutationClient('127.0.0.1:50051', grpc.credentials.createInsecure());


const order = {
  async postorder(parent, args, ctx, info) {
    var request = new messages.PostRequest('');
    request.setOrderid(args.postorder.orderid);    //发布订单的Id(可以通过订单创建接口得到)
    request.setIsfloat(args.postorder.isfloat);                              //雇佣人数是否浮动
    request.setHourlysalary(args.postorder.salary);                        //时薪
    request.setWorkcontent(args.postorder.workcontent);             //工作内容
    request.setAttention(args.postorder.attention);                   //注意事项
    client.postOrder(request, function (err, response) {
    });
    var error = false
    return error
  },

  async modifyptoforder(parent, args, ctx, info) {
    try {
      var request = new messages.ModifyPtRequest();
      request.setOrderid(args.orderid);       // OrderID 必传
      request.setPtid(args.ptid);
      request.setTargetstatus(2);                           // PT 目标状态 筛选条件，不同传 -1
      // we will refuse anyone whatever his status is   
      // request.setSourcestatus(1);                           // PT 原始状态  
      client.modifyPTOfOrder(request, function (err, response) { })
      return true
    } catch (error) {
      throw (error)
    }
  },

  async closeorder(parent, args, ctx, info) {
    var client = new services.MutationClient('119.3.106.151:50051', grpc.credentials.createInsecure());
    var request = new messages.CloseRequest();
    request.setOrderid(args.orderid)
    client.closeOrder(request, function (err, response) {
    })
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
      client.editRemark(request, function (err, response) {
      })
    } catch (error) {
      throw (error)
    }
  }
}

module.exports = { order }
