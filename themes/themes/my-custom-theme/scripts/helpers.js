// themes/your-theme/scripts/generateToc.js

const fs = require('fs');
const path = require('path');
const yamlFront = require('yaml-front-matter');  // 用于读取 front-matter（Hexo的文件头信息）
// const chalk = require('chalk');
const chalk = require('chalk');
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
	const maxFunctionNameLength = 15;
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
				const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''); // 生成一个符合 ID 格式的字符串
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


// 注册一个自定义的 Hexo 标签
hexo.extend.helper.register('generateToc', function () {
	toc = hexo.locals.get('allToc')
	console.log("generateToc")
	console.log(hexo.locals.get('allToc'))

	// 假设 toc 是一个 JSON 对象
	const to = {
		title: "Main Title",
		sections: [
			{ id: 1, name: "Introduction" },
			{ id: 2, name: "Chapter 1" }
		]
	};

	//   printColoredJSON(to);

	return "123\n456";
});


hexo.extend.helper.register('generateTocLinks', function () {
	let links = '';
	console.log("generateTocLinks")
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
