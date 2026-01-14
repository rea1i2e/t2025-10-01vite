/**
 * 除外ページチェック関数
 * プレフィックスマッチングと正規表現ライクなパターンに対応
 * 
 * @param {string} key - チェックするページキー
 * @param {string[]} excludePages - 除外パターンの配列
 * @returns {boolean} 除外対象の場合true
 * 
 * @example
 * // プレフィックスマッチング: "demo*" → demo, demoFadein, demoDialog などすべて除外
 * // 正規表現ライク: "demo[A-Z]*" → demoFadein, demoDialog などは除外、demo は除外しない
 * // 完全一致: "contact" → contact のみ除外
 */
export const isExcluded = (key, excludePages) => {
  return excludePages.some(pattern => {
    if (!pattern) return false;

    // 正規表現ライクなパターン（例: demo[A-Z]*）
    if (pattern.includes('[') && pattern.includes(']')) {
      const regexPattern = pattern.replace(/\*/g, '.*');
      const regex = new RegExp('^' + regexPattern + '$');
      return regex.test(key);
    }

    // プレフィックスマッチング（例: demo*）
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return key.startsWith(prefix);
    }

    // 完全一致
    return key === pattern;
  });
};

/**
 * メールアドレス保護用のヘルパー関数
 * スパムボット対策として、メールアドレスを分割して扱うためのオブジェクトを生成
 * 
 * @param {string} user - メールアドレスのユーザー名部分
 * @param {string} domain - メールアドレスのドメイン部分
 * @param {object} options - オプション { link: boolean }
 * @returns {object} メールアドレスオブジェクト { user, domain, _isEmail: true, _link: boolean }
 * 
 * @example
 * email('afmaar128', 'gmail.com')
 * email('afmaar128', 'gmail.com', { link: false })
 */
export const email = (user, domain, options = {}) => {
  const shouldLink = options.link !== undefined ? options.link : true;
  const emailObj = {
    user,
    domain,
    _isEmail: true,
    _link: shouldLink,
    // toString()を定義して、文字列として扱われたときにHTMLを返す
    toString() {
      const linkAttr = shouldLink ? 'true' : 'false';
      return `<span class="js-email-protection" data-email-user="${user}" data-email-domain="${domain}" data-link="${linkAttr}"></span><noscript>${user}[at]${domain}</noscript>`;
    }
  };
  return emailObj;
};

/**
 * メールアドレス保護用の直接出力関数（PHPのty_()と同様の使い方）
 * スパムボット対策として、メールアドレスを分割してHTMLを直接返す
 * 
 * @param {string} user - メールアドレスのユーザー名部分
 * @param {string} domain - メールアドレスのドメイン部分
 * @param {boolean} link - リンクを生成するか（デフォルト: true）
 * @returns {string} メールアドレス保護用のHTML文字列
 * 
 * @example
 * <%- ty_('yoko', 'eoosaka.org', false) %>
 * <%- ty_('yoko', 'eoosaka.org', true) %>
 */
export const ty_ = (user, domain, link = true) => {
  const linkAttr = link ? 'true' : 'false';
  return `<span class="js-email-protection" data-email-user="${user}" data-email-domain="${domain}" data-link="${linkAttr}"></span><noscript>${user}[at]${domain}</noscript>`;
};
