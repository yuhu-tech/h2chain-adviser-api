const { getUserId } = require('../utils')
const {need, orderbyorderid, orderbydate,order2,order3, user,orderpayload}= require('./mock')


const query = {
  async me (parent, args, ctx, info) {
    const id = getUserId(ctx)
    console.log(id)
    const users = await ctx.prisma.users({where:{id}})
    const profiles = await ctx.prisma.profiles({where:{user:{id:id}}})
    const result = {
      name:users[0].name,
      email:users[0].email,
      profile:profiles[0]
    }
      return result

   },

  async search (parent, args, ctx, info){
    const id = getUserId(ctx)
    console.log(id)
    if (args.orderid != "" && args.orderid != undefined ){
     const morder = [orderbyorderid]
     console.log(morder)
     console.log(args.orderid)
      return morder
    }
        else {
        console.log(order2)
          console.log(order3)
          const order = [order2,order3]
          console.log(order)
          return order
        }
  }
}

module.exports = { query }
