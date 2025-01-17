// themes/your-theme/scripts/generateToc.js

const fs = require('fs');
const path = require('path');
const yamlFront = require('yaml-front-matter');  // 用于读取 front-matter（Hexo的文件头信息）
// const chalk = require('chalk');
const chalk = require('chalk');
const { page } = require('hexo/dist/plugins/helper/is');
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
logWithDetails(allTocData);
console.log(JSON.stringify(allTocData, null, 2))


function log(message) {
	// 创建一个 Error 对象并获取堆栈信息
	const stack = new Error().stack;

	// 解析堆栈信息，提取函数名和行号
	const stackLines = stack.split('\n');
	const callerLine = stackLines[2]; // 堆栈的第二行是调用函数的位置
	// console.log(callerLine)

	// 正则表达式匹配函数名、文件路径、行号和列号
	const match = callerLine.match(/at (\S+) \((.*):(\d+):(\d+)\)/) ||
		callerLine.match(/at (.*):(\d+):(\d+)/);

	// 如果匹配失败，赋予默认值
	let functionName = 'anonymous'; // 默认函数名
	let fileNameWithPath = 'Unknown file';
	let lineNumber = 'Unknown line';
	let columnNumber = 'Unknown column';
	// console.log(match)
	// 如果正则捕获了函数名，则更新
	if (match && match[0].includes('(')) {
		// console.log('has (')
		// at exampleFunction (/mnt/d/n/github/csdn/repo/hbook/themes/themes/my-custom-theme/scripts/helpers.js:96:2)


		functionName = match[1];

		// 如果正则捕获了函数名，则更新

		fileNameWithPath = match[2] || fileNameWithPath;
		lineNumber = match[3] || lineNumber;
		columnNumber = match[4] || columnNumber;

	} else {
		// console.log('has not (')
		// at /mnt/d/n/github/csdn/repo/hbook/themes/themes/my-custom-theme/scripts/helpers.js:152:5

		functionName = 'anonymous';

		fileNameWithPath = match[1] || fileNameWithPath;
		lineNumber = match[2] || lineNumber;
		columnNumber = match[3] || columnNumber;

	}
	// 计算相对路径，这里假设基准路径是项目的根目录（例如process.cwd()或者你的项目根路径）
	//   const basePath = process.cwd(); // 你可以根据需要修改为你项目的根路径
	//   const relativeFilePath = path.relative(basePath, fileNameWithPath);

	// 使用 path.basename 提取文件名，不包括路径
	const relativeFilePath = path.basename(fileNameWithPath);

	// 格式化对齐的长度
	const maxFunctionNameLength = 20;
	const maxFilePathLength = 10;
	const maxMessageLength = 50;

	// 使用padStart/padEnd来对齐输出内容
	const functionColor = chalk.green(functionName.padEnd(maxFunctionNameLength));
	const locationColor = chalk.yellow(`${relativeFilePath.padEnd(maxFilePathLength)}:${lineNumber.padStart(4)}`);
	const messageColor = chalk.blue(message.padEnd(maxMessageLength));

	// 打印带有颜色和对齐的日志
	console.log(`[${functionColor} - ${locationColor}] ${messageColor}`);
}

// 示例函数
function eFunction() {
	log('This is a log message with colors and relative file path');
}

// 调用示例函数
eFunction();


hexo.extend.filter.register('before_generate', function () {
	const postsDir = path.join(hexo.source_dir);  // _posts 目录
	const allToc = [];
	log('+++')
	log('reading......' + postsDir)
	// 获取 _posts 目录下的所有 Markdown 文件
	const files = fs.readdirSync(postsDir);

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
	// console.log(allToc)

	// 将所有文章的目录传递到全局模板
	hexo.locals.set('allToc', allToc);
});
function square(post) {
	log('in square'+post.title)
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

	if (this.page.path != 'title01.html') {
		log('return')
		return ''
	}
	log("congi")
/*
<h1 id="section1">第一部分</h1>
			<h2>书签</h2>
			<ul>
				<li>
					<a href="#section1" class="item0" id="1">项目 1</a>
					<ul class="sub-list">
						<li><a href="#" class="sub-text" id="1.1">子项 1.1</a></li>
						<li><a href="#" class="sub-text" id="1.2">子项 1.2</a></li>
					</ul>
				</li>
			</ul>

*/

	if (allToc && allToc.length > 0) {
		const squret = allToc.map(square)
		log(''+squret[0])
		links += '<ul>\n'
		allToc.forEach(post => {
			// square(post)
			log(post.title)
			log(JSON.stringify(post, null, 2))
			// 为每篇文章生成一个链接
			links += '\t<li>\n'
			links += `\t<a href="${post.url}">${post.title} 0</a>\n`;
			links += '\t<ul>\n'

			// 为文章中的每个标题生成链接
			post.toc.forEach(item => {
				log('level:'+ item.level)
				log(JSON.stringify(item, null, 2))
				links += '\t\t<li>'
				links += `<a href="#${item.id}">${item.text}</a>`;  // 使用 <div> 确保换行
				links += '</li>\n'
			});
			links += '\t</ul>\n'
			links += '\t</li>\n'
		});
		links += '</ul>\n'
	}

	return links;
});
