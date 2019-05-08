var messages = require('../../grpc/query/query_pb');
var services = require('../../grpc/query/query_grpc_pb');
var grpc = require('grpc');
const config = require('../../conf/config');
var client = new services.QueryOrderClient(config.localip, grpc.credentials.createInsecure())

function queryOrder(request) {
    return new Promise((resolve, reject) => {
        client.queryOrder(request, (err, date) => {
            if (err) reject(err);
            resolve(date);
        })
    })
}

function queryPt(request) {
    return new Promise((resolve, reject) => {
        client.queryPTOfOrder(request, (err, date) => {
            if (err) reject(err);
            resolve(date);
        })
    })
}


function queryHistory(request) {
    return new Promise((resolve, reject) => {
        client.queryExperience(request, (err, date) => {
            if (err) reject(err);
            resolve(date);
        })
    })
}

function queryRemark(request) {
    return new Promise((resolve, reject) => {
        client.queryRemark(request, (err, date) => {
            if (err) reject(err);
            resolve(date);
        })
    })
}

async function AdviserSearchHistory(ctx, ptid) {
    var request = new messages.QueryExperienceRequest();
    request.setPtid(ptid)
    var response = await queryHistory(request)
    var res = JSON.parse(response.array[0])
    var history = []
    if (res.orderOrigins.length < 5) {
        var worked = {}
        for (i = 0; i < res.orderOrigins.length; i++) {
            //worked['hotelid'] = res.orderOrigins[i].hotelId;
            worked['occupation'] = res.orderOrigins[i].job;
            var users = await ctx.prismaHotel.users({ where: { id: res.orderOrigins[i].hotelId } })
            var profiles = await ctx.prismaHotel.profiles({ where: { user: { id: res.orderOrigins[i].hotelId } } })
            worked['hotelname'] = profiles[0].name
            history.push(worked)
        }
    } else {
        var worked = {}
        for (i = 0; i < 5; i++) {
            //worked['hotelid'] = res.orderOrigins[i].hotelID;
            worked['occupation'] = res.orderOrigins[i].job;
            var users = await ctx.prismaHotel.users({ where: { id: res.orderOrigins[i].hotelId } })
            var profiles = await ctx.prismaHotel.profiles({ where: { user: { id: res.orderOrigins[i].hotelId } } })
            worked['hotelname'] = profiles[0].name
            history.push(worked)
        }
    }
    return history
}




//this function may not be uesd, I wrote it down here in AdviserGetOrderList
async function GetPtofOrder(ctx, orderid) {
    var client = new services.QueryOrderClient(config.localip, grpc.credentials.createInsecure());
    var request = new messages.QueryPTRequest();
    request.setOrderid(orderid);
    client.queryPTOfOrder(request, function (err, response) {
    });
}


