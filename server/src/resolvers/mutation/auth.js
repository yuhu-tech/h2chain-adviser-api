const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {need,orderbyorderid,orderbydate,order2,order3,user,orderpayload}= require('../mock')
const {getUserId} = require('../../utils')

const auth = {
  async signup(parent, args, ctx, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.prismaHr.createUser(
      { ...args, password },
    )
    return {
      token: jwt.sign({ userId: user.id }, 'jwtsecret123'),
      user,
    }
  },

  async login(parent, { email, password }, ctx, info) {
    const users = await ctx.prismaHr.users({ where: { email } })
    if (!users) {
      throw new Error(`No such user found for email: ${email}`)
    }
    const user = users[0]
    console.log(user)
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }

    return {
      token: jwt.sign({ userId: user.id }, 'jwtsecret123'),
      user
    }
  },

  async postorder (parent,args,ctx,info){
    console.log("Successfully post an order")
    const morderpayload = orderpayload
    return morderpayload
  },

  async changepassword(parent, args, ctx, info){
    const id = getUserId(ctx)
    console.log(id);
    console.log(args)
    const users = await ctx.prismaHr.users({where:{id}})
      if (!users){
       throw new Error(`No such user found for email: ${email}`)
       }
      const valid = await bcrypt.compare(args.oldpassword,users[0].password)
      if (!valid) {
         throw new Error ('Invalid Password')
      }
      else {
        const newPassword = await bcrypt.hash(args.newpassword, 10)
        const returning = await ctx.prismaHr.updateUser(
          {
            data:{password: newPassword},
            where:{id: users[0].id}
          }
        )
      }
      return{"error":false}
  }
}


module.exports = { auth }
