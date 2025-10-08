export const siteConfig = {
  siteName: "静的サイト用ejsテンプレ",
  siteUrl: "https://example.com",
  pages: [
    {
      key: "top",
      label: "トップ",
      url: "/",
      // title: "", トップページでサイト名のみにする場合、titleは定義しない
      description: "トップページの説明文です。サイトの概要や特徴を簡潔に記載してください。",
      keywords: "キーワード1,キーワード2,キーワード3"
    },
    {
      key: "about",
      label: "会社概要",
      url: "/about/",
      title: "会社概要",
      description: "会社概要ページの説明文です。会社の沿革や理念、事業内容などを記載してください。",
      keywords: "会社概要,企業情報,沿革,理念"
    }
  ]
};
