/// <reference path="./_all.d.ts" />

import prms = require("es6-promise");
import request = require("request");

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
					global.log.error("Imgur.ApiCall", err);
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