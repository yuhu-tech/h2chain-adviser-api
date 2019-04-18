const { getUserId } = require('../utils')
const {need, orderbyorderid, orderbydate,order2,order3, user,orderpayload}= require('./mock')
const handles = require('../resolvers/handle/adviser')

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
}
}

module.exports = { query }
