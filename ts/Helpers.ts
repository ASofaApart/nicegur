class Helpers {

	/**
	 * Merges Objects (for settings)
	 * @param settingsArr
	 * @returns {T}
	 */
	public static mergeObjectsShallow<T extends {}>(...settingsArr : T[]){
		var retval : T = <T>{};
		settingsArr.forEach((settings : T) => {
			for(var key in settings){
				retval[key] = settings[key];
			}
		});
		return retval;
	}
}

export = Helpers;