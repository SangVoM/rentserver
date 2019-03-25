exports.sendsms = (to, smsContent, smsType, brandName, dlr) =>

    new Promise((resolve, reject) => {
        var request = require('request');

        var headers = {
            'Content-Type': 'application/json'
        };

        var dataString = '{"to": ["'+ to +'"], "content": "'+ smsContent +'", "sms_type": 2, "sender": ""}';

        var options = {
            url: 'http://api.speedsms.vn/index.php/sms/send',
            method: 'POST',
            headers: headers,
            body: dataString,
            auth: {
                'user': '_9d_Kf2LvM2rvM-oi6UIDjgBzjvKezMy',
                'pass': ''
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }

        request(options, callback);

      /*  const SMS_TYPE_QC = 1; // loai tin nhan quang cao
        const SMS_TYPE_CSKH = 2; // loai tin nhan cham soc khach hang
        const SMS_TYPE_BRANDNAME = 3; // loai tin nhan brand name cskh

        const ROOT_URL = "http://api.speedsms.vn/index.php";
        const accessToken = "_9d_Kf2LvM2rvM-oi6UIDjgBzjvKezMy";
        if (!to || !smsContent)
            return null;

        type = SMS_TYPE_CSKH;
        if (smsType)
            type = smsType;

        if (type < 1 && type > 3)
            return null;

        if (type === 3 && !brandName)
            return null;

        if (brandName.length > 11)
            return null;

        if (type !== 2)
            dlr = 0;
        const result = [];
        const temp = {
            to: to,
            content: smsContent,
            sms_type : type,
            brandname : brandName,
            dlr  : dlr
        };
        result.push(temp);
        const ok = {
            result : result
        };

        console.log(result);
*/



    });