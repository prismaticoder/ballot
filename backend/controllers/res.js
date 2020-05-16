exports.sendRes = function(data,status) {
    const message = {};
    message.data = data;
    message.success = true;
    message.status = status;

    return message
};

exports.sendError = function(data,status) {
    const message = {};
    message.message = data;
    message.success = false;
    message.status = status;
    return message;
}