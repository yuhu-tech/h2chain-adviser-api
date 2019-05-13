const request = require('request')
const templates = require('../model/msgtemplates')
const formId = require('../formid/redis')
const rds = require('../../../utils/redis_accesstoken')


async function sendTemplateMsgToHotel(HotelMsgData) {
    try {
        //获取access_token 拼接url
        var num = 1
        var access_token = await rds.getAccessToken(num)
        const url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${access_token}`

        //获取field和formId
        var key = HotelMsgData.userId + HotelMsgData.orderId
        var getRes = await formId.getFormId(key);

        //获取消息模版,拼接消息内容
        var templateId = ''
        var data = {}
        switch (HotelMsgData.num) {
            case 1:
                templateId = templates.HotelTIs.msgOne
                data = {
                    "keyword1": {
                        "value": HotelMsgData.content.keyword1
                    },
                    "keyword2": {
                        "value": HotelMsgData.content.keyword2
                    },
                    "keyword3": {
                        "value": HotelMsgData.content.keyword3
                    },
                }
                break;
            case 2:
                templateId = templates.HotelTIs.msgTwo
                data = {
                    "keyword1": {
                        "value": HotelMsgData.content.keyword1
                    },
                    "keyword2": {
                        "value": HotelMsgData.content.keyword2
                    },
                }
                break;
            default:
                break;
        }

        // 拼接模版消息发送的requestData数据
        const requestData = {
            "touser": HotelMsgData.openId,
            "template_id": templateId,
            "page": "index",
            "form_id": getRes.formId,
            "data": data,
        };

        // 发送模版消息
        await request({
            url: url,
            method: 'post',
            body: JSON.stringify(requestData),
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log('服务消息推送成功');
            } else {
                throw error
            }
        });

        //发送完成后删除已使用的formid
        var delres = await formId.delFormId(key, getRes.field)
        console.log('删除结果:' + delres)
    } catch (error) {
        console.log('酒店端推送消息失败:', error)
    }
};


module.exports = {
    sendTemplateMsgToHotel
};