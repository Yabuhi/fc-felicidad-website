// メニューのトグル機能
function toggleMenu() {
  const menuItems = document.getElementById('menuItems');
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (menuItems && menuToggle) {
    menuItems.classList.toggle('active');
    menuToggle.classList.toggle('active');
  }
}

// ギャラリー機能（要素が存在する場合のみ）
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

// ページが完全に読み込まれた後の初期化
document.addEventListener('DOMContentLoaded', function() {
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

  // フィーチャーカードが存在する場合のみ処理を実行
  const featureCards = document.querySelectorAll('.feature-card');
  if (featureCards.length > 0) {
    featureCards.forEach(card => {
      card.addEventListener('click', function() {
        const galleryType = this.getAttribute('data-gallery');
        if (galleryType) {
          openGallery(galleryType + '-gallery');
        }
      });
    });
    console.log('フィーチャーカードが正常に読み込まれました');
  } else {
    console.log('このページにはフィーチャーカードはありません');
  }
  
  // ギャラリーが存在する場合のみイベントリスナーを追加
  const galleries = document.querySelectorAll('.photo-gallery');
  if (galleries.length > 0) {
    // ESCキーでギャラリーを閉じる
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeGallery();
      }
    });
    
    // ギャラリーの背景クリックで閉じる
    galleries.forEach(gallery => {
      gallery.addEventListener('click', function(event) {
        if (event.target === this) {
          closeGallery();
        }
      });
    });
    console.log('ギャラリーが正常に読み込まれました');
  } else {
    console.log('このページにはギャラリーはありません');
  }
});

// ページが完全に読み込まれた後の初期化
window.addEventListener('load', function() {
  console.log('ページが完全に読み込まれました');
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
