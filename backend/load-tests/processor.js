// Artillery processor for custom functions
module.exports = {
  setRandomPhone,
  logResponse
};

function setRandomPhone(context, events, done) {
  context.vars.randomPhone = '98765' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return done();
}

function logResponse(requestParams, response, context, ee, next) {
  if (response.statusCode !== 200 && response.statusCode !== 201) {
    console.log('Error response:', response.statusCode, response.body);
  }
  return next();
}
