// themes/your-theme/scripts/custom.js

// 注册一个自定义的 Hexo 标签
hexo.extend.helper.register('myHelper', function () {
	// console.log("help!!!!")
	// console.log(this.site.pages)
	// this.site.pages.forEach(page => {
	// 	console.log(`Title: ${page.title}, Path: ${page.path}`);
	// 	page.title = 'pa'
	// 	});
	return 'Hello from myHelper!';
});

hexo.extend.helper.register('generateSidebar', function () {
	const pages = this.site.pages.filter(page => page.type === 'h3').sort((a, b) => a.order - b.order);
	console.log('generateSidebar')
	console.log(this.site.pages)
	let sidebarHTML = '';


	// this.site.pages.forEach(page => {
	// 	console.log(`123 Title: ${page.title}, Path: ${page.path}`);
	// 	});

	pages.forEach(function (p) {
		const isCurrent = this.page.title === p.title ? ' current' : '';
		const isNew = p.is_new ? ' new' : '';
		const url = this.url_for(p.path);
		console.log(p.title)

		sidebarHTML += `
		<li>
		  <a href="${url}" class="sidebar-link${isCurrent}${isNew}">
			${p.title}
		  </a>
		</li>
	  `;
	});

	return sidebarHTML;
});

/*
  _Document {
	title: '第 2 章 zh-cn\\02-usability\\index.md',
	type: 'book-zh-cn',
	order: 2,
	_content: '\n# 第 2 章 语言可用性的强化\n\n\n\n## 2.1 常量\n\n###  nullptr\n\n',
	source: 'modern-cpp/zh-cn/02-usability/index.md',
	raw: '---\n'
	 
	date: Moment<2024-12-30T10:43:55+08:00>,
	updated: Moment<2024-12-30T10:43:55+08:00>,
	path: 'modern-cpp/zh-cn/02-usability/index.html',
	_id: 'cm5affvz70004hfu8f8xe0oyj',
	comments: true,
	layout: 'page',
	content: '<h1 id="第-2-章-语言可用性的强化"><a href="#第-2-章-语言可用性的强化" class="headerlink" title="第 2 章 语言可用性的强化"></a>第 2 章 语言可用性的强化</h1><h2 id="2-1-常量"><a href="#2-1-常量" class="headerlink" title="2.1 常量"></a>2.1 常量</h2><h3 id="nullptr"><a href="#nullptr" class="headerlink" title="nullptr"></a>nullptr</h3>',
	excerpt: '',
	more: '<h1 id="第-2-章-语言可用性的强化"><a href="#第-2-章-语言可用性的强化" class="headerlink" title="第 2 章 语言可用性的强化"></a>第 2 章 语言可用性的强化</h1><h2 id="2-1-常量"><a href="#2-1-常量" class="headerlink" title="2.1 常量"></a>2.1 常量</h2><h3 id="nullptr"><a href="#nullptr" class="headerlink" title="nullptr"></a>nullptr</h3>',
	permalink: [Getter],
	full_source: [Getter],
	__page: true
  }
*/