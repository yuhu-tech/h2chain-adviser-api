const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getUserId } = require('../../utils')

const template = {
  async createtemplate(parent, args, ctx, info) {
    try {
      const id = getUserId(ctx)
      if (args.type == 'workcontent') {
        var workcontent = await ctx.prismaHr.createWorkcontent({ userid: id, workcontent: args.value })
      }
      else {
        var attention = await ctx.prismaHr.createAttention({ userid: id, attention: args.value })
      }
      return true
    } catch (error) {
      throw (error)
    }
  },

  async deletetemplate(parent, args, ctx, info) {
    try {
      const id = getUserId(ctx)
      if (args.type == 'workcontent') {
        var workcontent = await ctx.prismaHr.deleteWorkcontent({ id: args.id })
      }
      else {
        var attention = await ctx.prismaHr.deleteAttention({ id: args.id })
      }
      return true
    } catch (error) {
      throw (error)
    }
  },

  async modifytemplate(parent, args, ctx, info) {
    try {
      const id = getUserId(ctx)
      if (args.type == 'workcontent') {
        var workcontent = await ctx.prismaHr.updateWorkcontent({ data: { workcontent: args.value }, where: { id: args.id } })
      }
      else {
        var attention = await ctx.prismaHr.updateAttention({ data: { attention: args.value }, where: { id: args.id } })
      }
      return true
    } catch (error) {
      throw (error)
    }
  }
}

module.exports = { template }
