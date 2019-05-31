const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getUserId, getOpenId } = require('../../utils/utils')
const { CreateAccount }  = require('../../token/ali_token/handle/mutation/mutation')
const { QueryAccount } = require('../../token/ali_token/handle/query/query')

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

  async login(parent, { email, password, jscode }, ctx, info) {
    const users = await ctx.prismaHr.users({ where: { email } })
    if (!users) {
      throw new Error(`No such user found for email: ${email}`)
    }
    const user = users[0]
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }
    //we will update wechat openid here
    try {
      wechat = await getOpenId(jscode, 2)
      const thisuser = await ctx.prismaHr.updateUser(
        {
          data: { wechat: wechat },
          where: { email: email }
        }
      )
    } catch (error) {
      throw (error)
    }

    var profiles = await ctx.prismaHr.profiles({ where: { user: { id: user.id } } })
    if (profiles[0].adviseradd == null) {
      var keys = await CreateAccount(profiles[0].id)
      console.log(keys)
      var updatekeys = await ctx.prismaHr.updateProfile(
        {
          data: {
            privatekey: keys.privateKey,
            publickey: keys.publicKey,
          },
          where: { id: profiles[0].id }
        }
      )
      //更新钱包信息
      var identity = await QueryAccount(profiles[0].id)
      var updateidentity = await ctx.prismaHr.updateProfile(
        {
          data: {
            ptadd: identity.identity
          },
          where: { id: personalmsg.id }
        }
      )
      console.log("更新钱包信息成功")
    }
    return {
      token: jwt.sign({ userId: user.id }, 'jwtsecret123'),
      user
    }
  },

  async postorder(parent, args, ctx, info) {
    const morderpayload = orderpayload
    return morderpayload
  },

  async changepassword(parent, args, ctx, info) {
    const id = getUserId(ctx)
    const users = await ctx.prismaHr.users({ where: { id } })
    if (!users) {
      throw new Error(`No such user found for email: ${email}`)
    }
    const valid = await bcrypt.compare(args.oldpassword, users[0].password)
    if (!valid) {
      throw new Error('Invalid Password')
    }
    else {
      try {
        const newPassword = await bcrypt.hash(args.newpassword, 10)
        const returning = await ctx.prismaHr.updateUser(
          {
            data: { password: newPassword },
            where: { id: users[0].id }
          }
        )
      } catch (error) {
        throw (error)
      }
    }
    return { "error": false }
  },
}


module.exports = { auth }
