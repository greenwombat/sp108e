/**
 * Some basic examples for controlling your led's using the sp108e.
 *
 * Update the ip address for your own device
 */
const { sp108e, ANIM_MODE_FLOW, ANIM_MODE_STATIC } = require("../sp108e");

const sp108e_options = {
  host: "192.168.0.114",
  port: 8189,
};

const test = async () => {
  const p = new sp108e(sp108e_options);

  //await p.toggleOnOff();
  //await p.setColor("ffffff");
  //await p.setAnimationMode(ANIM_MODE_FLOW);
  //await p.setAnimationSpeed(255);
  //await p.setDreamMode(1);
  //await p.setColor("FF6717", ANIM_MODE_STATIC);
  //await p.setBrightness(255);
  console.log("Status", await p.getStatus());
};

test();
