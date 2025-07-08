// メニュー機能のJavaScript（既存のHTMLメニュー構造を使用）

class MenuManager {
  constructor() {
    this.menuToggle = null;
    this.menuItems = null;
    this.isMenuOpen = false;
    
    this.init();
  }

  init() {
    // DOMが読み込まれてから実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupMenu());
    } else {
      this.setupMenu();
    }
  }

  setupMenu() {
    // 既存のメニュー要素を取得
    this.menuToggle = document.querySelector('.menu-toggle');
    this.menuItems = document.querySelector('.menu-items');
    
    // メニューが存在しない場合は作成
    if (!this.menuToggle || !this.menuItems) {
      this.createMenuElements();
    }
    
    // イベントリスナーを設定
    this.setupEventListeners();
    
    // 初期状態の設定
    this.setupInitialState();
  }

  createMenuElements() {
    const header = document.querySelector('header .container');
    if (!header) return;

    // 既存のメニューを削除
    const existingMenu = header.querySelector('.nav-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // メニューHTMLを作成
    const menuHTML = `
      <div class="nav-menu">
        <button class="menu-toggle">
          <span class="menu-icon">☰</span>
          <span class="menu-text">メニュー</span>
        </button>
        <nav class="menu-items">
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
    
    // 要素の参照を再取得
    this.menuToggle = document.querySelector('.menu-toggle');
    this.menuItems = document.querySelector('.menu-items');
  }

  setupEventListeners() {
    if (!this.menuToggle || !this.menuItems) return;

    // メニューボタンのクリックイベント
    this.menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // メニューアイテムのクリックイベント
    this.menuItems.addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-item')) {
        this.handleMenuItemClick(e);
      }
    });

    // 外部クリックでメニューを閉じる
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-menu') && this.isMenuOpen) {
        this.closeMenu();
      }
    });

    // Escapeキーでメニューを閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
      }
    });

    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  setupInitialState() {
    this.closeMenu();
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    if (!this.menuItems) return;

    this.menuItems.classList.add('active');
    this.isMenuOpen = true;
    
    // メニューアイコンの変更
    const menuIcon = this.menuToggle.querySelector('.menu-icon');
    if (menuIcon) {
      menuIcon.textContent = '✕';
    }
  }

  closeMenu() {
    if (!this.menuItems) return;

    this.menuItems.classList.remove('active');
    this.isMenuOpen = false;
    
    // メニューアイコンの変更
    const menuIcon = this.menuToggle.querySelector('.menu-icon');
    if (menuIcon) {
      menuIcon.textContent = '☰';
    }
  }

  handleMenuItemClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    
    // メニューを閉じる
    this.closeMenu();
    
    // スムーズスクロール処理
    this.smoothScrollTo(href);
  }

  smoothScrollTo(target) {
    let element = null;
    
    switch(target) {
      case '#home':
        element = document.querySelector('header');
        break;
      case '#about':
        element = document.querySelector('.main-content');
        break;
      case '#activities':
        element = document.querySelector('.features');
        break;
      case '#photos':
        element = document.querySelector('.cta-section');
        break;
      case '#chatbot':
        element = document.querySelector('.chatbot-section');
        break;
      case '#contact':
        element = document.querySelector('.social-links');
        break;
      default:
        element = document.querySelector(target);
    }

    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  new MenuManager();
});
