// themes/your-theme/scripts/custom.js

// 注册一个自定义的 Hexo 标签
hexo.extend.helper.register('myHelper', function() {
	console.log("help!!!!")
	return 'Hello from myHelper!';
  });

  hexo.extend.helper.register('generateSidebar', function () {
	const pages = this.site.pages.filter(page => page.type === 'h3').sort((a, b) => a.order - b.order);
	console.log('generateSidebar')
	console.log(this.site.pages)
	let sidebarHTML = '';
  
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
  