// Photo Gallery Functions
function openGallery(galleryType) {
  const gallery = document.getElementById(galleryType + '-gallery');
  if (gallery) {
    gallery.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeGallery() {
  const galleries = document.querySelectorAll('.photo-gallery');
  galleries.forEach(gallery => {
    gallery.classList.remove('active');
  });
  document.body.style.overflow = 'auto';
}

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});

// Social links hover effects
document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('mouseenter', () => {
    link.style.transform = 'translateY(-3px) scale(1.05)';
  });
  
  link.addEventListener('mouseleave', () => {
    link.style.transform = 'translateY(0) scale(1)';
  });
});

// Feature card click events
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('click', () => {
    const galleryType = card.getAttribute('data-gallery');
    openGallery(galleryType);
  });
});

// Close gallery on outside click
document.querySelectorAll('.photo-gallery').forEach(gallery => {
  gallery.addEventListener('click', (e) => {
    if (e.target === gallery) {
      closeGallery();
    }
  });
});

// Escape key to close gallery
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeGallery();
  }
});

// Chatbot functionality
// Googleフォーム送信クラス
class GoogleFormSubmitter {
  constructor() {
    this.formId = '1FAIpQLScv6pQhxj5L11h7QsLbr7hB639Rp44KJufgny1JfqZA_4tmuQ';
    this.entryIds = {
      question: 'entry.1080781250',
      timestamp: 'entry.833953602'
    };
    this.baseUrl = `https://docs.google.com/forms/d/e/${this.formId}/formResponse`;
  }

  async submitQuestion(question) {
    try {
      const formData = new FormData();
      formData.append(this.entryIds.question, question);
      formData.append(this.entryIds.timestamp, new Date().toLocaleString('ja-JP'));

      await fetch(this.baseUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      console.log('質問送信完了');
      return { success: true };
    } catch (error) {
      console.error('送信エラー:', error);
      return { success: false, error: error.message };
    }
  }
}

// メインのチャットボットクラス
class FukuchiyamaUniversityChatbot {
  constructor() {
    this.qaData = [];
    this.questions = [];
    this.answers = [];
    this.isInitialized = false;
    this.dataFilePath = "images/Student_Handbook_2025_Q&A.json";
    
    // Googleフォーム送信機能を追加
    this.formSubmitter = new GoogleFormSubmitter();
    
    this.initEventListeners();
    this.loadDataFromFile();
  }

