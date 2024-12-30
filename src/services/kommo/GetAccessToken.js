const GetAccessToken = async (payload = null) => {
  return process.env.ACCESS_TOKEN;
};

module.exports = GetAccessToken;
