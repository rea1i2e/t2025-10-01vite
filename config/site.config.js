import {
  ty_isExcluded,
  ty_email,
  ty_email_protection,
  ty_stripTags,
} from "./utils.js";

/**
 * ページ設定
 */
const pages = {
  top: {
    label: "トップ",
    root: "./",
    path: "",
    title: "",
    description:
      "トップページの説明文です。サイトの概要や特徴を簡潔に記載してください。",
    keywords: "キーワード1,キーワード2,キーワード3",
  },
  demo: {
    label: "デモ一覧",
    root: "../",
    path: "demo/",
    title: "デモ一覧",
    description: "デモの一覧ページです。",
  },
  demoAccordion: {
    label: "アコーディオン",
    root: "../../",
    path: "demo/demo-accordion/",
    title: "アコーディオン",
    description: "アコーディオンデモページです。",
  },
  demoDialog: {
    label: "モーダル（動画再生モーダル）",
    root: "../../",
    path: "demo/demo-dialog/",
    title: "モーダル",
    description: "モーダルデモページです。",
  },
  demoTab: {
    label: "タブ切り替え",
    root: "../../",
    path: "demo/demo-tab/",
    title: "タブ切り替え",
    description: "タブ切り替えデモページです。",
  },
  demoSplide: {
    label: "スライダー（Splide）",
    root: "../../",
    path: "demo/demo-splide/",
    title: "フェードで切り替えるスライダー（Splide）",
    description: "フェードで切り替えるスライダー（Splide）デモページです。",
  },
  demoFvVideo: {
    label: "ファーストビュー動画（PC/SP・音声）",
    root: "../../",
    path: "demo/demo-fv-video/",
    title: "ファーストビュー動画（PC/SP出し分け・音声トグル）",
    description:
      "ファーストビューに動画を表示し、768px境界でPC/SP用動画を切り替え、ミュートと音声ON/OFFを切り替えるデモです。",
  },
  demoSound: {
    label: "音声再生",
    root: "../../",
    path: "demo/demo-sound/",
    title: "音声再生",
    description: "音声再生のデモページです。",
  },
  demoScrollAnimation: {
    label: "スクロールアニメーション",
    root: "../../",
    path: "demo/demo-scroll-animation/",
    title: "スクロールアニメーション",
    description: "スクロールに応じて要素が順次表示されるデモページです。",
  },
  demoParallax: {
    label: "パララックス",
    root: "../../",
    path: "demo/demo-parallax/",
    title: "パララックス",
    description: "パララックスデモページです。",
  },
  demoTextDecoration: {
    label: "テキスト装飾",
    root: "../../",
    path: "demo/demo-text-decoration/",
    title: "テキスト装飾",
    description: "テキスト装飾デモページです。",
  },
  demoCssAnime: {
    label: "CSSアニメーション",
    root: "../../",
    path: "demo/demo-css-animation/",
    title: "CSSアニメーションデモ",
    description: "CSSアニメーションデモページです。",
  },
  demoGridLayout: {
    label: "グリッドレイアウト",
    root: "../../",
    path: "demo/demo-grid-layout/",
    title: "グリッドレイアウト",
    description: "グリッドレイアウトデモページです。",
  },
  demoHoverButton: {
    label: "ホバーエフェクト（ボタン）",
    root: "../../",
    path: "demo/demo-hover-button/",
    title: "ホバーエフェクト（ボタン）",
    description: "ホバーエフェクトのデモ（ボタン）ページです。",
  },
  demoHoverText: {
    label: "ホバーエフェクト（テキスト）",
    root: "../../",
    path: "demo/demo-hover-text/",
    title: "ホバーエフェクト（テキスト）",
    description: "ホバーエフェクトのデモ（テキスト）ページです。",
  },
  demoHoverCard: {
    label: "ホバーエフェクト（カード）",
    root: "../../",
    path: "demo/demo-hover-card/",
    title: "ホバーエフェクト（カード）",
    description: "ホバーエフェクトのデモ（カード）ページです。",
  },
  demoCurrentSection: {
    label: "カレントセクション",
    root: "../../",
    path: "demo/demo-current-section/",
    title: "カレントセクション",
    description: "カレントセクションデモページです。",
  },
  demoHoverChange: {
    label: "ホバーエフェクト（画像切り替え）",
    root: "../../",
    path: "demo/demo-hover-change/",
    title: "ホバーエフェクト（画像切り替え）",
    description: "ホバーエフェクト（画像切り替え）ページです。",
  },
  demoDocument: {
    label: "ドキュメント（ul, ol, dl, dt, dd, table）",
    root: "../../",
    path: "demo/demo-document/",
    title: "ドキュメント",
    description: "ul, ol, dl, dt, dd, tableなどドキュメントページです。",
  },
  demoMedia: {
    label: "メディアいろいろ",
    root: "../../",
    path: "demo/demo-media/",
    title: "メディアいろいろ",
    description:
      "画像（img・picture・background-image）と動画（video デフォルト・自動再生・画面サイズ出し分け）の設置例です。",
  },
  demoApi: {
    label: "APIいろいろ",
    root: "../../",
    path: "demo/demo-api/",
    title: "APIいろいろ",
    description:
      "APIの設置例です。",
  },
  contact: {
    label: "お問い合わせ",
    root: "../../",
    path: "demo/contact/",
    title: "お問い合わせ",
    description:
      "お問い合わせフォームページです。お問い合わせを送信することができます。",
    keywords: "",
  },
  thanks: {
    label: "お問い合わせ完了",
    root: "../../",
    path: "demo/contact/thanks.html",
    title: "お問い合わせ完了",
    description:
      "お問い合わせフォームページです。お問い合わせを送信することができます。",
    keywords: "",
  },
  privacy: {
    label: "個人情報保護方針",
    root: "../../",
    path: "demo/privacy/",
    title: "個人情報保護方針",
    description: "個人情報保護方針ページです。",
    keywords: "",
  },
  // 外部リンク設置例
  x: {
    label: "X",
    root: "",
    path: "https://x.com/yoshiaki_12",
    targetBlank: true,
  },
};

