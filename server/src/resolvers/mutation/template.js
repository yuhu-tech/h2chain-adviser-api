const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {need,orderbyorderid,orderbydate,order2,order3,user,orderpayload}= require('../mock')
const {getUserId} = require('../../utils')

const template = {
  async createtemplate(parent, args, ctx, info) {
    try{
    const id = getUserId(ctx)
    console.log(ctx)
    var template = await ctx.prismaHr.createTemplate(
      {
         userid :  id, 
         workcontent: args.workcontent,
         attention: args.attention
      }
    )
      return true
    } catch (error){
      throw (error)
    }
  },

  async deletetemplate(parent, args, ctx, info){
    try{
     var template = await ctx.prismaHr.deleteTemplate(
       {id : args.templateid}
     )  
       return true
   } catch (error) {
     throw (error)
   }
},

  async modifytemplate(parent, args, ctx, info){
    try{
      var template = await ctx.prismaHr.updateTemplate(
      {
        data:{
         workcontent : args.workcontent,
         attention : args.attention
         },
        where:{ id : args.templateid} 
      } 
      )
       return true
      } catch (error){
        throw (error)
      }
 }
} 

module.exports = { template }
