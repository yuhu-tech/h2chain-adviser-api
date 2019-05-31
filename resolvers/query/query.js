const { getUserId } = require('../../utils/utils')
const handles = require('../handle/adviser')
const messages = require('../../grpc/query/query_pb')
const services = require('../../grpc/query/query_grpc_pb')
const grpc = require('grpc')
const config = require('../../conf/config')
const client = new services.QueryOrderClient(config.localip, grpc.credentials.createInsecure());
const { QueryTransaction } = require('../../token/ali_token/handle/query/query')
const utils = require('../../token/ali_token/utils/utils')

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

  async mywallet(parent,args,ctx,info){
    var id = getUserId(ctx)
    const profiles = await ctx.prismaHr.profiles({where:{user:{id:id}}})
    return {
      adviseraddr: profiles[0].adviseradd,
      balance: 0 
    }
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
      todo = await handles.AdviserGetOrderList(ctx, id, args.orderid, 0, args.datetime, args.ptname, args.type, args.inviterid);
      doing = await handles.AdviserGetOrderList(ctx, id, args.orderid, 1, args.datetime, args.ptname, args.type, args.inviterid);
      Array.prototype.push.apply(todo, doing)
      return todo
    } else {
      return handles.AdviserGetOrderList(ctx, id, args.orderid, args.state, args.datetime, args.ptname, args.type, args.inviterid)
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
    request.setPtid(args.ptid)
    client.queryRemark(request, function (err, response) {
      var res = JSON.parse(response.array[0])
      return res.orderCandidates[0].remark
    });
  },

  async searchhash(parent,args,ctx,info) {
    var result  = await QueryTransaction(args.txhash)
    var res = await utils.Hex2Str(result.originData)
    var res = JSON.parse(res.str)
    res['chainname'] = '蚂蚁区块链h2chain项目'
    var contracts = await ctx.prismaHotel.contracts({where:{hash:args.txhash}})
    res['blocknumber'] = contracts[0].blocknumber
    res['contractaddress'] = '0x3a758e6e367a783c7e845a91421b6def99972445bcf127bc258c145704953dc6'
    res['hash'] = args.txhash
    return res
  }
}

module.exports = { query }
