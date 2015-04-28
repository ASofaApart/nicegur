
/**
 * API Keys
 */
interface IKeys {
    clientId : string;
    clientSecret : string;
	accessToken : string;
	refreshToken : string;
}

interface ImgurApiResponse<T> {
	data : T[];
	status : number;
	success : boolean;
}

/**
 * An Image coming from the API
 */
interface ImgurImage {
    id : string;
    title : string;
    description : string;
    datetime : number;
    cover : string;
    cover_width : number;
    cover_height : number;
    account_url : string;
    account_id : number;
    privacy : string;
    layout : string;
    views : number;
    link : string;
    is_album : boolean;
    vote : any;
    favorite : boolean;
    nsfw : boolean;
    section : string;
    comment_count : number;
    topic : string;
    topic_id : number;
    images_count : number;
	ups : number;
	downs : number;
	points : number;
}

interface ImgurComment {
	id : number;
	image_id : string;
	comment : string;
	author : string;
	author_id : number;
	on_album : boolean;
	album_cover : any;
	ups : number;
	downs : number;
	points : number;
	datetime : number;
	parent_id : number;
	deleted : boolean;
	vote : any;
	children : ImgurComment[]
}