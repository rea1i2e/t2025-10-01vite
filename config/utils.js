/**
 * HTMLタグ除去
 * alt・title・aria-label など属性値への出力に使用
 *
 * @example
 * ty_stripTags('<strong>テキスト</strong>') // → 'テキスト'
 */
export const ty_stripTags = (value = "") => {
  return String(value).replace(/<[^>]*>/g, "");
};

/**
 * 共有・外部API用: ベースURLにクエリを付与（値は URLSearchParams で百分率エンコード）
 *
 * @param {string} base - 例: "https://twitter.com/intent/tweet"
 * @param {Record<string, string | number | undefined | null>} [query] - キー例: url, text, u（Facebook）
 * @returns {string}
 * @example
 * ty_appendQuery("https://twitter.com/intent/tweet", { url: "https://example.com/", text: "見出し" });
 */
export const ty_appendQuery = (base, query = {}) => {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    usp.set(k, String(v));
  }
  const s = usp.toString();
  if (!s) {
    return base;
  }
  return base + (base.includes("?") ? "&" : "?") + s;
};

/**
 * 除外ページチェック
 * プレフィックスマッチング・正規表現ライクパターン・完全一致に対応
 *
 * @example
 * // "demo*"     → demo, demoFadein, demoDialog などすべて除外
 * // "demo[A-Z]*" → demoFadein, demoDialog などは除外、demo は除外しない
 * // "contact"   → contact のみ除外
 */
export const ty_isExcluded = (key, excludePages) => {
  return excludePages.some(pattern => {
    if (!pattern) return false;

    if (pattern.includes('[') && pattern.includes(']')) {
      const regexPattern = pattern.replace(/\*/g, '.*');
      const regex = new RegExp('^' + regexPattern + '$');
      return regex.test(key);
    }

    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return key.startsWith(prefix);
    }

    return key === pattern;
  });
};

/**
 * メールアドレス保護（オブジェクト生成）
 * 文字列として扱われたとき（<%- %>）に保護用 HTML を返す
 *
 * @example
 * ty_email('user', 'example.com')
 * ty_email('user', 'example.com', { link: false })
 */
export const ty_email = (user, domain, options = {}) => {
  const shouldLink = options.link !== undefined ? options.link : true;
  return {
    user,
    domain,
    _isEmail: true,
    _link: shouldLink,
    toString() {
      const linkAttr = shouldLink ? 'true' : 'false';
      return `<span class="js-email-protection" data-email-user="${user}" data-email-domain="${domain}" data-link="${linkAttr}"></span><noscript>${user}[at]${domain}</noscript>`;
    }
  };
};

/**
 * メールアドレス保護（HTML 直接出力）
 *
 * @example
 * <%- ty_email_protection('user', 'example.com') %>
 * <%- ty_email_protection('user', 'example.com', false) %>
 */
export const ty_email_protection = (user, domain, link = true) => {
  const linkAttr = link ? 'true' : 'false';
  return `<span class="js-email-protection" data-email-user="${user}" data-email-domain="${domain}" data-link="${linkAttr}"></span><noscript>${user}[at]${domain}</noscript>`;
};
