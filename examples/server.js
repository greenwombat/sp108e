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
const toNumber = require("english2number");
const { sp108e } = require("../sp108e");
const COLOR_MAP = require("../colors.js");
const ANIMATION_MAP = require("../animations.js");

const app = express();
const port = 3000;

const sp108e_options = {
  host: "192.168.86.124",
  port: 8189,
};

runCommand = async (cmd) => {
  console.log("Running command:", cmd);
  const p = new sp108e(sp108e_options);

  if (cmd[0] === "color" || cmd[0] === "colour") {
    const colorname = cmd.slice(1).join("").toLowerCase();
    const hex = COLOR_MAP[colorname];
    if (hex) {
      console.log("Setting color", colorname, hex);
      return await p.setColor(hex);
    }

    const colorAnimation = ANIMATION_MAP[colorname];
    if (colorAnimation) {
      console.log("Setting color", colorname, hex);
      return await p.setDreamMode(colorAnimation);
    }

    if (colorname.length === 6) {
      console.log("Setting color", colorname, hex);
      return await p.setColor(colorname);
    }

    try {
      const patternNumber = parseInt(cmd[1]) || getNumber(colorname);
      return await p.setDreamMode(patternNumber);
    } catch (err) {}

    console.log("Unable to find color", colorname);
  }

  if (cmd[0] === "speed") {
    try {
      const speed = getNumber(cmd[1]);
      return await p.setSpeed(speed);
    } catch (err) {}
  }

  if (cmd[0] === "brightness") {
    try {
      const brightness = parseInt(cmd[1]) || getNumber(colorname);
      return await p.setBrightness(brightness);
    } catch (err) {}
  }

  if (cmd[0] === "toggle" || cmd[0] === "power" || cmd[0] === "turn") {
    if (cmd.length === 1) {
      return await p.toggleOnOff();
    } else if (cmd[1] === "off") {
      return await p.off();
    } else {
      return await p.on();
    }
  }

  if (cmd[0] === "on") {
    return await p.on();
  }

  if (cmd[0] === "off") {
    return await p.off();
  }

  if (cmd[0] === "normal" || cmd[0] === "reset" || cmd[0] === "warm") {
    await p.on();
    await p.setColor("FF6717");
    await p.setBrightness(5);
  }

  if (cmd[0] === "power") {
    try {
      return await p.toggleOnOff();
    } catch (err) {}
  }

  return `Unable to process ${cmd}`;
};

getNumber = (s) => {
  if (s === "to") {
    return 2;
  }
  return toNumber(s);
};

app.get("/", async (req, res) => {
  let responses = [];
  try {
    for (var propName in req.query) {
      if (propName === "command") {
        // coming from google home as a string
        // eg:
        //      "Hey Google, Front lights color red"  would call
        //      "?command=color red"
        responses.push(await runCommand(req.query.command.split(" ")));
      } else if (req.query.hasOwnProperty(propName)) {
        // By passing in parameters directly you can change multiple settings at once
        // eg:
        //      "?power=on&color=red&brightness=200"
        responses.push(await runCommand([propName, req.query[propName]]));
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
