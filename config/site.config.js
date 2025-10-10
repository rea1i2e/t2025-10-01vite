export const siteConfig = {
  siteName: "静的サイト用ejsテンプレ",
  siteUrl: "https://example.com",
  titleSeparator: " | ",
  EJS_PATH: "./ejs/",
  IMAGE_PATH: "/assets/images/",
  headerExcludePages: ['privacy'],
  pages: {
    top: {
      label: "トップ",
      url: "/",
      description: "トップページの説明文です。サイトの概要や特徴を簡潔に記載してください。",
      keywords: "キーワード1,キーワード2,キーワード3"
    },
    about: {
      label: "会社概要",
      url: "/about/",
      title: "会社概要",
      description: "会社概要ページの説明文です。会社の沿革や理念、事業内容などを記載してください。",
      keywords: "会社概要,企業情報,沿革,理念"
    },
    x: {
      label: "X",
      url: "https://x.com/yoshiaki_12",
      targetBlank: true
    },
    privacy: {
      label: "プライバシーポリシー",
      url: "/privacy/",
      title: "プライバシーポリシー",
      description: "プライバシーポリシーページです。個人情報の取り扱いについて説明しています。",
      keywords: "プライバシーポリシー,個人情報保護,プライバシー"
    },
    contact: {
      label: "お問い合わせ",
      url: "mailto:contact@example.com"
    }
  }
};
