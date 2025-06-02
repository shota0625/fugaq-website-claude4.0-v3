/**
 * フガク株式会社ウェブサイト メインJavaScript
 * レスポンシブナビゲーション、アニメーション、フォーム制御等の統合機能
 */

class FugaqWebsite {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.scrollPosition = 0;
        this.isMenuOpen = false;
        this.animatedElements = new Set();
        
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        this.setupEventListeners();
        this.initNavigation();
        this.initScrollAnimations();
        this.initForms();
        this.initSmoothScroll();
        this.checkViewport();
        this.initLazyLoading();
        this.setupAnalytics();
        this.initFAQ(); // Initialize FAQ functionality
    }

    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // ウィンドウリサイズ
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // スクロールイベント
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        // ページ読み込み完了
        document.addEventListener('DOMContentLoaded', () => {
            this.handleDOMReady();
        });

        // ページ離脱前
        window.addEventListener('beforeunload', () => {
            this.handleBeforeUnload();
        });
    }

    /**
     * ナビゲーション機能の初期化
     */
    initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const header = document.querySelector('.header');

        if (navToggle && navMenu) {
            // ハンバーガーメニューのクリック
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });

            // メニューアイテムのクリック（モバイル時）
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (this.isMobile && this.isMenuOpen) {
                        this.closeMobileMenu();
                    }
                });
            });

            // メニュー外クリックで閉じる
            document.addEventListener('click', (e) => {
                if (this.isMenuOpen && 
                    !navMenu.contains(e.target) && 
                    !navToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }

        // ヘッダーの背景変更（スクロール時）
        if (header) {
            this.updateHeaderBackground();
        }
    }

    /**
     * モバイルメニューの開閉
     */
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            document.body.classList.add('menu-open');
            this.isMenuOpen = true;

            // アニメーション
            navMenu.style.opacity = '0';
            navMenu.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                navMenu.style.transition = 'all 0.3s ease';
                navMenu.style.opacity = '1';
                navMenu.style.transform = 'translateY(0)';
            }, 10);
        }
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.style.transition = 'all 0.3s ease';
            navMenu.style.opacity = '0';
            navMenu.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                this.isMenuOpen = false;
                navMenu.style.transition = '';
                navMenu.style.opacity = '';
                navMenu.style.transform = '';
            }, 300);
        }
    }

    /**
     * スクロールアニメーションの初期化
     */
    initScrollAnimations() {
        // Intersection Observer の設定
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, observerOptions);

        // アニメーション対象要素の監視開始
        const animatableElements = document.querySelectorAll(`
            .hero-content,
            .section-title,
            .service-card,
            .feature-card,
            .result-card,
            .category-card,
            .platform-performance,
            .insight-card,
            .content-type-card,
            .timeline-item,
            .info-card
        `);

        animatableElements.forEach(element => {
            this.intersectionObserver.observe(element);
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
        });
    }

    /**
     * 要素のアニメーション実行
     */
    animateElement(element) {
        const delay = Math.random() * 200; // ランダムな遅延で自然な表示
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
    }

    /**
     * フォーム機能の初期化
     */
    initForms() {
        // すべてのフォームを取得
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            this.setupFormValidation(form);
            this.setupFormInteractions(form);
        });

        // 検索フォームの特別処理
        this.initSearchForms();
        
        // フィルター機能の初期化
        this.initFilterFunctions();
    }

    /**
     * フォームバリデーションの設定
     */
    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // リアルタイムバリデーション
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                // エラー状態をクリア
                this.clearFieldError(input);
            });
        });

        // フォーム送信時のバリデーション
        form.addEventListener('submit', (e) => {
            if (!this.validateForm(form)) {
                e.preventDefault();
            }
        });
    }

    /**
     * フィールドバリデーション
     */
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';

        // 必須チェック
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = this.getValidationMessage('required');
        }
        // メールアドレスチェック
        else if (fieldType === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = this.getValidationMessage('email');
        }
        // 電話番号チェック
        else if (fieldType === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = this.getValidationMessage('phone');
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    /**
     * フォーム全体のバリデーション
     */
    validateForm(form) {
        const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isFormValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    /**
     * フィールドエラー表示
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        // 既存のエラーメッセージを削除
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // エラーメッセージを追加
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    /**
     * フィールドエラークリア
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    /**
     * バリデーションメッセージの取得
     */
    getValidationMessage(type) {
        const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'ja';
        const messages = {
            ja: {
                required: 'この項目は必須です',
                email: '有効なメールアドレスを入力してください',
                phone: '有効な電話番号を入力してください'
            },
            en: {
                required: 'This field is required',
                email: 'Please enter a valid email address',
                phone: 'Please enter a valid phone number'
            }
        };

        return messages[currentLang][type] || messages.ja[type];
    }

    /**
     * メールアドレスの妥当性チェック
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * 電話番号の妥当性チェック
     */
    isValidPhone(phone) {
        const phoneRegex = /^[\d\-\(\)\+\s]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    /**
     * 検索フォームの初期化
     */
    initSearchForms() {
        const searchInputs = document.querySelectorAll('.search-input');
        const searchButtons = document.querySelectorAll('.search-btn');

        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(input.value);
                }
            });
        });

        searchButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const input = button.parentNode.querySelector('.search-input');
                if (input) {
                    this.performSearch(input.value);
                }
            });
        });
    }

    /**
     * 検索実行
     */
    performSearch(query) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        // 検索実行のログ
        console.log('検索実行:', trimmedQuery);
        
        // 実際の検索機能は将来実装
        // 現在はコンソールログのみ
        if (window.gtag) {
            gtag('event', 'search', {
                search_term: trimmedQuery
            });
        }
    }

    /**
     * フィルター機能の初期化
     */
    initFilterFunctions() {
        // ニュースページのフィルター
        this.initNewsFilters();
        
        // 電子公告ページのフィルター
        this.initAnnouncementFilters();
    }

    /**
     * ニュースフィルターの初期化
     */
    initNewsFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const clearFiltersBtn = document.getElementById('clearFilters');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // アクティブ状態の切り替え
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const category = button.getAttribute('data-category');
                this.applyNewsFilter(category);
            });
        });

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                filterButtons[0]?.classList.add('active'); // 「すべて」をアクティブに
                this.clearAllFilters();
            });
        }
    }

    /**
     * 電子公告フィルターの初期化
     */
    initAnnouncementFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const periodFilter = document.getElementById('periodFilter');
        const sortOrder = document.getElementById('sortOrder');

        [categoryFilter, periodFilter, sortOrder].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => {
                    this.applyAnnouncementFilters();
                });
            }
        });
    }

    /**
     * スムーススクロールの初期化
     */
    initSmoothScroll() {
        // アンカーリンクのスムーススクロール
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    this.scrollToElement(target);
                }
            });
        });
    }

    /**
     * 要素へのスムーススクロール
     */
    scrollToElement(element, offset = 80) {
        const elementPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    /**
     * ビューポートチェック
     */
    checkViewport() {
        this.isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile', this.isMobile);
        document.body.classList.toggle('desktop', !this.isMobile);
    }

    /**
     * 遅延読み込みの初期化
     */
    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length > 0) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    /**
     * アナリティクスの設定
     */
    setupAnalytics() {
        // ページビューの追跡
        if (window.gtag) {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href
            });
        }

        // クリックイベントの追跡
        this.trackClickEvents();
        
        // フォーム送信の追跡
        this.trackFormSubmissions();
    }

    /**
     * クリックイベントの追跡
     */
    trackClickEvents() {
        // CTAボタンの追跡
        const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .contact-btn');
        ctaButtons.forEach(button => {
            button.addEventListener('click', () => {
                const buttonText = button.textContent.trim();
                this.trackEvent('cta_click', {
                    button_text: buttonText,
                    page_title: document.title
                });
            });
        });

        // 外部リンクの追跡
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        externalLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('external_link_click', {
                    link_url: link.href,
                    link_text: link.textContent.trim()
                });
            });
        });
    }

    /**
     * フォーム送信の追跡
     */
    trackFormSubmissions() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const formId = form.id || 'unknown_form';
                const inquiryType = form.querySelector('[name="inquiryType"]')?.value || 'unknown';
                
                this.trackEvent('form_submission', {
                    form_id: formId,
                    inquiry_type: inquiryType
                });
            });
        });
    }

    /**
     * イベントの追跡
     */
    trackEvent(eventName, parameters = {}) {
        if (window.gtag) {
            gtag('event', eventName, parameters);
        }
        
        // コンソールログ（開発時）
        console.log(`Event tracked: ${eventName}`, parameters);
    }

    /**
     * ウィンドウリサイズ処理
     */
    handleResize() {
        this.checkViewport();
        
        // メニューが開いている場合は閉じる
        if (this.isMenuOpen && !this.isMobile) {
            this.closeMobileMenu();
        }
    }

    /**
     * スクロール処理
     */
    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // ヘッダー背景の更新
        this.updateHeaderBackground();
        
        // スクロール方向の検出
        if (currentScroll > this.scrollPosition) {
            // 下スクロール
            document.body.classList.add('scroll-down');
            document.body.classList.remove('scroll-up');
        } else {
            // 上スクロール
            document.body.classList.add('scroll-up');
            document.body.classList.remove('scroll-down');
        }
        
        this.scrollPosition = currentScroll;
    }

    /**
     * ヘッダー背景の更新
     */
    updateHeaderBackground() {
        const header = document.querySelector('.header');
        if (header) {
            const scrolled = window.pageYOffset > 50;
            header.classList.toggle('scrolled', scrolled);
        }
    }

    /**
     * DOM読み込み完了時の処理
     */
    handleDOMReady() {
        // ページ読み込み完了のアニメーション
        document.body.classList.add('loaded');
        
        // URLハッシュがある場合のスクロール
        if (window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    this.scrollToElement(target);
                }
            }, 100);
        }
    }

    /**
     * ページ離脱前の処理
     */
    handleBeforeUnload() {
        // 必要に応じてデータの保存など
    }

    /**
     * デバウンス関数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * スロットル関数
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * ユーティリティ: 要素が表示されているかチェック
     */
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * ユーティリティ: 要素が部分的に表示されているかチェック
     */
    isElementPartiallyVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * FAQ機能の初期化
     */
    initFAQ() {
        const questions = document.querySelectorAll('.faq-question');

        questions.forEach(question => {
            question.addEventListener('click', () => {
                // Toggle active class on the question itself
                question.classList.toggle('active');

                // Get the corresponding answer element (next sibling)
                const answer = question.nextElementSibling;
                if (answer && answer.classList.contains('faq-answer')) {
                    answer.classList.toggle('active');
                }
            });
        });
    }
}

// AIチャットボット機能（準備段階）
class AIChatBot {
    constructor() {
        this.isEnabled = false; // 将来の実装用
        this.init();
    }

    init() {
        // 将来のAIチャットボット実装用の準備
        console.log('AIチャットボット機能は準備中です');
    }

    // 将来の実装用メソッド
    initChatBot() {
        // チャットボットの初期化
    }

    handleUserMessage(message) {
        // ユーザーメッセージの処理
    }

    displayBotResponse(response) {
        // ボットレスポンスの表示
    }
}

// グローバル変数として利用可能にする
window.fugaqWebsite = null;
window.aiChatBot = null;

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function() {
    window.fugaqWebsite = new FugaqWebsite();
    window.aiChatBot = new AIChatBot();
});

// 他のスクリプトから利用可能なヘルパー関数
window.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

window.showNotification = function(message, type = 'info') {
    // 通知表示機能（将来実装）
    console.log(`Notification (${type}): ${message}`);
};

// エクスポート（モジュール形式で使用する場合）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FugaqWebsite, AIChartBot };
}
