# DARTSLIVE HOME 301 Web App

家庭用電子ダーツボード「**DARTSLIVE HOME**」とブラウザの **Web Bluetooth API** を介してBLE接続し、クライアント単体で 301 ゲームがプレイできる Web アプリケーションです。

Cloudflare Pages 等の静的ホスティングへ簡単にデプロイして使用できます。

---

## 主な機能

- **DARTSLIVE HOME BLE連携**:
  - Web Bluetooth API 経由でボードとワンクリック接続
  - ダーツ盤のヒット情報（シングル、ダブル、トリプル、インナー/アウターブル）をリアルタイム受信
  - ボードの物理赤ボタン（0x54）でのラウンドチェンジに対応
- **301 ゲームエンジン**:
  - 1人〜4人マルチプレイヤー対応
  - 3投/ラウンド（最大10ラウンド制）
  - Bust 判定（0未満、または残り1点以下の自動巻き戻し）
  - Game Shot 判定（勝利演出＆紙吹雪エフェクト）
  - PPD (Points Per Dart) / PPR (Points Per Round) リアルタイム算出
  - アワード判定（Low Ton, High Ton, Hat Trick, Ton 80, Three in a Bed）
- **ルールカスタマイズ**:
  - Bull 設定: Fat Bull (50/50) / Separate Bull (25/50)
  - Finish ルール: Open Out / Master Out / Double Out
  - 3投後自動チェンジ機能
- **仮想ダーツボード（モックモード）**:
  - 実機がなくても画面上のSVGダーツボードをクリックしてプレイ可能
  - ヒットしたセグメントのリアルタイム発光アニメーション
- **Web Audio API による効果音**:
  - 外部音声アセット不要で完全オフライン・ゼロレイテンシー動作

---

## 動作環境

- **Web Bluetooth API 対応ブラウザ**:
  - Google Chrome (Windows, macOS, Android, ChromeOS)
  - Microsoft Edge (Windows, macOS, Android)
- **注意点**:
  - Web Bluetooth の仕様により、**HTTPS** 環境（または `localhost`）でのみ動作します。
  - iOS Safari は Apple の仕様上 Web Bluetooth に非対応です（iOS環境では画面上の仮想ダーツ盤入力でプレイ可能です）。
  - DARTSLIVE HOME の公式アプリ等と接続中の場合は、先にスマホ側の接続を切断してから本アプリを接続してください。

---

## 開発・ローカル実行

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# テスト実行
npm run test

# 本番ビルド
npm run build
```

---

## Cloudflare Pages へのデプロイ方法

本アプリは完全なクライアントサイド SPA（Single Page Application）としてビルドされるため、Cloudflare Pages にそのままデプロイ可能です。

### 方法1: Gitリポジトリ連携（推奨）
1. GitHub などのリポジトリに本プロジェクトをプッシュします。
2. [Cloudflare ダッシュボード](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git** を選択。
3. 対象リポジトリを選択し、以下のビルド設定を入力します：
   - **Framework preset**: `Vite` (または `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. **Save and Deploy** をクリックすると、自動的に HTTPS 対応の URL（例: `https://xxxx.pages.dev`）が発行されます。

### 方法2: Wrangler CLI によるダイレクトデプロイ
```bash
npm run build
npx wrangler pages deploy dist --project-name=dartslive-301
```
