# sp108e Javascript Library

## What is this?

This is a Javascript library to control SP108E Wi-Fi controller.

There is also a very basic example Node Express Web Server that will get you up and running really quickly controlling your sp108e LED light strips from a browser or from Google Home / Google Assistant using IFTTT.

## Let's make this clear!

This is the version 1 of the library so the code
isn't pretty, but it's not a big deal, for V1 - Just be mindful and empathetic
that I haven't spent much time on this!

## Why Javascript?

I'll be really honest here: I haven't invented anything new here. All the hard work was done by the
awesome [Lehkeda](https://github.com/Lehkeda) who reverse-engineered the sp108e device and wrote a [PHP Library](https://github.com/Lehkeda/SP108E_controller) for it. But I'm a NodeJS person so I have ported across the bits that I need. That is all.

There are lots more interesting pieces in the PHP api, like auto-detecting the device on the network so if
anyone would like to extend what I've done here - Please go crazy!

## How does the API communicate with the sp108e?

I won't go into detail here since it is really well described at https://github.com/Lehkeda/SP108E_controller

### API Usage

`npm install sp108e`

```javascript
const { sp108e, ANIM_MODE_FLOW, ANIM_MODE_STATIC } = require("sp108e");

const sp108e_options = {
  host: "192.168.86.124",
  port: 8189,
};

const test = async () => {
  const p = new sp108e(sp108e_options);

  // If making sequential calls you should use 'await' to wait for each command to finsh
  // or you will confuse the controller. Look in `sp108e.js` for all available commands!
  await p.on();
  await p.toggleOnOff();
  await p.setColor("ffffff");
  await p.setAnimationMode(ANIM_MODE_FLOW);
  await p.setAnimationSpeed(255);
  await p.setDreamMode(1);
  await p.setColor("FF6717", ANIM_MODE_STATIC);
  await p.setBrightness(255);
};

test();
```

## Developing

`$ npm install`

Update `examples/example.js` with your hostname. The port should be correct

`$ npm run example`

### Running example web server

Update `examples/service.js` with your hostname. The port should be correct.

`$ npm run server // or npm run hotserver for hot reloading on code changes`

The sever will run on localhost and you can manage your leds with simple GET requests:

- http://localhost:3000/?toggle
- http://localhost:3000/?brightness=255
- http://localhost:3000/?color=ffffff&animmode=D3
- http://localhost:3000/?dreammode=1
- http://localhost:3000/?animspeed=128

### Using sp108e with Google Home / Google Assistant

The web server has been written so that it can be called with natural language allowing it to be used with Google Assistant using IFTTT:

- http://localhost:3000/?command=color red
- http://localhost:3000/?command=color rainbow
- http://localhost:3000/?command=brightness 100
- http://localhost:3000/?command=on

My IFTTT configutaion looks like this:

```
If You say "set front lights $", then Make a web request

What do you want to say? set front lights $
What do you want the Assistant to say in response? no problem, setting front lights $
URL: http://mydomain:3000/?command={{TextField}}
Method: GET
ContentType: text/plain
```

## Contributing

This is a very first attempt - v1 - of an sp108e node library. There is lots more that could be done (even if just porting missing functionality from https://github.com/Lehkeda/SP108E_controller). I'm very happy to get Pull Requests!
