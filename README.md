NICEGUR
===

A small imgur bot, that sends random nice messages to fellow imgurians


## How to participate

Here it comes: I need you guys: I need more nice messages to send to random users.

If you come up with a nice message, please create a pull request on the settings.d.json file or just send me a Message over on imgur (@ASofaApart)


## How to use nicegur
### What you need

1. nodejs
2. the build process needs the following global node modules: typescript, tsd & gulp


### Building nicegur

1. Make shure the dependencies above are fullfilled
2. run `npm install` to install local npm modules
3. run `gulp build` to compile typescript to javascript


### Setting up nicegur (this is a little complicated at the moment)

1. register a api application
2. create a `settings.json` file, with you clientId and your clientSecrent
3. Generate OAuth tokens for your user (visit `https://api.imgur.com/oauth2/authorize?response_type=token&client_id={{client_id}}`)
4. copy the accessToken and the refreshToken from the redirectURL to ssettings.json


### Running nicegur

Running nicegur is easy: It will send a random message to a random imgurian every time `js/index.js` is executed.

You probably want to execute nicegur in an interval, so you may want to have a cronjob for that. Here is mine:

```bash
 0  */8  *   *   *    /usr/bin/node /home/pi/nicegur/js/index.js
```