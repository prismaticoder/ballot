exports.sendRes = function(res,data,status=0) {
    const message = {};
    message.data = data;
    message.success = true;
    message.status = 200 || status;

    return res.status(message.status).json(message);
};

exports.sendError = function(res,status) {
    const message = {};

    switch (status) {
        case 404:
            message.message = "Resource Not Found"
            break;
        case 500:
            message.message = "Internal Server Error"
            break;
        case 400:
            message.message = "Invalid Request"
            break;
        case 401:
            message.message = "You are not authorized to make this request"
            break;
        case 403:
            message.message = "Access Forbidden"
            break;
    }

    message.success = false;
    message.status = status;
    return res.status(message.status).json(message);
}