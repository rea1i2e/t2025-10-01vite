export const siteConfig = {
  /**
   * 共通設定（案件によらず変更しないもの）
   */

  // パス設定
  ejsPath: "./ejs/", // ルート相対パスで書くと、ズレる（システムルートの解釈）
  imagePath: "/assets/images/",


  /**
   * プロジェクト設定（案件固有のもの）
   */
  // サイト基本情報
  siteName: "静的サイト用ejsテンプレ",
  domain: "https://rea1i2e.net/",
  titleSeparator: " | ",
  headerExcludePages: ["privacy", "thanks"], // ヘッダーから除外するページ
  drawerExcludePages: ["privacy", "thanks"], // ドロワーメニューから除外するページ
  footerExcludePages: ["thanks"], // フッターから除外するページ
  pages: {
    top: {
      label: "トップ",
      root: "./",
      path: "",
      title: "",
      description:
      "トップページの説明文です。サイトの概要や特徴を簡潔に記載してください。",
      keywords: "キーワード1,キーワード2,キーワード3",
    },
    about: {
      label: "会社概要",
      root: "../",
      path: "about/",
      title: "会社概要",
      description:
      "会社概要ページの説明文です。会社の沿革や理念、事業内容などを記載してください。",
      keywords: "会社概要,企業情報,沿革,理念",
    },
    x: {
      label: "X",
      root: "",
      path: "https://x.com/yoshiaki_12",
      targetBlank: true,
    },
    privacy: {
      label: "プライバシーポリシー",
      root: "../",
      path: "privacy/",
      title: "プライバシーポリシー",
      description:
      "プライバシーポリシーページです。個人情報の取り扱いについて説明しています。",
      keywords: "プライバシーポリシー,個人情報保護,プライバシー",
    },
    contact: {
      label: "お問い合わせフォーム",
      root: "../",
      path: "contact/",
      title: "お問い合わせフォーム",
      description:
      "お問い合わせフォームページです。お問い合わせを送信することができます。",
      keywords: "",
    },
    thanks: {
      label: "お問い合わせ完了",
      root: "../",
      path: "thanks/",
      title: "お問い合わせ完了",
      description:
      "お問い合わせフォームページです。お問い合わせを送信することができます。",
      keywords: "",
    },
    mail: {
      label: "メール送信",
      root: "",
      path: "mailto:contact@example.com",
    },
  },
};
