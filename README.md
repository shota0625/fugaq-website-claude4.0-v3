# フガク株式会社 公式ウェブサイト

> 日本から世界を彩るデジタルマーケティング企業

[![Website](https://img.shields.io/website?url=https%3A//fugaq.com)](https://fugaq.com)
[![License](https://img.shields.io/badge/license-Private-red.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

## 🌟 プロジェクト概要

フガク株式会社の公式ウェブサイトです。葛飾北斎の「富嶽三十六景」をモチーフとした和モダンデザインで、400万人以上の海外ユーザーリーチネットワークを持つデジタルマーケティング企業の価値を表現しています。

### 🎯 主要機能

- **戦略的オンラインプレゼンス**: メディア獲得・JV・取引先開拓を主目的
- **多言語対応**: 日本語・英語完全対応
- **レスポンシブデザイン**: 全デバイス最適化
- **SEO最適化**: 検索エンジン上位表示対策
- **PWA対応**: プログレッシブウェブアプリ機能
- **アクセシビリティ対応**: WCAG 2.1 AAレベル準拠

### 📊 実績ハイライト

- **YouTube**: 250万人登録者
- **Instagram**: 85万人フォロワー
- **TikTok**: 100万人フォロワー
- **Facebook**: 10万人フォロワー
- **総計**: 400万人以上の海外ユーザーリーチ

## 🚀 技術スタック

### フロントエンド
- **HTML5**: セマンティックマークアップ
- **CSS3**: カスタムプロパティ、Grid/Flexbox
- **JavaScript (ES6+)**: バニラJS、モジュール化
- **PWA**: Service Worker、Web App Manifest

### 開発ツール
- **Node.js**: 開発環境管理
- **npm**: パッケージ管理
- **Lighthouse**: パフォーマンス測定
- **ESLint**: コード品質管理
- **Prettier**: コードフォーマット

### デプロイ・運用
- **Apache**: Webサーバー
- **SSL/TLS**: セキュア通信
- **Google Analytics**: アクセス解析
- **Search Console**: SEO管理

## 📁 プロジェクト構造

fugaq-website/ ├── index.html # トップページ ├── company.html # 会社情報 ├── services.html # サービス一覧 ├── portfolio.html # 実績・メディア掲載 ├── news.html # お知らせ ├── ir.html # IR情報 ├── announcement.html # 電子公告 ├── contact.html # お問い合わせ ├── 404.html # エラーページ ├── style.css # メインスタイルシート ├── script.js # メインJavaScript ├── lang.js # 多言語切り替え ├── manifest.json # PWAマニフェスト ├── sitemap.xml # サイトマップ ├── robots.txt # クローラー制御 ├── .htaccess # Apache設定 ├── package.json # npm設定 └── README.md # このファイル

## 🔧 開発環境セットアップ

### 必要要件

- **Node.js**: v16.0.0以上
- **npm**: v8.0.0以上
- **Git**: 最新版

### インストール手順

```bash
# リポジトリのクローン
git clone https://github.com/fugaq/website.git
cd fugaq-website

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start