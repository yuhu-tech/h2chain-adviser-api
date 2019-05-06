const { getUserId } = require('../utils')
const handles = require('../resolvers/handle/adviser')
const messages = require('../../../grpc/examples/node/static_codegen/src/query_pb')
const services = require('../../../grpc/examples/node/static_codegen/src/query_grpc_pb')
const grpc = require('../../../grpc/examples/node/node_modules/grpc')
const client = new services.QueryOrderClient('127.0.0.1:50051', grpc.credentials.createInsecure());

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
    console.log(id)
    const workcontents = await ctx.prismaHr.workcontents({ where: { userid: id } })
    const attentions = await ctx.prismaHr.attentions({ where: { userid: id } })
    var result = {
      workcontents: workcontents,
      attentions: attentions
    }
    console.log(result)
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
    return handles.AdviserGetOrderList(ctx, id, args.orderid, args.state, args.datetime)
       }
    },

  async searchptoforder(parent, args, ctx, info) {
    console.log(args)
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
      console.log(res.orderCandidates[0].remark)
      return res.orderCandidates[0].remark
    });
  }
}

module.exports = { query }