  initEventListeners() {
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');

    sendBtn.addEventListener('click', () => this.handleSendMessage());
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSendMessage();
      }
    });
  }

  async loadDataFromFile() {
    try {
      const response = await fetch(this.dataFilePath);
      if (!response.ok) {
        throw new Error(`ファイルの読み込みに失敗しました: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        this.loadData(data);
        this.showStatus(`✅ ${data.length}件のQ&Aデータを読み込みました`, 'success');
        document.getElementById('userInput').disabled = false;
        document.getElementById('sendBtn').disabled = false;
        this.updateInitialMessage();
        this.isInitialized = true;
      } else {
        throw new Error('データの形式が正しくありません');
      }
    } catch (error) {
      this.showStatus(`❌ データの読み込みに失敗しました: ${error.message}`, 'error');
      this.showDataLoadError();
    }
  }

  updateInitialMessage() {
    const chatArea = document.getElementById('chatArea');
    const firstMessage = chatArea.querySelector('.message-content');
    if (firstMessage) {
      firstMessage.innerHTML = `こんにちは！福知山公立大学についてのご質問をお答えします。<br>
          学生ハンドブックに関することでしたら、お気軽にお尋ねください。<br>
          <small style="color: #666;">📚 ${this.qaData.length}件のQ&Aデータを読み込み済み</small>`;
    }
  }

  loadData(data) {
    this.qaData = data;
    this.questions = data.map(item => item.question);
    this.answers = data.map(item => item.answer);
  }

  showStatus(message, type) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
    statusElement.style.display = 'block';
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 5000);
  }

  showDataLoadError() {
    const chatArea = document.getElementById('chatArea');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'message bot';
    errorMessage.innerHTML = `
      <div class="message-content">
        申し訳ございません。現在、データの読み込みに問題が発生しており、<br>
        質問にお答えできません。<br><br>
        <strong>お問い合わせ方法：</strong><br>
        📧 メール: info@fukuchiyama.ac.jp<br>
        📞 電話: 0773-00-0000<br>
        🏢 窓口: 学生課（平日9:00-17:00）
      </div>
    `;
    chatArea.appendChild(errorMessage);
  }

  handleSendMessage() {
    const userInput = document.getElementById('userInput');
    const query = userInput.value.trim();
    
    if (!query) return;
    
    if (!this.isInitialized) {
      this.showStatus('データの読み込みが完了していません。しばらくお待ちください。', 'error');
      return;
    }

    // Googleフォームに質問を送信
    this.formSubmitter.submitQuestion(query);

    this.addMessage(query, 'user');
    userInput.value = '';
    
    this.showLoading();
    
    setTimeout(() => {
      const response = this.getResponse(query);
      this.hideLoading();
      this.addMessage(response, 'bot');
    }, 1000);
  }

  addMessage(message, sender) {
    const chatArea = document.getElementById('chatArea');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.innerHTML = `<div class="message-content">${message}</div>`;
    chatArea.appendChild(messageElement);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  showLoading() {
    document.getElementById('loading').style.display = 'block';
  }

  hideLoading() {
    document.getElementById('loading').style.display = 'none';
  }

  getResponse(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    // 基本的な挨拶への対応
    if (this.isGreeting(normalizedQuery)) {
      return this.getGreetingResponse();
    }
    
    // 感謝の言葉への対応
    if (this.isThanks(normalizedQuery)) {
      return 'どういたしまして！他にもご質問がございましたら、お気軽にどうぞ。';
    }
    
    // Q&Aデータからの検索
    const bestMatch = this.findBestMatch(normalizedQuery);
    
    if (bestMatch.score > 0.3) {
      return `${bestMatch.answer}<br><br><small style="color: #666;">💡 関連する質問がございましたら、お気軽にお尋ねください。</small>`;
    }
    
    return this.getNoMatchResponse(query);
  }

  isGreeting(query) {
    const greetings = ['こんにちは', 'こんばんは', 'おはよう', 'はじめまして', 'よろしく'];
    return greetings.some(greeting => query.includes(greeting));
  }

  getGreetingResponse() {
    const responses = [
      'こんにちは！福知山公立大学についてのご質問をお答えします。',
      'こんにちは！学生ハンドブックに関することでしたら、何でもお尋ねください。',
      'こんにちは！大学生活についてのご質問をお待ちしております。'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  isThanks(query) {
    const thanks = ['ありがとう', 'ありがとうございます', 'サンキュー', 'おつかれ'];
    return thanks.some(thank => query.includes(thank));
  }

  findBestMatch(query) {
    let bestMatch = { score: 0, answer: '' };
    
    for (let i = 0; i < this.questions.length; i++) {
      const score = this.calculateSimilarity(query, this.questions[i].toLowerCase());
      if (score > bestMatch.score) {
        bestMatch = { score, answer: this.answers[i] };
      }
    }
    
    return bestMatch;
  }

  calculateSimilarity(query, question) {
    const queryWords = query.split(/\s+/);
    const questionWords = question.split(/\s+/);
    
    let matchCount = 0;
    const totalWords = Math.max(queryWords.length, questionWords.length);
    
    for (const queryWord of queryWords) {
      if (queryWord.length > 1) {
        for (const questionWord of questionWords) {
          if (questionWord.includes(queryWord) || queryWord.includes(questionWord)) {
            matchCount++;
            break;
          }
        }
      }
    }
    
    return matchCount / totalWords;
  }

  getNoMatchResponse(originalQuery) {
    const suggestions = [
      'サークル用ロッカーは借りられますか？',
      '新しいサークルや団体を設立するにはどうすればよいですか？',
      'コピー機の設置場所と料金を教えてください。',
      'バイク通学はできますか？',
      '年間の授業の予定を知りたい',
      'メディアセンターの開館時間と休館日を教えてください。'
    ];
    
    const randomSuggestions = suggestions.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    return `申し訳ございません。「${originalQuery}」に関する情報が見つかりませんでした。<br><br>
      <strong>以下のような質問はいかがでしょうか：</strong><br>
      • ${randomSuggestions.join('<br>• ')}<br><br>
      <small style="color: #666;">💡 より具体的な質問をしていただくと、適切な回答ができるかもしれません。</small>`;
  }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
  new FukuchiyamaUniversityChatbot();
});
