const { getUserId } = require('../../utils/utils')
const handles = require('../handle/adviser')
const messages = require('../../grpc/query/query_pb')
const services = require('../../grpc/query/query_grpc_pb')
const grpc = require('grpc')
const config = require('../../conf/config')
const client = new services.QueryOrderClient(config.localip, grpc.credentials.createInsecure());

const query = {
  async me(parent, args, ctx, info) {
    const id = getUserId(ctx)
    const users = await ctx.prismaHr.users({ where: { id } })
    const profiles = await ctx.prismaHr.profiles({ where: { user: { id: id } } })
    var result = {
      name: users[0].name,
      email: users[0].email,
      phone: users[0].phone,
      profile: profiles[0]
    }
    return result
  },

  async mytemplate(parent, args, ctx, info) {
    const id = getUserId(ctx)
    const workcontents = await ctx.prismaHr.workcontents({ where: { userid: id } })
    const attentions = await ctx.prismaHr.attentions({ where: { userid: id } })
    var result = {
      workcontents: workcontents,
      attentions: attentions
    }
    return result
  },

  async search(parent, args, ctx, info) {
    const id = getUserId(ctx)
    if (args.state == 11) {
       todo =  await handles.AdviserGetOrderList(ctx,id,args.orderid,0,args.datetime,args.ptname); 
       doing = await handles.AdviserGetOrderList(ctx,id,args.orderid,1,args.datetime,args.ptname); 
       Array.prototype.push.apply(todo,doing)
       return todo 
       } else {
       return handles.AdviserGetOrderList(ctx, id, args.orderid, args.state, args.datetime,args.ptname)
       }
    },

  async searchptoforder(parent, args, ctx, info) {
    return handles.GetPtofOrder(ctx, args.orderid)
  },

  async searchhistory(parent, args, ctx, info) {
    return handles.AdviserSearchHistory(ctx, args.ptid)
  },

  async searchremark(parent, args, ctx, info) {
    const id = getUsedId(ctx)
    request.setOrderid(args.orderid)
    request.setPtid(id)
    client.queryRemark(request, function (err, response) {
      var res = JSON.parse(response.array[0])
      return res.orderCandidates[0].remark
    });
  }
}

module.exports = { query }
