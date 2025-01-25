// themes/your-theme/scripts/generateToc.js

const fs = require('fs');
const path = require('path');
const yamlFront = require('yaml-front-matter');  // 用于读取 front-matter（Hexo的文件头信息）
// const chalk = require('chalk');
const chalk = require('chalk');
const { page } = require('hexo/dist/plugins/helper/is');
const log = require('./logger');
const prettier = require('prettier');
const beautify = require('js-beautify').html;
function printColoredJSON(data) {
	// console.log("Input Data:", data);  // 打印输入数据，检查其结构
	const jsonStr = JSON.stringify(data, null, 2);
	// console.log("Formatted JSON:", jsonStr);  // 打印格式化后的 JSON 字符串
	const coloredJson = jsonStr
		.replace(/"([^"]+)":/g, (match, p1) => chalk.blue(`"${p1}":`))
		.replace(/: ("[^"]+")/g, (match, p1) => chalk.green(`: ${p1}`))
		.replace(/: (\d+)/g, (match, p1) => chalk.yellow(`: ${p1}`))
		.replace(/(true|false)/g, (match) => chalk.magenta(match))
		.replace(/null/g, (match) => chalk.gray(match));
	console.log("Colored JSON:", coloredJson);  // 打印彩色输出
	console.log(coloredJson);
}


// 带颜色和缩进的打印函数
function logWithDetails(data) {
	try {
		// 获取当前的调用栈信息
		const stack = new Error().stack.split("\n")[2];
		const regex = /at (\S+) \((.*):(\d+):(\d+)\)/;
		const match = stack.match(regex);

		if (match) {
			const [_, functionName, fileName, lineNumber] = match;
			const fileNameShort = fileName.split('/').pop(); // 获取文件名，不包括路径

			// 打印日志，带颜色，显示函数名和文件行号
			console.log(
				chalk.green(`[${fileNameShort}:${lineNumber}]`),  // 文件名和行号
				chalk.cyan(functionName),  // 函数名
				chalk.yellow('Output:')  // 输出提示
			);
		}
	} catch (err) {
		console.error(chalk.red('Error in logging details:', err));
	}

	// 打印数据，带颜色并格式化为 JSON
	console.log(chalk.blue(JSON.stringify(data, null, 2)));
}

// 示例对象
const allTocData = [{
	title: "Sample Article",
	url: "https://example.com/sample-article",
	toc: [
		{
			level: 1,
			text: "Introduction",
			id: "introduction",
			link: "#introduction"
		},
		{
			level: 2,
			text: "Subsection 1.1",
			id: "subsection-1-1",
			link: "#subsection-1-1"
		},
		{
			level: 2,
			text: "Subsection 1.2",
			id: "subsection-1-2",
			link: "#subsection-1-2"
		}
	]
}];

// 调用函数打印
// logWithDetails(allTocData);
// console.log(JSON.stringify(allTocData, null, 2))



// 示例函数
function eFunction() {
	log('This is a log message with colors and relative file path');
}
const allToc = [];
// 调用示例函数
// eFunction();
function readTitles(file) {
	const content = fs.readFileSync(file, 'utf-8');
	const parsed = yamlFront.loadFront(content); // 解析 front-matter 和内容

	// 使用正则表达式提取所有以 `#` 开头的标题
	const toc = [];
	const regex = /^(#{1,6})\s+(.*?)\s*$/gm; // 匹配 `#` 开头的标题
	let match;
/*
{
  title: '序言',
  url: '/hbook//mnt/d/n/web/hbook/web/src/modern-cpp/zh-cn/00-preface/index.html',
  toc: [
    {
      level: 1,
      text: '序言',
      id: '序言',
      link: '<a href="#序言" class="headerlink" title="序言">序言</a>'
    }
  ]
}
*/
	// 遍历匹配到的所有标题
	while ((match = regex.exec(parsed.__content)) !== null) {
		const level = match[1].length; // 标题的级别
		const text = match[2]; // 标题的文本

		log(level + "-" + text)
		const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, ''); // 生成一个符合 ID 格式的字符串
		const atoc = {
			level: level,
			text: text,
			id: id,
			link: `<a href="#${id}" class="headerlink" title="${text}">${text}</a>`  // 在 link 中插入文本
		};
		if (level > 1){
			toc.push(atoc);
		}
	}
	// 查询url
	const posts = hexo.locals.get('posts'); // 获取文章
	const pages = hexo.locals.get('pages'); // 获取独立页面
  
	// const allFiles = [...posts.toArray(), ...pages.toArray()]; // 合并文章和页面
	const post = posts.findOne({ title: parsed.title });
	const page = pages.findOne({ title: parsed.title });
	let result = post || page; // 如果 post 存在则使用 post，否则使用 page
	if (result) {
		console.log(`Title: ${result.title}`);
		console.log(`Path: ${result.path}`);
		console.log(`root: ${hexo.config.root}`);
		// console.log(`Full URL: ${hexo.config.url}${hexo.config.root}${result.path}`);
	  } else {
		console.log(`No post found with title "${parsed.title}"`);
		pages.forEach(file => {
			log(`Title: ${file.title}`);
			// log(`Path: ${file.path}`);
			if (file.title == parsed.title) {
				log("found!~!!!");
			}
			// log(`root: ${hexo.config.root}`)
			// log(`Full URL: ${hexo.config.url}${hexo.config.root}${file.path}`);
		});
	  }
	// 如果当前文章有目录项，将文章标题和目录传递
	if (toc.length > 0) {
		const articleTitle = parsed.title  // 文章标题
		const articleUrl = `${hexo.config.root}${result.path}` // 文章链接
		const articleToc = toc // 该文章的标题列表
		log("Url:"+articleUrl);
		log("Url:"+hexo.config.root);
		log("Url:"+parsed.permalink );
		// const allTocData: {
		// 	title: any;
		// 	url: string;
		// 	toc: {
		// 		level: number;
		// 		text: string;
		// 		id: string;
		// 		link: string;
		// 	}[];
		// }
		// 创建一个对象变量
		const allTocData = {
			title: articleTitle,
			url: articleUrl,
			toc: articleToc
		};
		allToc.push(allTocData);
		log('-----------------1')
		console.log(allTocData)
		log('-----------------2')
		log("Toc content:", toc);
		log('-----------------3')
		// printColoredJSON(toc)
	}
}

