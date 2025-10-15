
'''mermaid
flowchart TD
    %% スタイル定義
    classDef publicStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#000
    classDef authStyle fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#000
    classDef onboardingStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef mainAppStyle fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    classDef modalStyle fill:#fff9c4,stroke:#f9a825,stroke-width:2px,stroke-dasharray:5,color:#000
    classDef devStyle fill:#eceff1,stroke:#607d8b,stroke-width:1px,stroke-dasharray:3,color:#666

    %% パブリックページ
    Landing["🏠 Landing Page<br/>ランディングページ<br/><small>(/)</small><br/><br/>・サービス紹介<br/>・パイロット参加案内"]
    
    %% 認証
    Auth["🔐 Authentication<br/>認証ページ<br/><small>(/auth)</small><br/><br/>・Magic Link送信<br/>・メールアドレス入力"]
    
    %% オンボーディング
    OnboardingWelcome["👋 Onboarding Welcome<br/>オンボーディング開始<br/><small>(/app/onboarding)</small><br/><br/>・サービス説明<br/>・開始ボタン"]
    OnboardingQuiz["📝 Onboarding Quiz<br/>診断クイズ<br/><br/>・性格診断質問<br/>・複数ページ<br/>・進捗表示"]
    OnboardingResult["✅ Onboarding Result<br/>診断結果<br/><br/>・性格タイプ表示<br/>・結果の説明<br/>・ホームへ遷移"]
    
    %% メインアプリケーション
    Home["🏡 Home<br/>ホーム画面<br/><small>(/app/home)</small><br/><br/>・チェックイン状況<br/>・今日の気分<br/>・AI介入メッセージ<br/>・チェックインボタン"]
    History["📜 History<br/>履歴画面<br/><small>(/app/history)</small><br/><br/>・チェックイン履歴<br/>・気分の推移グラフ<br/>・過去のメッセージ一覧"]
    Settings["⚙️ Settings<br/>設定画面<br/><small>(/app/settings)</small><br/><br/>・プロフィール編集<br/>・通知設定<br/>・アカウント管理<br/>・ログアウト"]
    
    %% モーダル・オーバーレイ
    CheckinModal["✓ Check-in Modal<br/>チェックインモーダル<br/><small>(オーバーレイ)</small><br/><br/>・気分の入力<br/>・コメント記入<br/>・送信処理"]
    MessageDrawer["💬 Message Detail Drawer<br/>メッセージ詳細ドロワー<br/><small>(オーバーレイ)</small><br/><br/>・メッセージ全文表示<br/>・AI介入内容<br/>・タイムスタンプ"]
    
    %% 開発用メニュー
    DevNav["🔧 DevNav Menu<br/>開発用メニュー<br/><small>(開発環境のみ)</small><br/><br/>・全画面へのクイックアクセス<br/>・状態リセット<br/>・デバッグ機能"]

    %% ===================
    %% フロー定義
    %% ===================
    
    %% 初期フロー
    Landing -->|"「パイロット参加に<br/>申し込む」ボタン"| Auth
    Auth -->|"「戻る」リンク"| Landing
    Auth -->|"Magic Link送信完了後<br/>メール内リンクをクリック"| OnboardingWelcome

    %% オンボーディングフロー
    subgraph OnboardingFlow [" 📋 オンボーディングフロー "]
        direction TB
        OnboardingWelcome -->|"「始める」ボタン"| OnboardingQuiz
        OnboardingQuiz -->|"ページ内「次へ」ボタン"| OnboardingQuiz
        OnboardingQuiz -->|"最終ページで「完了」"| OnboardingResult
        OnboardingQuiz -.->|"1ページ目で「戻る」"| OnboardingWelcome
        OnboardingResult -->|"「ホームへ」ボタン"| Home
    end

    %% オンボーディングからの戻り
    OnboardingWelcome -.->|"ヘッダー<br/>「戻る」ボタン"| Auth

    %% メインアプリケーションフロー
    subgraph AppShell [" 📱 メインアプリケーション (認証必須) "]
        direction TB
        Home
        History
        Settings
    end

    %% ボトムナビゲーション(双方向)
    Home <-->|"ボトムナビ<br/>タップ"| History
    Home <-->|"ボトムナビ<br/>タップ"| Settings
    History <-->|"ボトムナビ<br/>タップ"| Settings
    
    %% ヘッダーナビゲーション(片方向)
    History -.->|"ヘッダー<br/>「戻る」ボタン"| Home
    Settings -.->|"ヘッダー<br/>「戻る」ボタン"| Home
    Home -.->|"ヘッダー<br/>「設定」アイコン"| Settings
    
    %% モーダル・ドロワー表示
    Home -.->|"「チェックイン」<br/>ボタンタップ"| CheckinModal
    CheckinModal -.->|"送信完了 or<br/>キャンセル"| Home
    
    History -.->|"メッセージカード<br/>タップ"| MessageDrawer
    MessageDrawer -.->|"閉じる or<br/>背景タップ"| History

    %% 認証関連
    Settings -->|"「ログアウト」<br/>実行"| Landing

    %% 開発メニュー(全画面に接続)
    DevNav -.-|"開発環境"| Landing
    DevNav -.-|"開発環境"| Auth
    DevNav -.-|"開発環境"| OnboardingWelcome
    DevNav -.-|"開発環境"| Home
    DevNav -.-|"開発環境"| History
    DevNav -.-|"開発環境"| Settings

    %% ===================
    %% スタイル適用
    %% ===================
    class Landing publicStyle
    class Auth authStyle
    class OnboardingWelcome,OnboardingQuiz,OnboardingResult onboardingStyle
    class Home,History,Settings mainAppStyle
    class CheckinModal,MessageDrawer modalStyle
    class DevNav devStyle

    %% ===================
    %% 補足説明
    %% ===================
    classDef noteStyle fill:#fff,stroke:#999,stroke-width:1px,stroke-dasharray:3,color:#666
    
    Note1["📌 認証状態管理<br/>・未認証: Landing, Auth のみアクセス可<br/>・認証済: /app/* にアクセス可<br/>・オンボーディング未完了: /app/onboarding へリダイレクト"]
    Note2["📌 データフロー<br/>・チェックイン → Supabase保存 → AI分析<br/>・履歴 → Supabase取得 → グラフ表示<br/>・設定 → Supabase Auth連携"]
    Note3["📌 通知機能<br/>・定時チェックインリマインダー<br/>・AI介入メッセージ通知<br/>・設定画面で制御可能"]
    
    class Note1,Note2,Note3 noteStyle
    '''
