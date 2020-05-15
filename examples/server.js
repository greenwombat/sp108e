/**
 * A really simple web service to control your led's using the sp108e.
 *
 * Example usage:
 *
 * http://localhost:3000/?on
 * http://localhost:3000/?toggle
 * http://localhost:3000/?brightness=255
 * http://localhost:3000/?color=ffffff&animmode=D3
 * http://localhost:3000/?dreammode=1
 * http://localhost:3000/?animspeed=128
 *
 * It can also we called with natural language which allows it to be called from Google Home using IFTTT:
 *
 * http://localhost:3000/?command=color red
 * http://localhost:3000/?command=color raindow
 * http://localhost:3000/?command=brightness 100
 *
 * NOTE: Update the ip address for your own device
 */
const express = require("express");
const { sp108e } = require("../sp108e");

const app = express();
const port = 3000;

const sp108e_options = {
  host: "192.168.86.124",
  port: 8189,
};

app.get("/", async (req, res) => {
  const p = new sp108e(sp108e_options);
  let responses = [];
  try {
    for (var propName in req.query) {
      if (propName === "command") {
        // coming from google home as a string
        // eg:
        //      "Hey Google, Front lights color red"  would call
        //      "?command=color red"
        responses.push(
          await p.runNaturalLanguageCommand(req.query.command.split(" "))
        );
      } else if (req.query.hasOwnProperty(propName)) {
        // By passing in parameters directly you can change multiple settings at once
        // eg:
        //      "?power=on&color=red&brightness=200"
        responses.push(
          await p.runNaturalLanguageCommand([propName, req.query[propName]])
        );
      }
    }
    res.send({ sp108e: "OK", responses });
  } catch (err) {
    console.log(err);
    responses.push(err);
    res.send({ sp108e: "FAIL", responses });
  }
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
