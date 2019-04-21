const { getUserId } = require('../utils')
const {need, orderbyorderid, orderbydate,order2,order3, user,orderpayload}= require('./mock')
const handles = require('../resolvers/handle/adviser')
const messages = require('../../../grpc/examples/node/static_codegen/src/query_pb')
const services = require('../../../grpc/examples/node/static_codegen/src/query_grpc_pb')
const grpc = require('../../../grpc/examples/node/node_modules/grpc')

const query = {
  async me (parent, args, ctx, info) {
    const id = getUserId(ctx)
    console.log(id)
    const users = await ctx.prismaHr.users({where:{id}})
    const profiles = await ctx.prismaHr.profiles({where:{user:{id:id}}})
    const result = {
      name:users[0].name,
      email:users[0].email,
      profile:profiles[0]
    }
      return result
   },

  async search (parent, args, ctx, info){
    const id = getUserId(ctx)
    return  handles.AdviserGetOrderList(ctx,id,args.orderid,args.state,args.datetime)  
  },
   
  async searchptoforder (parent,args,ctx,info){
    var client  = new services.QueryOrderClient('127.0.0.1:50051',grpc.credentials.createInsecure());
    var request = new messages.QueryPTRequest();
        request.setOrderid(args.orderid);
    client.queryPTOfOrder(request,function(err,response){
        console.log(response.array[0][0])
    });
  }
}

module.exports = { query }
