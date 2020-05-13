/**
 * A really simple web service to control your led's using the sp108e.
 *
 * Example usage:
 *
 * http://localhost:3000/?toggle
 * http://localhost:3000/?brightness=255
 * http://localhost:3000/?color=ffffff&animmode=D3
 * http://localhost:3000/?dreammode=1
 * http://localhost:3000/?animspeed=128
 *
 * Update the ip address for your own device
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
  try {
    const p = new sp108e(sp108e_options);

    let responses = [];
    if (req.query.toggle !== undefined) {
      responses.push(await p.toggleOnOff());
    }
    if (req.query.color) {
      responses.push(await p.setColor(req.query.color, req.query.animmode));
    }
    if (req.query.dreammode) {
      responses.push(await p.setDreamMode(parseInt(req.query.dreammode)));
    }
    if (req.query.brightness) {
      responses.push(await p.setBrightness(parseInt(req.query.brightness)));
    }
    if (req.query.animspeed) {
      responses.push(await p.setAnimationSpeed(parseInt(req.query.animspeed)));
    }
    res.send({ sp108e: "OK", responses });
  } catch (err) {
    responses.push(err);
    res.send({ sp108e: "FAIL", responses });
  }
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