// 递归函数，读取目录下的所有 md 文件
function readMdFiles(dir) {
	// log(dir)
	const files = fs.readdirSync(dir);
	files.forEach(file => {
	  const filePath = path.join(dir, file);
	  const stat = fs.statSync(filePath);
  
	  // 如果是文件夹，递归读取该文件夹
	  if (stat.isDirectory()) {
		readMdFiles(filePath);
	  } else if (stat.isFile() && filePath.endsWith('.md')) {
		// 计算相对路径并打印
		const relativePath = path.relative(hexo.source_dir, filePath);
		// 处理 md 文件
		log('Found markdown file:' + relativePath);

		// allToc.push(filePath);
		readTitles(filePath)
	  }
	});
}
function getAllUrl(){
	const posts = hexo.locals.get('posts'); // 获取文章
	const pages = hexo.locals.get('pages'); // 获取独立页面
  
  
	pages.forEach(file => {
		log(`Title: ${file.title}`);
		log(`Path: ${file.path}`);
		// log(`root: ${hexo.config.root}`)
		// log(`Full URL: ${hexo.config.url}${hexo.config.root}${file.path}`);
	});
}
hexo.extend.filter.register('before_generate', function () {
	const postsDir = path.join(hexo.source_dir);  // _posts 目录

	log('+++')
	log('reading......' + postsDir)

	getAllUrl();

	// 获取 _posts 目录下的所有 Markdown 文件
	const files = fs.readdirSync(postsDir);
	readMdFiles(postsDir);
/*
	files.forEach(file => {
		// 过滤出 Markdown 文件
		if (path.extname(file) === '.md') {
			log('reading ' + file)
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

				log(level + "-" + text)
				const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, ''); // 生成一个符合 ID 格式的字符串
				const atoc = {
					level: level,
					text: text,
					id: id,
					link: `<a href="#${id}" class="headerlink" title="${text}">${text}</a>`  // 在 link 中插入文本
				};
				toc.push(atoc);
			}

			// 如果当前文章有目录项，将文章标题和目录传递
			if (toc.length > 0) {
				const articleTitle = parsed.title  // 文章标题
				const articleUrl = `${hexo.config.root}${parsed.permalink || file.replace('.md', '.html')}` // 文章链接
				const articleToc = toc // 该文章的标题列表
				// const allTocData: {
				// 	title: any;
				// 	url: string;
				// 	toc: {
				// 		level: number;
				// 		text: string;
				// 		id: string;
				// 		link: string;
				// 	}[];
				// }
				// 创建一个对象变量
				const allTocData = {
					title: articleTitle,
					url: articleUrl,
					toc: articleToc
				};
				allToc.push(allTocData);
				log('-----------------1')
				console.log(allTocData)
				log('-----------------2')
				log("Toc content:", toc);
				log('-----------------3')
				// printColoredJSON(toc)
			}
		}
	});
*/
	// console.log(allToc)

	// 将所有文章的目录传递到全局模板
	hexo.locals.set('allToc', allToc);
});
function square(post) {
	// log('in square'+post.title)
	return 'r'
}

