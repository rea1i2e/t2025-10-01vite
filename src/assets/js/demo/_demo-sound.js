/**
 * デモページ: 読み込み直後に dialog で音声 ON/OFF を選び、ON のときのみ再生
 * 対象: `[data-demo-sound-dialog]` + `[data-demo-sound-audio]` + ON/OFF ボタン
 */

import demoSoundUrl from '../../audio/demo-sound/M08_Piano_short_BPM65.mp3';

// dialog本体
const dialog = document.querySelector('[data-demo-sound-dialog]');

// audio要素
const audio = document.querySelector('[data-demo-sound-audio]');

// ボタン要素
const btnOn = document.querySelector('[data-demo-sound-on]');
const btnOff = document.querySelector('[data-demo-sound-off]');

if (dialog && audio && btnOn && btnOff) {
  audio.src = demoSoundUrl;

  btnOn.addEventListener('click', () => {
    dialog.close();
    audio.play().catch((err) => {
      console.warn('[demo-sound] play failed', err);
    });
  });

  btnOff.addEventListener('click', () => {
    dialog.close();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      dialog.showModal();
    }, { once: true });
  } else {
    dialog.showModal();
  }
}
