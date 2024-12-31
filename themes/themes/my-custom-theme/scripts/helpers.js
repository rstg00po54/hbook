// themes/your-theme/scripts/generateToc.js

const fs = require('fs');
const path = require('path');
const yamlFront = require('yaml-front-matter');  // 用于读取 front-matter（Hexo的文件头信息）

hexo.extend.filter.register('before_generate', function () {
	const postsDir = path.join(hexo.source_dir);  // _posts 目录
	const allToc = [];
	console.log('reading......' + postsDir)
	// 获取 _posts 目录下的所有 Markdown 文件
	const files = fs.readdirSync(postsDir);

	files.forEach(file => {
		// 过滤出 Markdown 文件
		if (path.extname(file) === '.md') {
			console.log('reading '+file)
			const filePath = path.join(postsDir, file);
			const content = fs.readFileSync(filePath, 'utf-8');
			const parsed = yamlFront.loadFront(content); // 解析 front-matter 和内容

			// 使用正则表达式提取所有以 `#` 开头的标题
			const toc = [];
			const regex = /^(#{1,6})\s*(.*?)\s*$/gm; // 匹配 `#` 开头的标题
			let match;

			// 遍历匹配到的所有标题
			while ((match = regex.exec(parsed.__content)) !== null) {
				const level = match[1].length; // 标题的级别
				const text = match[2]; // 标题的文本

				console.log(level + "-" + text)
				const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''); // 生成一个符合 ID 格式的字符串

				toc.push({
					level: level,
					text: text,
					id: id,
					link: `<a href="#${id}" class="headerlink" title="${text}">${text}</a>`  // 在 link 中插入文本
				  });
			}

			// 如果当前文章有目录项，将文章标题和目录传递
			if (toc.length > 0) {
				const articleTitle = parsed.title  // 文章标题
				const articleUrl = `${hexo.config.root}${parsed.permalink || file.replace('.md', '.html')}` // 文章链接
				const articleToc = toc // 该文章的标题列表
				allToc.push({
					title: articleTitle,
					url: articleUrl,
					toc: articleToc
					
				  });
				console.log('title:'+articleTitle+', url:'+articleUrl+',toc:'+articleToc)
				console.log("Toc content:", JSON.stringify(toc, null, 2));
			}
		}
	});
	console.log(allToc)

	// 将所有文章的目录传递到全局模板
	hexo.locals.set('allToc', allToc);
});


// 注册一个自定义的 Hexo 标签
hexo.extend.helper.register('generateToc', function () {
	toc = hexo.locals.get('allToc')
	console.log("TOC!!!!")
	console.log(hexo.locals.get('allToc'))
	return "123\n456";
});


hexo.extend.helper.register('generateTocLinks', function () {
	let links = '';
  
	// 获取 allToc 数据
	const allToc = hexo.locals.get('allToc');
  
	if (allToc && allToc.length > 0) {
	  allToc.forEach(post => {
		// 为每篇文章生成一个链接
		links += `<div><a href="${post.url}">${post.title}</a></div>\n`;
  
		// 为文章中的每个标题生成链接
		post.toc.forEach(item => {
		  links += `<div><a href="#${item.id}">${item.text}</a></div>\n`;  // 使用 <div> 确保换行
		});
	  });
	}
  
	return links;
  });
  