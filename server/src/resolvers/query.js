const { getUserId } = require('../utils')
const {need, orderbyorderid, orderbydate,order2,order3, user,orderpayload}= require('./mock')
const handles = require('../resolvers/handle/adviser')
const messages = require('../../../grpc/examples/node/static_codegen/src/query_pb')
const services = require('../../../grpc/examples/node/static_codegen/src/query_grpc_pb')
const grpc = require('../../../grpc/examples/node/node_modules/grpc')

const query = {
  async me (parent, args, ctx, info) {
    const id = getUserId(ctx)
    const users = await ctx.prismaHr.users({where:{id}})
    const profiles = await ctx.prismaHr.profiles({where:{user:{id:id}}})
    var   result = {
      name:users[0].name,
      email:users[0].email,
      phone:users[0].phone,
      profile:profiles[0]
    }
      return result
   },

  async mytemplate (parent,args,ctx,info) { 
    const id  = getUserId(ctx)
    console.log(id)
    const workcontents = await ctx.prismaHr.workcontents({where:{userid:id}})
    const attentions  =  await ctx.prismaHr.attentions({where:{userid:id}})
    var result  = {
    workcontents : workcontents,
    attentions : attentions
    }
    console.log(result)
    return result   
},

  async search (parent, args, ctx, info){
    const id = getUserId(ctx)
    return  handles.AdviserGetOrderList(ctx,id,args.orderid,args.state,args.datetime)  
  },
   
  async searchptoforder (parent,args,ctx,info){
    console.log(args)
    return  handles.GetPtofOrder(ctx,args.orderid)
  }
}

module.exports = { query }
