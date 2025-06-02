/**
 * 多言語切り替え機能
 * フガク株式会社ウェブサイト用
 * 日本語・英語対応
 */

class LanguageSwitcher {
    constructor() {
        this.currentLang = 'ja'; // デフォルト言語
        this.supportedLangs = ['ja', 'en'];
        this.storageKey = 'fugaq_language';
        
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        // ページ読み込み時の言語設定
        this.loadLanguageFromStorage();
        this.checkURLLanguage();
        this.setupEventListeners();
        this.applyLanguage(this.currentLang);
    }

    /**
     * ローカルストレージから言語設定を読み込み
     */
    loadLanguageFromStorage() {
        const savedLang = localStorage.getItem(this.storageKey);
        if (savedLang && this.supportedLangs.includes(savedLang)) {
            this.currentLang = savedLang;
        }
    }

    /**
     * URLパラメータから言語を確認
     */
    checkURLLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && this.supportedLangs.includes(langParam)) {
            this.currentLang = langParam;
            // URLパラメータで指定された場合はストレージにも保存
            this.saveLanguageToStorage();
        }
    }

    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = button.getAttribute('data-lang');
                if (lang && this.supportedLangs.includes(lang)) {
                    this.switchLanguage(lang);
                }
            });
        });

        // ページ遷移時の言語保持
        document.addEventListener('DOMContentLoaded', () => {
            this.updateLanguageButtons();
        });
    }

    /**
     * 言語切り替え
     */
    switchLanguage(lang) {
        if (!this.supportedLangs.includes(lang) || lang === this.currentLang) {
            return;
        }

        this.currentLang = lang;
        this.applyLanguage(lang);
        this.saveLanguageToStorage();
        this.updateLanguageButtons();
        
        // HTMLのlang属性を更新
        document.documentElement.lang = lang;
        
        // Google Analytics等でトラッキングする場合
        this.trackLanguageChange(lang);
    }

    /**
     * 言語をページに適用
     */
    applyLanguage(lang) {
        // data-ja, data-en属性を持つ要素のテキストを切り替え
        this.updateElementTexts(lang);
        
        // プレースホルダーを切り替え
        this.updatePlaceholders(lang);
        
        // フォームのオプションを切り替え
        this.updateSelectOptions(lang);
        
        // その他の言語固有の要素を更新
        this.updateLanguageSpecificElements(lang);
    }

    /**
     * テキスト要素の更新
     */
    updateElementTexts(lang) {
        const elements = document.querySelectorAll(`[data-ja][data-en]`);
        
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                // テキストノードの場合
                if (element.children.length === 0) {
                    element.textContent = text;
                } else {
                    // 子要素がある場合は、最初のテキストノードのみ更新
                    const textNode = Array.from(element.childNodes)
                        .find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
                    if (textNode) {
                        textNode.textContent = text;
                    } else {
                        // テキストノードがない場合は先頭に追加
                        element.insertBefore(document.createTextNode(text), element.firstChild);
                    }
                }
            }
        });
    }

    /**
     * プレースホルダーの更新
     */
    updatePlaceholders(lang) {
        const elements = document.querySelectorAll(`[data-placeholder-ja][data-placeholder-en]`);
        
        elements.forEach(element => {
            const placeholder = element.getAttribute(`data-placeholder-${lang}`);
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });
    }

    /**
     * セレクトボックスのオプション更新
     */
    updateSelectOptions(lang) {
        const selectElements = document.querySelectorAll('select option[data-ja][data-en]');
        
        selectElements.forEach(option => {
            const text = option.getAttribute(`data-${lang}`);
            if (text) {
                option.textContent = text;
            }
        });
    }

    /**
     * その他の言語固有要素の更新
     */
    updateLanguageSpecificElements(lang) {
        // メタデータの更新
        this.updateMetadata(lang);
        
        // 日付フォーマットの更新
        this.updateDateFormats(lang);
        
        // 数値フォーマットの更新
        this.updateNumberFormats(lang);
    }

    /**
     * メタデータの更新
     */
    updateMetadata(lang) {
        // ページタイトルの更新（必要に応じて）
        const titleElement = document.querySelector('title');
        if (titleElement && titleElement.hasAttribute(`data-${lang}`)) {
            titleElement.textContent = titleElement.getAttribute(`data-${lang}`);
        }
        
        // メタディスクリプションの更新
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && metaDesc.hasAttribute(`data-${lang}`)) {
            metaDesc.setAttribute('content', metaDesc.getAttribute(`data-${lang}`));
        }
    }

    /**
     * 日付フォーマットの更新
     */
    updateDateFormats(lang) {
        const dateElements = document.querySelectorAll('.date-format');
        
        dateElements.forEach(element => {
            const dateValue = element.getAttribute('data-date');
            if (dateValue) {
                const date = new Date(dateValue);
                const formattedDate = this.formatDate(date, lang);
                element.textContent = formattedDate;
            }
        });
    }

    /**
     * 数値フォーマットの更新
     */
    updateNumberFormats(lang) {
        const numberElements = document.querySelectorAll('.number-format');
        
        numberElements.forEach(element => {
            const numberValue = element.getAttribute('data-number');
            if (numberValue) {
                const formattedNumber = this.formatNumber(parseFloat(numberValue), lang);
                element.textContent = formattedNumber;
            }
        });
    }

    /**
     * 日付のフォーマット
     */
    formatDate(date, lang) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        const locale = lang === 'ja' ? 'ja-JP' : 'en-US';
        return date.toLocaleDateString(locale, options);
    }

    /**
     * 数値のフォーマット
     */
    formatNumber(number, lang) {
        const locale = lang === 'ja' ? 'ja-JP' : 'en-US';
        return number.toLocaleString(locale);
    }

    /**
     * 言語ボタンの状態更新
     */
    updateLanguageButtons() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            const buttonLang = button.getAttribute('data-lang');
            if (buttonLang === this.currentLang) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    /**
     * ローカルストレージに言語設定を保存
     */
    saveLanguageToStorage() {
        try {
            localStorage.setItem(this.storageKey, this.currentLang);
        } catch (e) {
            console.warn('言語設定の保存に失敗しました:', e);
        }
    }

    /**
     * 言語変更のトラッキング
     */
    trackLanguageChange(lang) {
        // Google Analytics 4の場合
        if (typeof gtag !== 'undefined') {
            gtag('event', 'language_change', {
                'custom_parameter': lang,
                'event_category': 'language',
                'event_label': lang
            });
        }
        
        // その他のアナリティクスツールがある場合はここに追加
        console.log(`言語が${lang}に変更されました`);
    }

    /**
     * 現在の言語を取得
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * サポートされている言語一覧を取得
     */
    getSupportedLanguages() {
        return [...this.supportedLangs];
    }

    /**
     * 特定の要素の言語を手動で更新
     */
    updateElement(element, lang = null) {
        const targetLang = lang || this.currentLang;
        
        if (element.hasAttribute(`data-${targetLang}`)) {
            const text = element.getAttribute(`data-${targetLang}`);
            element.textContent = text;
        }
        
        if (element.hasAttribute(`data-placeholder-${targetLang}`)) {
            const placeholder = element.getAttribute(`data-placeholder-${targetLang}`);
            element.placeholder = placeholder;
        }
    }

    /**
     * 動的に追加された要素に言語を適用
     */
    applyLanguageToDynamicContent(container) {
        if (!container) return;
        
        // 新しく追加されたコンテンツに言語を適用
        const elements = container.querySelectorAll(`[data-ja][data-en]`);
        elements.forEach(element => {
            this.updateElement(element);
        });
        
        const placeholderElements = container.querySelectorAll(`[data-placeholder-ja][data-placeholder-en]`);
        placeholderElements.forEach(element => {
            const placeholder = element.getAttribute(`data-placeholder-${this.currentLang}`);
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });
    }

    /**
     * 言語固有のCSSクラスを適用
     */
    applyLanguageClasses(lang) {
        const body = document.body;
        
        // 既存の言語クラスを削除
        this.supportedLangs.forEach(supportedLang => {
            body.classList.remove(`lang-${supportedLang}`);
        });
        
        // 現在の言語クラスを追加
        body.classList.add(`lang-${lang}`);
    }

    /**
     * フォームバリデーションメッセージの言語切り替え
     */
    updateValidationMessages(lang) {
        const validationMessages = {
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
        
        // カスタムバリデーションメッセージを設定
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            inputs.forEach(input => {
                input.addEventListener('invalid', (e) => {
                    e.target.setCustomValidity('');
                    
                    if (e.target.validity.valueMissing) {
                        e.target.setCustomValidity(validationMessages[lang].required);
                    } else if (e.target.validity.typeMismatch && e.target.type === 'email') {
                        e.target.setCustomValidity(validationMessages[lang].email);
                    }
                });
                
                input.addEventListener('input', (e) => {
                    e.target.setCustomValidity('');
                });
            });
        });
    }
}

