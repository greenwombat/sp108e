/**
 * Porting https://github.com/Lehkeda/SP108E_controller from PHP to JS
 *
 * Please contribute and improve. Its very basic right now!
 */
const net = require("net");
const { PromiseSocket } = require("promise-socket");

const ANIM_MODE_STATIC = "D3";

const WARM_WHITE = "FF6717"; // Matches house lights

const CMD_PREFIX = "38";
const CMD_SUFFIX = "83";
const CMD_TOGGLE = "aa";
const CMD_SET_ANIMATION_MODE = "2c";
const CMD_SET_BRIGHTNESS = "2a"; // Param: 00-FF
const CMD_SET_SPEED = "03"; // Param: 00-FF
const CMD_SET_COLOR = "22"; // RGB: 000000-FFFFFF
const CMD_SET_DREAM_MODE = "2C"; // Param: 1-180

const NO_PARAMETER = "000000";

class sp108e {
  /*
   * @param {Object} options.
   *
   * Example options:
   *
   *  const options = {
   *    host: "192.168.0.124",
   *    port: 8189,
   *  };
   */
  constructor(options) {
    if (!options || !options.host) {
      throw "options are mandatory in the constructor of sp108e";
    }

    this.options = options;
  }

  /**
   * Toggles the led lights on or off
   */
  toggleOnOff = async () => {
    return await this.send(CMD_TOGGLE, undefined, 17);
  };

  /**
   * Sets the brightness of the leds
   * @param {integer} brightness any integer from 0-255
   */
  setBrightness = async (brightness) => {
    return await this.send(CMD_SET_BRIGHTNESS, this.intToHex(brightness), 0);
  };

  /**
   * Sets the color of the leds
   * @param {string} hexColor Hex color without hash. e.g, "FFAABB"
   * @param {string} animMode Animation mode. Use the ANIM_MODE_XXXX constants, otherwise 2 character hex. e.g, "CD". Defaults to ANIM_MODE_STATIC
   */
  setColor = async (hexColor, animMode = exports.ANIM_MODE_STATIC) => {
    await this.send(CMD_SET_COLOR, hexColor, 0);
    return await this.send(CMD_SET_ANIMATION_MODE, animMode);
  };

  /**
   * Sets the speed of the animation
   * @param {integer} speed any integer 0-255
   */
  setAnimationSpeed = async (speed) => {
    return await this.send(CMD_SET_SPEED, this.intToHex(speed), 0);
  };

  /**
   * Sets the dreamcolor animation style (1=rainbow) from 1-180
   * @param {integer} speed any integer 1-180
   */
  setDreamMode = async (mode) => {
    let truncated = Math.min(mode, 180);
    truncated = Math.max(truncated, 1);
    return await this.send(CMD_SET_DREAM_MODE, this.intToHex(mode - 1), 0);
  };

  intToHex = (int) => {
    return int.toString(16).padStart(2, "0");
  };

  send = async (cmd, parameter = NO_PARAMETER, responseLength = 0) => {
    const socket = new net.Socket();
    const client = new PromiseSocket(socket);
    await client.connect(this.options.port, this.options.host);
    console.log("connected to sp108e");
    const hex = CMD_PREFIX + parameter.padEnd(6, "0") + cmd + CMD_SUFFIX;
    const rawHex = Buffer.from(hex, "hex");
    await client.write(rawHex);
    console.log("tx", hex);

    let response = undefined;
    if (responseLength > 0) {
      response = await client.read(responseLength);
      console.log("rx", response.toString("hex"));
    }

    await client.end();
    return response ? response.toString("hex") : null;
  };

  sleep = () => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };
}

exports.sp108e = sp108e;

exports.ANIM_MODE_METEOR = "CD";
exports.ANIM_MODE_BREATHING = "CE";
exports.ANIM_MODE_WAVE = "D1";
exports.ANIM_MODE_CATCHUP = "D4";
exports.ANIM_MODE_STATIC = "D3";
exports.ANIM_MODE_STACK = "CF";
exports.ANIM_MODE_FLASH = "D2";
exports.ANIM_MODE_FLOW = "D0";
