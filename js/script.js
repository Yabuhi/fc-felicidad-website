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

// チャットボット機能の実装
// 既存のjs/script.jsファイルに以下のコードを追加してください

// グローバル変数
let chatbotData = null;
let isLoading = false;

// DOMが読み込まれた後の初期化処理
document.addEventListener('DOMContentLoaded', function() {
  // 既存のコードはそのまま保持
  
  // チャットボット初期化
  initializeChatbot();
});

// チャットボットの初期化
async function initializeChatbot() {
  const statusElement = document.getElementById('status');
  const sendBtn = document.getElementById('sendBtn');
  const userInput = document.getElementById('userInput');
  const loadingElement = document.getElementById('loading');
  
  try {
    // ローディング表示
    showLoading(true);
    showStatus('データを読み込んでいます...', 'info');
    
    // JSONファイルを読み込み
    const response = await fetch('Student_Handbook_2025_Q&A.json');
    if (!response.ok) {
      throw new Error('データファイルの読み込みに失敗しました');
    }
    
    chatbotData = await response.json();
    
    // UI要素を有効化
    if (sendBtn) sendBtn.disabled = false;
    if (userInput) {
      userInput.disabled = false;
      userInput.addEventListener('keypress', handleKeyPress);
    }
    
    // 送信ボタンのイベントリスナーを追加
    if (sendBtn) {
      sendBtn.addEventListener('click', handleSendMessage);
    }
    
    showStatus('チャットボットが利用可能です', 'success');
    setTimeout(() => hideStatus(), 3000);
    
  } catch (error) {
    console.error('チャットボット初期化エラー:', error);
    showStatus('チャットボットの初期化に失敗しました', 'error');
    
    // エラー時もUI要素を有効化（オフライン対応）
    if (sendBtn) sendBtn.disabled = false;
    if (userInput) {
      userInput.disabled = false;
      userInput.addEventListener('keypress', handleKeyPress);
    }
    if (sendBtn) {
      sendBtn.addEventListener('click', handleSendMessage);
    }
  } finally {
    showLoading(false);
  }
}

// Enterキーでメッセージ送信
function handleKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSendMessage();
  }
}

// メッセージ送信処理
async function handleSendMessage() {
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  
  if (!userInput || isLoading) return;
  
  const message = userInput.value.trim();
  if (!message) return;
  
  try {
    // ローディング状態にする
    isLoading = true;
    sendBtn.disabled = true;
    showLoading(true);
    
    // ユーザーメッセージを表示
    addMessage(message, 'user');
    
    // 入力フィールドをクリア
    userInput.value = '';
    
    // 少し待ってからボットの応答を生成
    setTimeout(async () => {
      try {
        const response = await generateResponse(message);
        addMessage(response, 'bot');
      } catch (error) {
        console.error('応答生成エラー:', error);
        addMessage('申し訳ございません。回答の生成中にエラーが発生しました。', 'bot');
      } finally {
        // ローディング状態を解除
        isLoading = false;
        sendBtn.disabled = false;
        showLoading(false);
      }
    }, 500);
    
  } catch (error) {
    console.error('メッセージ送信エラー:', error);
    isLoading = false;
    sendBtn.disabled = false;
    showLoading(false);
  }
}

// メッセージをチャットエリアに追加
function addMessage(text, sender) {
  const chatArea = document.getElementById('chatArea');
  if (!chatArea) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  messageContent.innerHTML = text.replace(/\n/g, '<br>');
  
  messageDiv.appendChild(messageContent);
  chatArea.appendChild(messageDiv);
  
  // 自動スクロール
  chatArea.scrollTop = chatArea.scrollHeight;
}

// 応答生成（簡単な検索ロジック）
async function generateResponse(userMessage) {
  // データが読み込まれていない場合のフォールバック
  if (!chatbotData || !chatbotData.qa_pairs) {
    return "申し訳ございません。現在、システムが利用できません。しばらくしてからお試しください。";
  }
  
  const qaPairs = chatbotData.qa_pairs;
  const userMessageLower = userMessage.toLowerCase();
  
  // 完全一致検索
  for (const pair of qaPairs) {
    if (pair.question.toLowerCase() === userMessageLower) {
      return pair.answer;
    }
  }
  
  // 部分一致検索（キーワードベース）
  let bestMatch = null;
  let maxScore = 0;
  
  for (const pair of qaPairs) {
    const score = calculateSimilarity(userMessageLower, pair.question.toLowerCase());
    if (score > maxScore && score > 0.3) { // 閾値を設定
      maxScore = score;
      bestMatch = pair;
    }
  }
  
  if (bestMatch) {
    return bestMatch.answer;
  }
  
  // マッチしない場合のデフォルト応答
  return `申し訳ございません。「${userMessage}」に関する情報が見つかりませんでした。\n\n以下のような質問をお試しください：\n• 履修登録について\n• 学生証について\n• 図書館の利用について\n• キャンパスライフについて`;
}

// 簡単な類似度計算（キーワードマッチング）
function calculateSimilarity(str1, str2) {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  let matchCount = 0;
  words1.forEach(word1 => {
    if (words2.some(word2 => word2.includes(word1) || word1.includes(word2))) {
      matchCount++;
    }
  });
  
  return matchCount / Math.max(words1.length, words2.length);
}

// ステータス表示
function showStatus(message, type) {
  const statusElement = document.getElementById('status');
  if (!statusElement) return;
  
  statusElement.textContent = message;
  statusElement.className = `status ${type}`;
  statusElement.style.display = 'block';
}

// ステータス非表示
function hideStatus() {
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.style.display = 'none';
  }
}

// ローディング表示制御
function showLoading(show) {
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.style.display = show ? 'block' : 'none';
  }
}

// エラーハンドリング強化
window.addEventListener('error', function(event) {
  console.error('JavaScriptエラーが発生しました:', event.error);
  showStatus('エラーが発生しました', 'error');
});
