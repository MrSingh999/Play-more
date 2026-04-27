class apiResponse {
  constructor(statusCode, data, message) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

module.exports = apiResponse;
