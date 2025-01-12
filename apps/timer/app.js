// タイマー設定
let totalTime = 120;       // タイマーの設定（1周にかかる時間）。単位: 分__120分に設定(2時間)

// 中心点管理
let innerRadius = 1;     // 中心部の円の半径
// let centerColor = "#000000";   // 中心点の色を黒色に設定
let centerColor = "#FF0000";   // 中心点の色を赤色に設定
// let centerColor = "#ff8000";   // 中心点の色をオレンジに設定
// let centerColor = "#00FF00";   // 中心点の色を緑色に設定
// let centerColor = "#0000FF";   // 中心点の色を青色に設定


// 扇形管理
let outerRadius = 10;    // 外側の円の半径
// let pieColor = "#000000";    // 扇形の色を黒色に設定
// let pieColor = "#708090";    // 扇形の色をスレートグレーに設定
// let pieColor = "#49413F";    // 扇形の色をディープトープに設定
// let pieColor = "#333333";    // 扇形の色を濃い灰色に設定
// let pieColor = "#FF0000";    // 扇形の色を赤色に設定
// let pieColor = "#8B0000";    // 扇形の色をダークレッドに設定
// let pieColor = "#800020";    // 扇形の色をバーガンディに設定
// let pieColor = "#65000B";    // 扇形の色をローズウッドに設定
// let pieColor = "#ff8000";    // 扇形の色をオレンジに設定_少消費電力_2位
// let pieColor = "#B8860B";    // 扇形の色をダークゴールドに設定_少消費電力_5位
// let pieColor = "#B37800";    // 扇形の色をダークアンバーに設定_少消費電力_3位
// let pieColor = "#C45000";    // 扇形の色をダークアンバーに赤色を追加した設定
// let pieColor = "#C93C00";    // 扇形の色をダークアンバーさらに赤色を追加した設定
// let pieColor = "#00FF00";    // 扇形の色を緑色に設定_少消費電力_1位
// let pieColor = "#008080";    // 扇形の色をティールグリーンに設定
// let pieColor = "#00688B";    // 扇形の色をディープシアンに設定
// let pieColor = "#013220";    // 扇形の色をフォレストグリーンに設定
// let pieColor = "#004D40";    // 扇形の色をフォレストティールに設定
// let pieColor = "#556B2F";    // 扇形の色をダークオリーブグリーンに設定
// let pieColor = "#0000FF";    // 扇形の色を青色に設定
// let pieColor = "#191970";    // 扇形の色をミッドナイトブルーに設定
// let pieColor = "#4682B4";    // 扇形の色をスティールブルーに設定_少消費電力_4位
// let pieColor = "#001F3F";    // 扇形の色をネイビーブルーに設定
// let pieColor = "#00008B";    // 扇形の色をダークブルーに設定
let pieColor = "#FF0000";    // 扇形の色をに設定


// タイマー管理
let elapsedSeconds = 0;  // 経過秒数
let isRunning = false;   // タイマー動作中かどうか
let timerInterval = null;


// 文字管理
let timeUpMessage = "Surface!";  // 表示するメッセージ
let fontSize = 40;             // 使用するフォントのサイズ
// let messageColor = "#000000";  // 文字色を黒色に設定
let messageColor = "#FF0000";  // 文字色を赤色に設定
// let messageColor = "#00FF00";  // 文字色を緑色に設定
// let messageColor = "#0000FF";  // 文字色を青色に設定




 // 円グラフの一部（扇形）を描画する関数
function pie(f, a0, a1, invert) {
  if (!invert) return pie(f, a1, a0 + 1, true);
  const t0 = Math.tan(a0 * 2 * Math.PI), t1 = Math.tan(a1 * 2 * Math.PI);
  let i0 = Math.floor(a0 * 4 + 0.5), i1 = Math.floor(a1 * 4 + 0.5);
  const x = f.getWidth()/2, y = f.getHeight()/2;
  const poly = [
    x + (i1 & 2 ? -x : x) * (i1 & 1 ? 1 : t1),
    y + (i1 & 2 ? y : -y) / (i1 & 1 ? t1 : 1),
    x, y,
    x + (i0 & 2 ? -x : x) * (i0 & 1 ? 1 : t0),
    y + (i0 & 2 ? y : -y) / (i0 & 1 ? t0 : 1),
  ];
  if (i1 - i0 > 4) i1 = i0 + 4;
  for (i0++; i0 <= i1; i0++)
    poly.push((3*i0 & 2) ? f.getWidth() : 0, (i0 & 2) ? f.getHeight() : 0);
  // 扇形を赤色で塗りつぶす
  return f.setColor(pieColor).fillPoly(poly);
}



// 円グラフを描画する関数
function drawTimer(g) {
  const totalSeconds = totalTime * 60;
  const fraction = elapsedSeconds / totalSeconds;
  const centerX = g.getWidth() / 2;
  const centerY = g.getHeight() / 2;

  // 背景のクリア
  g.clear();
  g.setColor('#FFFFFF').fillCircle(centerX, centerY, outerRadius); // 外円

  // 塗りつぶし（円グラフ）
  // pie(g, 0, fraction, true);

  // 扇形を指定したスケールで描画
  pie(g, 0, fraction, true);


  // 中心点を指定色で塗りつぶして整形
  g.setColor(centerColor).fillCircle(centerX, centerY, innerRadius);
}

// タイマーの更新
function updateTimer(g) {
  if (isRunning) {
    elapsedSeconds++;
    const totalSeconds = totalTime * 60;
    // 一周を超えたらタイマーを停止してメッセージを表示
    if (elapsedSeconds >= totalSeconds) {
      elapsedSeconds = 0;
      isRunning = false;
      clearInterval(timerInterval);
      timerInterval = null;

      // ---- Time Up! と画面表示 ----
      g.clear();
      g.setFontAlign(0, 0);
      // g.setFont("6x8", 2);  // "6x8" フォントをスケール2倍で設定_今は使わない
      
      // フォントの選択とサイズ設定（例としてベクターフォントを使用）
      g.setFont("Vector", fontSize);
      g.setColor(messageColor);  // 文字色を指定
      g.drawString(timeUpMessage, g.getWidth() / 2, g.getHeight() / 2);


      return; // ここで処理を中断
    }
    // 通常描画
    drawTimer(g);
  }
}

// タイマー開始（起動時に1回だけ呼び出す）
function startTimer(g) {
  if (!isRunning) {
    isRunning = true;
    timerInterval = setInterval(() => updateTimer(g), 1000);
  }
}

// タイマーのリセット（動作は継続もしくは再スタート用）
function resetTimer(g) {
  elapsedSeconds = 0;
  drawTimer(g);
}

// LCD が点灯したら再描画
Bangle.on('lcdPower', (on) => {
  if (on) drawTimer(g);
});

// ------------ ダブルプレス判定を行う部分 -------------
let lastPressTime = 0;          // 前回押された時刻(ms)
const doublePressMs = 500;      // ダブルプレスと判定する最大間隔(ms)

// Bangle.js 2 向けにボタン操作を定義（1つのボタンだけ）
Bangle.setUI({
  mode: "custom",
  btn: () => {
    const now = Date.now();
    // 前回押下から一定時間以内なら「ダブルプレス」と判定
    if (now - lastPressTime < doublePressMs) {
      // ダブルプレス時は「リセット＋再スタート」
      resetTimer(g);
      startTimer(g);
    } else {
      // ここではシングルプレス時の処理は行わない
      lastPressTime = now;
    }
  }
});

// 初期描画
drawTimer(g);
// 実行時にタイマーを自動スタート
startTimer(g);
