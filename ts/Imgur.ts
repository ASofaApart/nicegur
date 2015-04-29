/// <reference path="./_all.d.ts" />

import prms = require("es6-promise");
import request = require("request");
import readline = require("readline");
import url = require("url");

var Promise : any = prms.Promise;


class Imgur {

	private keys : IKeys = null;
	private testflight : boolean = true;

	constructor(keys : IKeys, testflight = true) {
		this.keys = keys;
		this.testflight = testflight;
	}

	/**
	 * Makes (get) API Call
	 */
	private ApiCall(url) : Promise<any> {
		return new Promise((resolve : Function, reject : Function) => {
			global.log.debug("Imgur.ApiCall", url);
			request.get({
				url: url,
				headers: {
					Authorization: "Bearer " + this.keys.accessToken
				}
			}, (err : any, resp : any, body : any) => {
				if (!err && resp.statusCode === 200) {
					resolve(JSON.parse(body));
				} else {
					global.log.error("Imgur.ApiCall", err, body);
					reject(err);
				}
			});
		});
	}

	/**
	 * Gets the current front page images
	 */
	public getFrontPage() : Promise<ImgurApiResponse<ImgurImage>> {
		global.log.debug("imgur.getFrontPage");
		var url : string = "https://api.imgur.com/3/gallery/hot/viral/0.json";
		return this.ApiCall(url);
	}

	/**
	 * Gets the comments of a certain image
	 */
	public getCommentsOfImage(imgid : string) : Promise<ImgurApiResponse<ImgurComment>> {
		global.log.debug("imgur.getCommentsOfImage");
		var url : string = "https://api.imgur.com/3/gallery/"+imgid+"/comments/";
		return this.ApiCall(url);
	}

	public refreshTokens() : Promise<IKeys> {
		return new Promise((resolve : Function, reject : Function) => {
			global.log.debug("Imgur.refreshTokens");
			request.post({
				url: "https://api.imgur.com/oauth2/token",
				form: {
					client_id: this.keys.clientId,
					client_secret: this.keys.clientSecret,
					refresh_token: this.keys.refreshToken,
					grant_type: "refresh_token"
				},
			}, (err, resp, body) => {
				console.log(err);
				//console.log(resp);
				console.log(body);
				if(!err && resp.statusCode === 200){
					var data : ImgurTokenReply = JSON.parse(body);
					this.keys.accessToken = data.access_token;
					this.keys.refreshToken = data.refresh_token;
					this.keys.expires = Date.now() + data.expires_in * 1000;
					global.log.debug("Imgur.refreshTokens", "success");
					resolve(this.keys);
				} else {
					global.log.error("Imgur.refreshTokens", err, body);
				}
			})
		});
	}

	public registerUser() : Promise<IKeys> {
		return new Promise((resolve : Function, reject : Function) => {

			global.log.debug("Imgur.registerUser");

			var rl : readline.ReadLine = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});

			console.log("open the following URL in your browser and grant access");
			console.log("https://api.imgur.com/oauth2/authorize?response_type=token&client_id=" + this.keys.clientId);
			console.log("When you're done, paste the URL you are redirected to here");

			rl.question("When you're done, paste the URL you are redirected to here", (urlstring : string) => {
				urlstring = urlstring.replace("#","?"); //this is done, so that the url parser has an easier time
				var urlobj : url.Url = url.parse(urlstring, true);

				this.keys.accessToken = urlobj.query.access_token;
				this.keys.refreshToken = urlobj.query.refresh_token;
				this.keys.expires = Date.now() + parseInt(urlobj.query.expires_in) * 1000;

				resolve(this.keys);
			});
		});
	}

	/**
	 * Sends a message to someone
	 */
	public sendMessage(to : string, body : string) : void {
		global.log.info("sending message to ",to,"---", body);

		if(this.testflight){
			global.log.info("not sending message, cause testflight is activated");
			return;
		}

		request.post({
			url: "https://api.imgur.com/3/conversations/" + to,
			headers: {
				Authorization: "Bearer " + this.keys.accessToken,
				'content-type' : 'application/x-www-form-urlencoded'
			},
			body: "body="+body
		}, (err, resp, body) => {
			global.log.debug(err);
			global.log.debug(body);
		})
	}

}

export = Imgur;