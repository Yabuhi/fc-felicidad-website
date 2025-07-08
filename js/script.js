// メニュー機能のJavaScript

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
    // メニューのHTML要素を作成
    this.createMenuHTML();
    
    // イベントリスナーを設定
    this.setupEventListeners();
    
    // 初期状態の設定
    this.setupInitialState();
  }

  createMenuHTML() {
    const header = document.querySelector('header .container');
    if (!header) return;

    // メニューHTMLを作成
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

    // 既存のメニューがある場合は削除
    const existingMenu = header.querySelector('.nav-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // 新しいメニューを挿入
    header.insertAdjacentHTML('afterbegin', menuHTML);

    // 要素の参照を取得
    this.menuToggle = document.getElementById('menuToggle');
    this.menuItems = document.getElementById('menuItems');
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
      if (!this.menuToggle.contains(e.target) && !this.menuItems.contains(e.target)) {
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
      this.handleResize();
    });
  }

  setupInitialState() {
    // 初期状態ではメニューを閉じる
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
    
    // アニメーション用のクラスを追加
    this.menuToggle.classList.add('active');
    
    // アクセシビリティ用の属性を設定
    this.menuToggle.setAttribute('aria-expanded', 'true');
    this.menuItems.setAttribute('aria-hidden', 'false');
    
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
    
    // アニメーション用のクラスを削除
    this.menuToggle.classList.remove('active');
    
    // アクセシビリティ用の属性を設定
    this.menuToggle.setAttribute('aria-expanded', 'false');
    this.menuItems.setAttribute('aria-hidden', 'true');
    
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
      const offsetTop = element.offsetTop - 80; // ヘッダーの高さ分を考慮
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  handleResize() {
    // モバイルサイズ以上の場合はメニューを閉じる
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  // セクションの表示/非表示を管理する関数
  showSection(sectionId) {
    // 全てのセクションを非表示
    const sections = document.querySelectorAll('.main-content, .chatbot-section, .members-section');
    sections.forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none';
    });

    // 指定されたセクションを表示
    const targetSection = document.getElementById(sectionId) || document.querySelector(`.${sectionId}`);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.style.display = 'block';
    }
  }

  // 現在のセクションをハイライト表示
  highlightCurrentSection() {
    const sections = [
      { id: 'home', element: document.querySelector('header') },
      { id: 'about', element: document.querySelector('.main-content') },
      { id: 'activities', element: document.querySelector('.features') },
      { id: 'photos', element: document.querySelector('.cta-section') },
      { id: 'chatbot', element: document.querySelector('.chatbot-section') },
      { id: 'contact', element: document.querySelector('.social-links') }
    ];

    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      if (section.element) {
        const menuItem = document.querySelector(`a[href="#${section.id}"]`);
        if (menuItem) {
          const sectionTop = section.element.offsetTop;
          const sectionHeight = section.element.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            menuItem.classList.add('active');
          } else {
            menuItem.classList.remove('active');
          }
        }
      }
    });
  }
}

// 追加のスタイル機能
class MenuStyleManager {
  constructor() {
    this.addMenuStyles();
  }

  addMenuStyles() {
    const styles = `
      <style id="menu-dynamic-styles">
        /* メニューの追加スタイル */
        .menu-toggle {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .menu-toggle::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease;
        }

        .menu-toggle:hover::before {
          width: 100%;
          height: 100%;
        }

        .menu-toggle.active {
          background: rgba(255, 255, 255, 0.25);
        }

        .menu-item {
          position: relative;
          transition: all 0.3s ease;
        }

        .menu-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 0;
          height: 2px;
          background: #667eea;
          transform: translateY(-50%);
          transition: width 0.3s ease;
        }

        .menu-item:hover::before,
        .menu-item.active::before {
          width: 20px;
        }

        .menu-item:hover {
          padding-left: 30px;
          color: #667eea;
        }

        .menu-item.active {
          color: #667eea;
          font-weight: 600;
          padding-left: 30px;
        }

        /* スクロールインジケーター */
        .scroll-indicator {
          position: fixed;
          top: 0;
          left: 0;
          height: 4px;
          background: #667eea;
          z-index: 9999;
          transition: width 0.3s ease;
        }

        /* メニューアニメーション */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .menu-items.active {
          animation: slideIn 0.3s ease forwards;
        }

        .menu-items .menu-item {
          animation: slideIn 0.3s ease forwards;
        }

        .menu-items .menu-item:nth-child(1) { animation-delay: 0.1s; }
        .menu-items .menu-item:nth-child(2) { animation-delay: 0.2s; }
        .menu-items .menu-item:nth-child(3) { animation-delay: 0.3s; }
        .menu-items .menu-item:nth-child(4) { animation-delay: 0.4s; }
        .menu-items .menu-item:nth-child(5) { animation-delay: 0.5s; }
        .menu-items .menu-item:nth-child(6) { animation-delay: 0.6s; }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }
}

// スクロールインジケーター機能
class ScrollIndicator {
  constructor() {
    this.createIndicator();
    this.setupScrollListener();
  }

  createIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.id = 'scrollIndicator';
    document.body.appendChild(indicator);
  }

  setupScrollListener() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / documentHeight) * 100;
      
      const indicator = document.getElementById('scrollIndicator');
      if (indicator) {
        indicator.style.width = scrollPercentage + '%';
      }
    });
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  // メニューマネージャーを初期化
  const menuManager = new MenuManager();
  
  // スタイルマネージャーを初期化
  const styleManager = new MenuStyleManager();
  
  // スクロールインジケーターを初期化
  const scrollIndicator = new ScrollIndicator();
  
  // スクロール時の現在セクションハイライト
  window.addEventListener('scroll', () => {
    menuManager.highlightCurrentSection();
  });
  
  console.log('メニュー機能が初期化されました');
});

// グローバルに利用可能な関数
window.MenuManager = MenuManager;
window.MenuStyleManager = MenuStyleManager;
window.ScrollIndicator = ScrollIndicator;