async function AdviserGetOrderList(ctx, adviserid, orderid, state, datetime, ptname) {
    try {
        var request = new messages.QueryRequest()
        if (orderid != null && orderid != undefined) {
            request.setOrderid(orderid)
        }
        if (datetime != null && datetime != undefined) {
            request.setDate(datetime)
        }
        if (state != null && state != undefined) {
            request.setStatus(state + 1)
        }
        if (adviserid != null && adviserid != undefined) {
            request.setAdviser(adviserid)
        }

        var response = await queryOrder(request);
        var res = JSON.parse(response.array[0])

        var orderList = []
        for (var i = 0; i < res.orderOrigins.length; i++) {
            var obj = {}
            var modifiedorder = []
            var isModified = false
            if (res.orderOrigins[i].orderHotelModifies.length != 0) {
                isModified = true
                for (var j = 0; j < res.orderOrigins[i].orderHotelModifies.length; j++) {
                    var modifiedorderObj = {}
                    modifiedorderObj['orderid'] = res.orderOrigins[i].id
                    modifiedorderObj['changeddatetime'] = res.orderOrigins[i].orderHotelModifies[j].dateTime
                    modifiedorderObj['changedduration'] = res.orderOrigins[i].orderHotelModifies[j].duration / 3600
                    modifiedorderObj['changedmode'] = res.orderOrigins[i].orderHotelModifies[j].mode
                    modifiedorderObj['changedcount'] = res.orderOrigins[i].orderHotelModifies[j].count
                    // there are two conditions: 1) if changed mode = 0 ,we set changed male and change female = 0 else we will
                    // set the female  = count - male
                    if (modifiedorderObj['changedmode'] == 0) {
                        modifiedorderObj['changedmale'] = 0
                        modifiedorderObj['changedfemale'] = 0
                    } else {
                        modifiedorderObj['changedmale'] = res.orderOrigins[i].orderHotelModifies[j].countMale
                        modifiedorderObj['changedfemale'] = res.orderOrigins[i].orderHotelModifies[j].count - res.orderOrigins[i].orderHotelModifies[j].countMale
                    }
                    modifiedorder.push(modifiedorderObj)
                }
            }
            var originorder = {}
            originorder['orderid'] = res.orderOrigins[i].id
            originorder['occupation'] = res.orderOrigins[i].job
            originorder['datetime'] = res.orderOrigins[i].datetime
            originorder['duration'] = res.orderOrigins[i].duration / 3600
            originorder['mode'] = res.orderOrigins[i].mode
            originorder['orderstate'] = res.orderOrigins[i].status
            if (res.orderOrigins[i].orderAdviserModifies.length != 0) {
                if (res.orderOrigins[i].orderAdviserModifies[0].isFloat) {
                    //we judge if we will tranfer male and female number by the mode
                    if (res.orderOrigins[i].mode == 0) {
                        originorder['male'] = 0
                        originorder['female'] = 0
                        originorder['count'] = Math.ceil(res.orderOrigins[i].count * 1.05)
                    } else {
                        originorder['male'] = Math.ceil(res.orderOrigins[i].countMale * 1.05)
                        originorder['female'] = Math.ceil((res.orderOrigins[i].count - res.orderOrigins[i].countMale) * 1.05)
                        originorder['count'] = originorder['male'] + originorder['female']
                    }
                } else {
                    if (res.orderOrigins[i].mode == 0) {
                        originorder['male'] = 0
                        originorder['female'] = 0
                        originorder['count'] = res.orderOrigins[i].count
                    } else {
                        originorder['male'] = res.orderOrigins[i].countMale
                        originorder['female'] = res.orderOrigins[i].count - res.orderOrigins[i].countMale
                        originorder['count'] = originorder['male'] + originorder['female']
                    }
                }
            } else {
                if (res.orderOrigins[i].mode == 0) {
                    originorder['male'] = 0
                    originorder['female'] = 0
                    originorder['count'] = res.orderOrigins[i].count
                } else {
                    originorder['male'] = res.orderOrigins[i].countMale
                    originorder['female'] = res.orderOrigins[i].count - res.orderOrigins[i].countMale
                    originorder['count'] = originorder['male'] + originorder['female']
                }
            }

            var adviser = {}
            adviser['name'] = res.orderOrigins[i].adviserId // 这里全部留了 adviserId 通过这个获取adviser信息
            //we add to retrieve from local databse for implement of Adviser message
            var adviserUsers = await ctx.prismaHr.users({ where: { id: res.orderOrigins[i].adviserId } })
            var adviserProfiles = await ctx.prismaHr.profiles({ where: { user: { id: adviserUsers[0].id } } })
            adviser['name'] = adviserUsers[0].name
            adviser['phone'] = adviserProfiles[0].phone
            adviser['companyname'] = adviserProfiles[0].companyname
            adviser["introduction"] = adviserProfiles[0].introduction

            var hotel = {}
            //we add to retrieve from local database for implement of Hotel messgae
            hotel['hotelid'] = res.orderOrigins[i].hotelId
            var users = await ctx.prismaHotel.users({ where: { id: res.orderOrigins[i].hotelId } })
            var profiles = await ctx.prismaHotel.profiles({ where: { user: { id: users[0].id } } })
            hotel['hotelname'] = profiles[0].name
            hotel['hotelphone'] = profiles[0].phone
            hotel['hotelintroduction'] = profiles[0].introduction
            hotel['hoteladdress'] = profiles[0].address
            hotel['cover'] = profiles[0].cover

            var postorder = {}
            if (res.orderOrigins[i].orderAdviserModifies.length != 0) {
                postorder['orderid'] = res.orderOrigins[i].id
                postorder['salary'] = res.orderOrigins[i].orderAdviserModifies[0].hourlySalary
                postorder['workcontent'] = res.orderOrigins[i].orderAdviserModifies[0].workCount   // 这里有一个命名错误，是由于datamodel.graphql 里面字段错误造成的，后续会改
                postorder['attention'] = res.orderOrigins[i].orderAdviserModifies[0].attention
                postorder['isfloat'] = res.orderOrigins[i].orderAdviserModifies[0].isFloat
            }

            obj['modifiedorder'] = modifiedorder
            obj['originorder'] = originorder
            obj['adviser'] = adviser
            obj['hotel'] = hotel
            obj['postorder'] = postorder
            obj['state'] = res.orderOrigins[i].status - 1

            // 查询当前已报名的男女人数
            // 调用queryPTOfOrder()接口查询，某个订单下已报名PT的总人数
            var pts = []
            try {
                var request = new messages.QueryPTRequest();
                request.setOrderid(res.orderOrigins[i].id);
                request.setPtstatus(13);
                var response = await queryPt(request)
                obj['countyet'] = response.array[0].length
                //initial obj[maleyet] and obj[femaleyet]
                if (obj['maleyet'] == undefined) { obj['maleyet'] = 0 }
                if (obj['femaleyet'] == undefined) { obj['femaleyet'] = 0 }
                for (var k = 0; k < obj['countyet']; k++) {
                    var ptid = response.array[0][k][0]
                    var personalmsgs = await ctx.prismaClient.personalmsgs({ where: { user: { id: ptid } } })
                    // to judge if there is a male or female
                    if (JSON.parse(personalmsgs[0].gender) == 1) {
                        obj['maleyet'] = obj['maleyet'] + 1
                    } else if (JSON.parse(personalmsgs[0].gender == 2)) {
                        obj['femaleyet'] = obj['femaleyet'] + 1
                    }
                    var pt = {}
                    pt['ptid'] = ptid
                    pt['name'] = personalmsgs[0].name
                    //TODO  if the ptname is not null and the pt['name'] not equals ptname, we will break it 
                    if (ptname != null && ptname != undefined && pt['name'] != ptname) { break }
                    pt['idnumber'] = personalmsgs[0].idnumber
                    pt['gender'] = personalmsgs[0].gender
                    pt['wechatname'] = "mocked wechat id"
                    pt['phonenumber'] = personalmsgs[0].phonenumber
                    var personalmsgs = await ctx.prismaClient.personalmsgs({ where: { user: { id: ptid } } })
                    var personalmsg = personalmsgs[0]
                    pt['height'] = personalmsgs[0].height
                    pt['weight'] = personalmsgs[0].weight
                    //here we retrieve ptorder state                
                    pt['ptorderstate'] = response.array[0][k][7]

                    var requestremark = new messages.QueryRemarkRequest()
                    requestremark.setOrderid(res.orderOrigins[i].id)
                    requestremark.setPtid(ptid)
                    var responseremark = await queryRemark(requestremark)
                    var resremark = JSON.parse(responseremark.array[0])
                    var remark = {}
                    if (resremark.orderCandidates[0].remark != undefined) {
                        remark['enddate'] = resremark.orderCandidates[0].remark.endDate
                        remark['realsalary'] = resremark.orderCandidates[0].remark.realSalary
                        remark['startdate'] = resremark.orderCandidates[0].remark.startDate
                        pt['remark'] = remark
                    }
                    //retrieve worktimes the number of orderorigins
                    var requestworktime = new messages.QueryExperienceRequest()
                    requestworktime.setPtid(ptid)
                    var responseworktime = await queryHistory(requestworktime)
                    var resworktime = JSON.parse(responseworktime.array[0])
                    pt['worktimes'] = resworktime.orderOrigins.length
                    //calculate worktime
                    var workhours = 0
                    for (var p = 0; p < resworktime.orderOrigins.length; p++) {
                        for (var q = 0; q < resworktime.orderOrigins[p].orderCandidates.length; q++) {
                            if (resworktime.orderOrigins[p].orderCandidates[q].remark != null && resworktime.orderOrigins[p].orderCandidates[q].remark.ptId === ptid) {
                                workhours = workhours + resworktime.orderOrigins[p].orderCandidates[q].remark.endDate - resworktime.orderOrigins[p].orderCandidates[q].remark.startDate
                            }
                        }
                    }

                    pt['workhours'] = Math.round(workhours / 3600)

                    pts.push(pt)
                }
                obj['pt'] = pts
            } catch (error) {
                throw error
            }
            if (isModified == true) {
                orderList.unshift(obj)
            } else {
                orderList.push(obj)
            }
        }
        return orderList
    } catch (error) {
        throw error
    }
}

module.exports = { queryOrder, queryPt, AdviserGetOrderList, GetPtofOrder, AdviserSearchHistory, queryHistory }