// ページ読み込み時に言語切り替え機能を初期化
document.addEventListener('DOMContentLoaded', function() {
    // グローバルに使用できるようにインスタンスを作成
    window.languageSwitcher = new LanguageSwitcher();
    
    // 言語クラスを適用
    window.languageSwitcher.applyLanguageClasses(window.languageSwitcher.getCurrentLanguage());
    
    // フォームバリデーションメッセージを設定
    window.languageSwitcher.updateValidationMessages(window.languageSwitcher.getCurrentLanguage());
});

// 動的コンテンツの言語適用用のヘルパー関数
window.applyLanguageToDynamicContent = function(container) {
    if (window.languageSwitcher) {
        window.languageSwitcher.applyLanguageToDynamicContent(container);
    }
};

// 現在の言語を取得するヘルパー関数
window.getCurrentLanguage = function() {
    return window.languageSwitcher ? window.languageSwitcher.getCurrentLanguage() : 'ja';
};

// 言語を手動で切り替えるヘルパー関数
window.switchLanguage = function(lang) {
    if (window.languageSwitcher) {
        window.languageSwitcher.switchLanguage(lang);
    }
};

// URLの言語パラメータを更新する関数
window.updateURLLanguage = function(lang) {
    const url = new URL(window.location);
    if (lang && lang !== 'ja') {
        url.searchParams.set('lang', lang);
    } else {
        url.searchParams.delete('lang');
    }
    
    // ページをリロードせずにURLを更新
    window.history.replaceState({}, '', url);
};

// エクスポート（モジュール形式で使用する場合）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSwitcher;
}
