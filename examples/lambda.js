/**
 * A really simple lambda to control your led's using the sp108e.
 *
 *    - Expose your sp108e on your router using port forwarding
 *    - Set up lambda in AWS with the Handler set to examples/lambda.handler
 *    - Connect your lambda with API gateway endpoint
 *    - Add lambda environment variables:
 *
 *    HOST=public ip/hostname of your sp108e
 *    PORT=public port of your sp108e (maybe different to sp108e port if you've port forwarded on your router)
 *
 * Example usage:
 *
 * http://apigateway-endpoint/?on
 * http://apigateway-endpoint/?toggle
 * http://apigateway-endpoint/?brightness=255
 * http://apigateway-endpoint/?color=ffffff&animmode=D3
 * http://apigateway-endpoint/?dreammode=1
 * http://apigateway-endpoint/?animspeed=128
 *
 * It can also we called with natural language which allows it to be called from Google Home using IFTTT:
 *
 * http://apigateway-endpoint/?command=color red
 * http://apigateway-endpoint/?command=color raindow
 * http://apigateway-endpoint/?command=brightness 100
 */
const { sp108e } = require("../sp108e");

const sp108e_options = {
  host: process.env.HOST,
  port: process.env.PORT,
};

exports.handler = async function (event, context) {
  const p = new sp108e(sp108e_options);
  const responses = [];
  for (var propName in event.queryStringParameters) {
    if (propName === "command") {
      // coming from google home as a string
      // eg:
      //      "Hey Google, Front lights color red"  would call
      //      "?command=color red"
      responses.push(
        await p.runNaturalLanguageCommand(
          event.queryStringParameters.command.split(" ")
        )
      );
    } else if (event.queryStringParameters.hasOwnProperty(propName)) {
      // By passing in parameters directly you can change multiple settings at once
      // eg:
      //      "?power=on&color=red&brightness=200"
      responses.push(
        await p.runNaturalLanguageCommand([
          propName,
          event.queryStringParameters[propName],
        ])
      );
    }
  }
  return responses;
};
