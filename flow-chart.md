```mermaid
flowchart TD
    %% スタイル定義
    classDef publicStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#000
    classDef authStyle fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#000
    classDef onboardingStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef mainAppStyle fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    classDef modalStyle fill:#fff9c4,stroke:#f9a825,stroke-width:2px,stroke-dasharray:5,color:#000
    classDef devStyle fill:#eceff1,stroke:#607d8b,stroke-width:1px,stroke-dasharray:3,color:#666

    %% パブリックページ
    Landing["🏠 Landing Page
ランディングページ
(/)

・サービス紹介
・パイロット参加案内"]
    
    %% 認証
    Auth["🔐 Authentication
認証ページ
(/auth)

・Magic Link送信
・メールアドレス入力"]
    
    %% オンボーディング
    OnboardingWelcome["👋 Onboarding Welcome
オンボーディング開始
(/app/onboarding)

・サービス説明
・開始ボタン"]
    OnboardingQuiz["📝 Onboarding Quiz
診断クイズ

・性格診断質問
・複数ページ
・進捗表示"]
    OnboardingResult["✅ Onboarding Result
診断結果

・性格タイプ表示
・結果の説明
・ホームへ遷移"]
    
    %% メインアプリケーション
    Home["🏡 Home
ホーム画面
(/app/home)

・チェックイン状況
・今日の気分
・AI介入メッセージ
・チェックインボタン"]
    History["📜 History
履歴画面
(/app/history)

・チェックイン履歴
・気分の推移グラフ
・過去のメッセージ一覧"]
    Settings["⚙️ Settings
設定画面
(/app/settings)

・プロフィール編集
・通知設定
・アカウント管理
・ログアウト"]
    
    %% モーダル・オーバーレイ
    CheckinModal["✓ Check-in Modal
チェックインモーダル
(オーバーレイ)

・気分の入力
・コメント記入
・送信処理"]
    MessageDrawer["💬 Message Detail Drawer
メッセージ詳細ドロワー
(オーバーレイ)

・メッセージ全文表示
・AI介入内容
・タイムスタンプ"]
    
    %% 開発用メニュー
    DevNav["🔧 DevNav Menu
開発用メニュー
(開発環境のみ)

・全画面へのクイックアクセス
・状態リセット
・デバッグ機能"]

    %% フロー定義
    Landing -->|"「パイロット参加に
申し込む」ボタン"| Auth
    Auth -->|"「戻る」リンク"| Landing
    Auth -->|"Magic Link送信完了後
メール内リンクをクリック"| OnboardingWelcome

    %% オンボーディングフロー
    subgraph OnboardingFlow [" 📋 オンボーディングフロー "]
        direction TB
        OnboardingWelcome -->|"「始める」ボタン"| OnboardingQuiz
        OnboardingQuiz -->|"ページ内「次へ」ボタン"| OnboardingQuiz
        OnboardingQuiz -->|"最終ページで「完了」"| OnboardingResult
        OnboardingQuiz -.->|"1ページ目で「戻る」"| OnboardingWelcome
        OnboardingResult -->|"「ホームへ」ボタン"| Home
    end

    OnboardingWelcome -.->|"ヘッダー
「戻る」ボタン"| Auth

    %% メインアプリケーションフロー
    subgraph AppShell [" 📱 メインアプリケーション (認証必須) "]
        direction TB
        Home
        History
        Settings
    end

    %% ボトムナビゲーション
    Home <-->|"ボトムナビ
タップ"| History
    Home <-->|"ボトムナビ
タップ"| Settings
    History <-->|"ボトムナビ
タップ"| Settings
    
    %% ヘッダーナビゲーション
    History -.->|"ヘッダー
「戻る」ボタン"| Home
    Settings -.->|"ヘッダー
「戻る」ボタン"| Home
    Home -.->|"ヘッダー
「設定」アイコン"| Settings
    
    %% モーダル・ドロワー表示
    Home -.->|"「チェックイン」
ボタンタップ"| CheckinModal
    CheckinModal -.->|"送信完了 or
キャンセル"| Home
    
    History -.->|"メッセージカード
タップ"| MessageDrawer
    MessageDrawer -.->|"閉じる or
背景タップ"| History

    %% 認証関連
    Settings -->|"「ログアウト」
実行"| Landing

    %% 開発メニュー
    DevNav -.-|"開発環境"| Landing
    DevNav -.-|"開発環境"| Auth
    DevNav -.-|"開発環境"| OnboardingWelcome
    DevNav -.-|"開発環境"| Home
    DevNav -.-|"開発環境"| History
    DevNav -.-|"開発環境"| Settings

    %% スタイル適用
    class Landing publicStyle
    class Auth authStyle
    class OnboardingWelcome,OnboardingQuiz,OnboardingResult onboardingStyle
    class Home,History,Settings mainAppStyle
    class CheckinModal,MessageDrawer modalStyle
    class DevNav devStyle
