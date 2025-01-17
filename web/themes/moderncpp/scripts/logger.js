const path = require('path');
const chalk = require('chalk');


function log(message) {
	// 创建一个 Error 对象并获取堆栈信息
	const stack = new Error().stack;

	// 解析堆栈信息，提取函数名和行号
	const stackLines = stack.split('\n');
	const callerLine = stackLines[2]; // 堆栈的第二行是调用函数的位置
	// console.log(stackLines)

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

module.exports = log; 