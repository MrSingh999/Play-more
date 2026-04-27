class ApiError extends Error {
  constructor(message = 'Somthing went wrong', statusCode, error = [], stack = '') {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.data= null
    this.error = error;
    this.stack = stack;
    this.success = false;
     if(stack){
        this.stack = stack
     }
     Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ApiError