hexo.extend.helper.register('generateTocLinks', function () {
	let links = '\n';

	const pageTitle = this.page.title || '默认标题';
	log('----------------')
	log("generateTocLinks")
	log('pageTitle:'+pageTitle)
	log('pagepath:'+this.page.path)
	// 获取 allToc 数据
	const allToc = hexo.locals.get('allToc');


/*

		const allTocData: {
			title: any;
			url: string;
			toc: {
				level: number;
				text: string;
				id: string;
				link: string;
			}[];
}]

	<li>
		<a href="/hbook/modern-cpp/zh-cn/03-runtime/index.html" class="sidebar-link current">
			第 3 章 语言运行期的强化
		</a>
		<ul class="menu-sub">
			<li><a class="section-link active" data-scroll="" href="#3-1-Lambda-表达式">3.1 Lambda 表达式</a></li>
			<ul>
				<li><a class="section-link" data-scroll="" href="#基础">基础</a></li>
				<li><a class="section-link" data-scroll="" href="#泛型-Lambda">泛型 Lambda</a></li>
			</ul>
			<li><a class="section-link" data-scroll="" href="#3-2-函数对象包装器">3.2 函数对象包装器</a></li>
			<ul>
				<li><a class="section-link" data-scroll="" href="#std-function">std::function</a></li>
				<li><a class="section-link" data-scroll="" href="#std-bind-和-std-placeholder">std::bind 和
						std::placeholder</a></li>
			</ul>
			<li><a class="section-link" data-scroll="" href="#3-3-右值引用">3.3 右值引用</a></li>
			<ul>
				<li><a class="section-link" data-scroll="" href="#左值、右值的纯右值、将亡值、右值">左值、右值的纯右值、将亡值、右值</a></li>
				<li><a class="section-link" data-scroll="" href="#右值引用和左值引用">右值引用和左值引用</a></li>
				<li><a class="section-link" data-scroll="" href="#移动语义">移动语义</a></li>
				<li><a class="section-link" data-scroll="" href="#完美转发">完美转发</a></li>
			</ul>
			<li><a class="section-link" data-scroll="" href="#总结">总结</a></li>
			<li><a class="section-link" data-scroll="" href="#进一步阅读的参考文献">进一步阅读的参考文献</a></li>
		</ul>
	</li>
*/
if (allToc && allToc.length > 0) {
    const squret = allToc.map(square);
    // log('' + squret[0]);

    // 使用数组存储构建的 HTML 内容
    const linksArray = [];

	let status = 0
    // 遍历 allToc，处理每篇文章
    allToc.forEach(post => {
		log(JSON.stringify(post, null, 2));
		const folderName = path.basename(path.dirname(post.url));
		linksArray.push("<!-- +++ -->");
        linksArray.push(`<a href="${post.url}" class=\"sidebar-link\">${post.title} ${post.toc.length}</a>`);
		linksArray.push(`<ul class="menu-sub ${folderName}">`);
		lastLevel = 0;
        // 处理每篇文章的 TOC
        post.toc.forEach((item, index) => {
			level = item.level;
			// log("level "+level+" "+item.id);
			log(index +" "+post.toc[index].level);

			if ( status == 0 && level == 3) {
				linksArray.push("<ul>");
				status = 1;
			}
			if( status == 1 && level == 2) {
				linksArray.push("</ul>");
				status = 0;
			}


			if (item.level < 4) {

				const listItem = `<li><a href="#${item.id}" class=\"section-link\" >${item.text}</a></li>`;
				linksArray.push(listItem); // 直接添加一级标题
			}

			lastLevel = level;
           
        });
		linksArray.push("</ul>");
		linksArray.push("<!-- --- -->");
        // 结束当前文章的 TOC 部分
        // linksArray.push('</ul>2');
        // linksArray.push('</li>1');
    });

    // 将所有内容合并为最终的 HTML
    links +=  "<li>\n"+linksArray.join('\n') +"</li>\n";

    // let formattedHtml = beautify(links);
    // log('\n'+formattedHtml);
}
/*
	if (allToc && allToc.length > 0) {
		const squret = allToc.map(square)
		log('' + squret[0])
		links += '<ul>\n'
		allToc.forEach(post => {
			// square(post)
			log(post.title)
			log(JSON.stringify(post, null, 2))
			// 为每篇文章生成一个链接
			links += '<li>\n'
			links += `<a href="${post.url}">${post.title} 0</a>\n`;
			links += '<ul>\n'

			// 为文章中的每个标题生成链接
			post.toc.forEach(item => {
				log('level:' + item.level)
				log(JSON.stringify(item, null, 2))
				links += '<li>'
				links += `<a href="#${item.id}">${item.text} ${item.level}</a>`;  // 使用 <div> 确保换行
				links += '</li>\n'
			});
			links += '</ul>\n'
			links += '</li>\n'
		});
		links += '</ul>\n'
	}
*/
	// return links;
	return beautify(links);
});
