exports.responseJson = (res, code, message, data, objName = "data") => {
  return res.status(code).json({
    [objName]: data,
    message: message
  });
};
