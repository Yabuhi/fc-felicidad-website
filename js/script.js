// メニューのトグル機能
function toggleMenu() {
  const menuItems = document.getElementById('menuItems');
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (menuItems && menuToggle) {
    menuItems.classList.toggle('active');
    menuToggle.classList.toggle('active');
  }
}

// ギャラリー機能
function openGallery(galleryId) {
  const gallery = document.getElementById(galleryId);
  if (gallery) {
    gallery.classList.add('active');
    document.body.style.overflow = 'hidden'; // スクロールを無効化
  }
}

function closeGallery() {
  const galleries = document.querySelectorAll('.photo-gallery');
  galleries.forEach(gallery => {
    gallery.classList.remove('active');
  });
  document.body.style.overflow = 'auto'; // スクロールを有効化
}

// フィーチャーカードクリック時のギャラリー表示
document.addEventListener('DOMContentLoaded', function() {
  const featureCards = document.querySelectorAll('.feature-card');
  
  featureCards.forEach(card => {
    card.addEventListener('click', function() {
      const galleryType = this.getAttribute('data-gallery');
      if (galleryType) {
        openGallery(galleryType + '-gallery');
      }
    });
  });
  
  // ESCキーでギャラリーを閉じる
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeGallery();
    }
  });
  
  // ギャラリーの背景クリックで閉じる
  const galleries = document.querySelectorAll('.photo-gallery');
  galleries.forEach(gallery => {
    gallery.addEventListener('click', function(event) {
      if (event.target === this) {
        closeGallery();
      }
    });
  });
});

// ページが完全に読み込まれた後の初期化
window.addEventListener('load', function() {
  // メニューボタンが存在するかチェック
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    console.log('メニューボタンが正常に読み込まれました');
  } else {
    console.error('メニューボタンが見つかりません');
  }
  
  // メニューアイテムが存在するかチェック
  const menuItems = document.getElementById('menuItems');
  if (menuItems) {
    console.log('メニューアイテムが正常に読み込まれました');
  } else {
    console.error('メニューアイテムが見つかりません');
  }
});

// レスポンシブ対応：ウィンドウサイズ変更時の処理
window.addEventListener('resize', function() {
  const menuItems = document.getElementById('menuItems');
  const menuToggle = document.querySelector('.menu-toggle');
  
  // デスクトップサイズになったらメニューを表示状態に戻す
  if (window.innerWidth > 768) {
    if (menuItems) {
      menuItems.classList.remove('active');
    }
    if (menuToggle) {
      menuToggle.classList.remove('active');
    }
  }
});

// エラーハンドリング
window.addEventListener('error', function(event) {
  console.error('JavaScriptエラーが発生しました:', event.error);
});
