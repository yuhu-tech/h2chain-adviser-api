const { getUserId } = require('../../utils')
const messages = require('../../../../grpc/examples/node/static_codegen/hotelgrpc/mutation_pb');
const services = require('../../../../grpc/examples/node/static_codegen/hotelgrpc/mutation_grpc_pb');
const grpc = require('../../../../grpc/examples/node/node_modules/grpc')
const client = new services.MutationClient('127.0.0.1:50051',grpc.credentials.createInsecure());


const order = {
  async postorder(parent,args,ctx,info){
    var client  = new services.MutationClient('127.0.0.1:50051',grpc.credentials.createInsecure());
    var request = new messages.PostRequest('');
        request.setOrderid(args.postorder.orderid);    //发布订单的Id(可以通过订单创建接口得到)
        request.setIsfloat(args.postorder.isfloat);                              //雇佣人数是否浮动
        request.setHourlysalary(args.postorder.salary);                        //时薪
        request.setWorkcontent(args.postorder.workcontent);             //工作内容
        request.setAttention(args.postorder.attention);                   //注意事项
    client.postOrder(request,function(err,response){
        console.log(response.array)
    });
       var error = false
       return error
  }
}

module.exports = { order }
