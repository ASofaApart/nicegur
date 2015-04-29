/// <reference path="./_all.d.ts" />

/**
 * We use bunyan as a global logger
 */
import bunyan = require("bunyan");
global.log = bunyan.createLogger({name : "nicegur", level: "debug"});

/**
 * importing all the modules
 */
import Nicegur = require("./Nicegur");
import Helpers = require("./Helpers");
import fs = require("fs");

/**
 * We parse the settings from two different files: one excluded by git and one not
 */
var settings : INicegurSettings = Helpers.mergeObjectsShallow<INicegurSettings>(
	require("../settings.d.json"),
	require("../settings.json")
);


/**
 * Just a reminder to create a file with the accessToken
 * TODO find a better way of doing this
 */
if(!settings.accessToken && !settings.refreshToken){
	console.log("visit the following url and update accessToken and refreshToken");
	console.log("https://api.imgur.com/oauth2/authorize?response_type=token&client_id=a920bf4e986c497");
}

/**
 * This is where the magic starts: A new Nicegur object (uuuh, shiny)
 */
var nicegur : Nicegur = new Nicegur(settings);


/**
 * Now things are pretty easy:
 *  1. We make go shure, that the user is authorized
 *  2. We select a random image from frontpage
 *  3. We select a random comment from that image
 *  4. We select a random message from the settings file
 *  5. We send the author of that comment that random message
 */
nicegur.authorize().then((keys : IKeys) => {
	var s : IKeys = require("../settings.json");
	s.accessToken = keys.accessToken;
	s.refreshToken = keys.refreshToken;
	s.expires = keys.expires;


	fs.writeFile(__dirname + "/../settings.json", JSON.stringify(s, null, "\t"), (err : any) => {
		if(err){
			global.log.error(err);
			throw err;
		}
	});

	nicegur.getRandomImageFromFrontPage().then((image : ImgurImage) => {
		nicegur.getRandomCommentFromImage(image).then((comment : ImgurComment) => {
			var rand : number = Math.floor(Math.random() * settings.messages.length);
			var message : string = settings.messages[rand];
			nicegur.imgur.sendMessage(comment.author, message);
		})
	});
});
