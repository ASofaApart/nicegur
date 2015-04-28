import Imgur = require("./Imgur");
import prms = require("es6-promise");
var Promise : any = prms.Promise;

class Nicegur {

	imgur : Imgur = null;

	constructor(settings : INicegurSettings) {
		this.imgur = new Imgur(settings, settings.testflight);
	}

	/**
	 * Flattens comments array:
	 *  - every comment will be pulled to the top layer
	 *  - every comments "child" attribute will be set to null
	 *
	 * @param comments
	 * @returns {ImgurComment[]}
	 */
	private flattenComments(comments : ImgurComment[]) : ImgurComment[] {
		global.log.debug("Nicegur.extractCommentersFromComments");
		var retval : ImgurComment[] = [];
		comments.forEach((comment : ImgurComment) => {
			if (typeof comment.children !== "undefined") {
				retval = retval.concat(this.flattenComments(comment.children));
			}

			comment.children = null;
			retval.push(comment);
		});

		return retval;
	}

	/**
	 * Gets the all commenters of a image
	 * @param image
	 * @returns {Promise<ImgurComment[]>}
	 */
	private getCommentersOfImage(image : ImgurImage) : Promise<ImgurComment[]> {
		return new Promise((resolve : Function, reject : Function) => {
			global.log.debug("Nicegur.getCommentersOfImage", image.id);
			this.imgur.getCommentsOfImage(image.id).then((resp : ImgurApiResponse<ImgurComment>) => {
				resolve(resp.data);
			});
		});
	}

	/**
	 * Selects a random comment from the given image
	 *
	 * @param image
	 * @returns {Promise<ImgurComment>}
	 */
	public getRandomCommentFromImage(image : ImgurImage) : Promise<ImgurComment> {
		return new Promise((resolve : Function, reject : Function) => {
			global.log.debug("Nicegur.getRandomCommenterFromImage", image.id);
			this.getCommentersOfImage(image).then((comments : ImgurComment[]) => {
				comments = this.flattenComments(comments);
				var rand = Math.floor(Math.random() * comments.length);
				global.log.info("Nicegur.getRandomCommenterFromImage", image.id, "selecting", comments[rand].id);

				resolve(comments[rand])
			})
		})
	}

	/**
	 * Selects a random Image from the frontpage
	 * @returns {Promise<ImgurImage>}
	 */
	public getRandomImageFromFrontPage() : Promise<ImgurImage> {
		return new Promise((resolve : Function, reject : Function) => {
			global.log.debug("Nicegur.getRandomImageFromFrontPage");
			this.imgur.getFrontPage().then((resp : ImgurApiResponse<ImgurImage>) => {
				var rand = Math.floor(Math.random() * resp.data.length);
				global.log.info("Nicegur.getRandomImageFromFrontPage", resp.data[rand].id);

				resolve(resp.data[rand]);
			});
		});
	}

}

export = Nicegur;