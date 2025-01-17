// themes/your-theme/scripts/custom.js
const path = require('path');
const log = require('./logger');


pagec = 100
// 注册一个自定义的 Hexo 标签
hexo.extend.helper.register('SidebarHelper', function (type, page) {
	console.log('SidebarHelper ============================' + pagec)
	pagec = pagec+1
	this.site.pages.forEach(function (p) {
		if (pagec == 10) {
			console.log("p")
			console.log("title", p.title);
			console.log("type", p.type);
			console.log("type", p.source);
			console.log("type", type);
			console.log("page")
			console.log("title", page.title);
			console.log("title", page.source);
			console.log("--------------------------");
		}

	})
	log("title", page.title);
	// const pagetype = this.site.pages.filter(page => page.type === type)
	log("the current ", page.source);
	log("the current ", page.source.split('/')[0]);
	const pagetype = this.site.pages.filter(p => {
		// console.log(p.source)
		if(page.source.split("/")[0] === p.source.split("/")[0]) {
			// console.log(p.source, "is in");
			return true
		}
		return false
	})


	const pagesort = pagetype.sort((a, b) => (a.order || 0) - (b.order || 0)); // 按 order 排序
		// const html = ''
	// 生成 HTML
	const html = pagesort.map(p => {
			const isCurrent = p.title === page.title;
			const isNew = page.is_new;
			const classes = [
				'sidebar-link',
				isCurrent ? 'current' : '',
				isNew ? 'new' : ''
			]
				.filter(Boolean)
				.join(' ');
			if(isCurrent){
				log("is  Current "+isCurrent+":"+p.source)
			}

			return `
		<li>
		  <a href="${this.url_for(p.path)}" class="${classes}">
			${p.title}
		  </a>
		</li>`;
	}).join('\n');
	console.log('SidebarHelper --' + pagec)
	log(html)
	return html;
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