document.addEventListener('DOMContentLoaded', function() {
  // 获取所有导航栏下拉菜单
  const navDropdowns = document.querySelectorAll('.nav-dropdown');

  // 遍历每个下拉菜单，并为其添加鼠标悬停和离开事件监听器
  navDropdowns.forEach(dropdown => {
    const navTitle = dropdown.previousElementSibling;
    let timeoutId;

    // 鼠标悬停时显示下拉菜单
    navTitle.addEventListener('mouseover', () => {
      clearTimeout(timeoutId);
      dropdown.style.display = 'block';
    });

    // 鼠标离开时延迟隐藏下拉菜单
    navTitle.addEventListener('mouseleave', () => {
      timeoutId = setTimeout(() => {
        dropdown.style.display = 'none';
      }, 200);
    });

    // 鼠标悬停在下拉菜单上时取消隐藏计时
    dropdown.addEventListener('mouseover', () => {
      clearTimeout(timeoutId);
    });

    // 鼠标离开下拉菜单时延迟隐藏下拉菜单
    dropdown.addEventListener('mouseleave', () => {
      timeoutId = setTimeout(() => {
        dropdown.style.display = 'none';
      }, 200);
    });
  });

  // 获取搜索按钮和输入框
  const searchButton = document.querySelector('.search-button');
  const searchInput = document.querySelector('.search-box input[type="text"]');

  // 添加搜索按钮点击事件监听器
  searchButton.addEventListener('click', () => {
    // 获取搜索关键词
    const keyword = searchInput.value;
    // 执行搜索操作，根据需求自行编写相关代码
    console.log('执行搜索操作，关键词：', keyword);
  });
});
