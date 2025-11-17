const response = (
  statusCode,
  succeed,
  data,
  message,
  res,
  pagination = null
) => {
  res.status(statusCode).json({
    payload: {
      status_code: statusCode,
      success: succeed,
      datas: data,
      message: message,
    },
    pagination: pagination || {
      prev: null,
      next: null,
      max: null,
    },
  });
};

module.exports = { response };
