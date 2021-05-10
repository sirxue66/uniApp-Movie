const serverUrl = (route, arr) => {
	let url = "https://www.imovietrailer.com/superhero/" + route + "?qq=1134701187"
	if (arr && arr.length) {
		arr.forEach(item => {
			url += "&" + item
		})
	}
	return url
}


export default{
	serverUrl,
}