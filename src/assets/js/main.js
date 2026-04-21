/**
* デバッグ用
*/

// スクロール可能要素の調査
// import './_debugScrollable.js';


/**
* 共通処理
*/

/* スムーススクロール */
import './_initializeSmoothScroll.js';

/* ドロワー */
import './_drawer.js';



/**
 * 案件固有処理（必要に応じてdemoから移動して使用）
 */

/* スライダー */
import './demo/_splide-fade.js';
import './demo/_splide-loop.js';
import './demo/_splide-thumbnail.js';
import './demo/_splide-progress.js';
import './demo/_splide-posts.js';

/* アコーディオン・トグル */
import './demo/_accordion.js';
import './demo/_toggle.js'; // details, summaryを使わない場合

/* モーダル */
// import './_dialog-common.js'; // 各ファイルから読み込んでいるため、ここでの読み込みは不要
import './demo/_dialog-general.js';
import './demo/_dialog-youtube.js'; // モーダルのyoutube動画再生
import './demo/_dialog-video.js'; // モーダルのvideo要素動画再生
import './demo/_modal.js'; // dialog要素を使わない場合

/* タブ切り替え */
import './demo/_tab.js';

/* スクロールに応じた表示制御 */
import './demo/_fadein.js';
import './demo/_parallax.js'; // パララックス
import './demo/_page-top.js';
import './demo/_fixed-menu.js';
import './demo/_nav-current-section.js';
import './demo/_counter.js'; // カウントアップアニメーション
import './demo/_header.js';

/* スクロールヒント */
import './demo/_scroll-hint.js';


/* フォーム関連 */
import './demo/_option-color.js';
import './demo/_checkFormValidity.js';
import './demo/_flatpickr.js';



/* メールアドレス保護 */
import './demo/_email-protection.js';


/* ホバーエフェクト */
import './demo/_text-underline.js'; // 左から右に下線




/* ファーストビュー動画デモ */
import './demo/_demo-fv-video.js';


/* JSONPlaceholder API デモ */
import './demo/_demo-api.js';

/* ランダムページ遷移（訪問済み除外）デモ */
import './demo/_demo-random-page-nav.js';


/* 音声 ON/OFF dialog デモ */
import './demo/_demo-sound.js';


/* ダークモード・ライトモード切り替え */
import './demo/_theme-toggle.js';