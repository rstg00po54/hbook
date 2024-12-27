// menu.js

function renderMenu(pagesData, currentPageTitle) {
	var menuRoot = document.getElementById("menu-root");
	console.log(pagesData)
	// 清空当前菜单内容
	menuRoot.innerHTML = '';
  
	// 渲染菜单
	pagesData.sort((a, b) => a.order - b.order).forEach(function (p) {
	  var listItem = document.createElement("li");
  
	  var link = document.createElement("a");
	  link.href = p.path;  // 如果你已经有了完整路径
	  link.classList.add("sidebar-link");
  
	  // 判断当前页面和是否是新页面
	  if (currentPageTitle === p.title) {
		link.classList.add("current");
	  }
	  if (p.is_new) {
		link.classList.add("new");
	  }
  
	  // 设置链接文本
	  link.textContent = p.title;
	  listItem.appendChild(link);
	  menuRoot.appendChild(listItem);
	});
  }
  
// css-utils.js
function css1(file) {
	console.log("cssx "+file)
    return `<link rel="stylesheet" href="${file}.css">`;
}
module.exports = css1