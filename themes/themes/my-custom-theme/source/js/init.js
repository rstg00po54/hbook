(function () {
	var each = [].forEach

	console.log("init0")
	// const pages = this.site.pages.filter(page => page.type === 'h1').sort((a, b) => a.order - b.order);
	console.log('generateSidebar')
	var content = document.querySelectorAll('h1')
	// console.log(content)
	// console.log(content.outerHTML)
	each.call(content, function (h) {
		console.log("title h1"+h.outerHTML)
	})
})()