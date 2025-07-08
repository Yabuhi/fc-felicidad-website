// メニュー機能
document.addEventListener('DOMContentLoaded', () => {
  // メニューHTML作成
  const header = document.querySelector('header .container');
  const menuHTML = `
    <div class="nav-menu">
      <button class="menu-toggle" id="menuToggle">
        <span class="menu-icon">☰</span>
        <span class="menu-text">メニュー</span>
      </button>
      <nav class="menu-items" id="menuItems">
        <a href="#home" class="menu-item">ホーム</a>
        <a href="#about" class="menu-item">サークルについて</a>
        <a href="#activities" class="menu-item">活動内容</a>
        <a href="#photos" class="menu-item">写真ギャラリー</a>
        <a href="#chatbot" class="menu-item">大学情報Bot</a>
        <a href="#contact" class="menu-item">お問い合わせ</a>
      </nav>
    </div>
  `;
  
  header.insertAdjacentHTML('afterbegin', menuHTML);
  
  const menuToggle = document.getElementById('menuToggle');
  const menuItems = document.getElementById('menuItems');
  let isMenuOpen = false;
  
  // メニュー開閉
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isMenuOpen) {
      menuItems.classList.remove('active');
      menuToggle.querySelector('.menu-icon').textContent = '☰';
      isMenuOpen = false;
    } else {
      menuItems.classList.add('active');
      menuToggle.querySelector('.menu-icon').textContent = '✕';
      isMenuOpen = true;
    }
  });
  
  // メニューアイテムクリック
  menuItems.addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-item')) {
      e.preventDefault();
      const href = e.target.getAttribute('href');
      
      // メニューを閉じる
      menuItems.classList.remove('active');
      menuToggle.querySelector('.menu-icon').textContent = '☰';
      isMenuOpen = false;
      
      // スクロール
      let element = null;
      switch(href) {
        case '#home': element = document.querySelector('header'); break;
        case '#about': element = document.querySelector('.main-content'); break;
        case '#activities': element = document.querySelector('.features'); break;
        case '#photos': element = document.querySelector('.cta-section'); break;
        case '#chatbot': element = document.querySelector('.chatbot-section'); break;
        case '#contact': element = document.querySelector('.social-links'); break;
      }
      
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  });
  
  // 外部クリックで閉じる
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !menuItems.contains(e.target) && isMenuOpen) {
      menuItems.classList.remove('active');
      menuToggle.querySelector('.menu-icon').textContent = '☰';
      isMenuOpen = false;
    }
  });
  
  // Escapeキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      menuItems.classList.remove('active');
      menuToggle.querySelector('.menu-icon').textContent = '☰';
      isMenuOpen = false;
    }
  });
});