export const siteConfig = {
  /**
   * 共通設定（案件によらず変更しないもの）
   */
  ejsPath: "./ejs/", // ルート相対パスで書くと、ズレる（システムルートの解釈）
  imagePath: "/assets/images/",
  /** ルート相対（Vite root=src により src/assets/videos/ に解決。imagePath と同様） */
  videoPath: "/assets/videos/",

  /**
   * プロジェクト設定（案件固有のもの）
   */
  siteName: "静的サイト用ejsテンプレート",
  baseUrl: "https://rea1i2e.net/",
  titleSeparator: " | ",

  /**
   * 画像の代替フォーマット（ビルド・after-build で使用）
   * - 'avif'  : png, jpg + avif
   * - 'webp'  : png, jpg + webp
   * - 'both'  : png, jpg + webp + avif
   * - 'none'  : png, jpg のみ（picture 化しない）
   */
  imageAltFormats: "avif",

  /**
   * ビルド後のファイル名(CSS・JS・画像・フォントなど)にハッシュを付与するか
   * - true  : ファイル名にハッシュを付与する（例: main-AbCdEfGh.js）
   * - false : ハッシュなし（例: main.js）
   */
  // useFileHash: true,
  useFileHash: false,

  /**
   * ページ除外設定
   * ヘッダー、ドロワー、フッターから除外するページの指定
   *
   * パターン指定方法:
   * - "demo*" → demoで始まるすべてのページを除外
   * - "demo[A-Z]*" → demoの後に大文字が続くページのみ除外（demoは除外しない）
   * - "contact" → contactのみ除外
   */
  headerExcludePages: ["demo[A-Z]*", "thanks"],
  drawerExcludePages: ["demo[A-Z]*", "thanks"],
  // footerExcludePages: ["demo[A-Z]*", "thanks"],

  // 除外ページチェック関数
  ty_isExcluded,

  // メールアドレス保護用ヘルパー関数
  ty_email,
  ty_email_protection,

  // HTMLタグ除去関数（alt・aria-label など属性値に使用）
  ty_stripTags,

  // ページ設定
  pages,

  /**
   * ページ情報を取得する関数
   * @param {string} pageKey - ページのキー（例: 'top', 'demo'）
   * @returns {object} pageオブジェクト（title, description, keywords, path, root）
   */
  ty_getPage(pageKey) {
    const pageData = this.pages[pageKey];
    if (!pageData) {
      throw new Error(`Page "${pageKey}" not found in pages config`);
    }
    return {
      title: pageData.title
        ? pageData.title + this.titleSeparator + this.siteName
        : this.siteName,
      description: pageData.description,
      keywords: pageData.keywords,
      path: pageData.path,
      root: pageData.root,
    };
  },
};

/**
 * 未定義の場合にデフォルト値を設定
 * コメントアウトしてもエラーを出さないため
 */
if (!siteConfig.headerExcludePages) {
  siteConfig.headerExcludePages = [];
}
if (!siteConfig.drawerExcludePages) {
  siteConfig.drawerExcludePages = [];
}
if (!siteConfig.footerExcludePages) {
  siteConfig.footerExcludePages = [];
}
