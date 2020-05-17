exports.sendRes = function(res,data,status=0) {
    const message = {};
    message.data = data;
    message.success = true;
    message.status = 200 || status;

    return res.status(message.status).json(message);
};

exports.sendError = function(res,status,customMsg=undefined) {
    const message = {};

    if (typeof customMsg != 'undefined') {
        message.error = customMsg
    }

    else {
        switch (status) {
            case 404:
                message.error = "Resource Not Found"
                break;
            case 500:
                message.error = "Internal Server Error"
                break;
            case 400:
                message.error = "Invalid Request"
                break;
            case 401:
                message.error = "You are not authorized to make this request"
                break;
            case 403:
                message.error = "Access Forbidden"
                break;
        }
    }

    message.success = false;
    message.status = status;
    return res.status(message.status).json(message);
}