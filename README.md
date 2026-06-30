# 🕹️ 網頁版俄羅斯方塊 (Classic Web Tetris)

這是一個使用原生 HTML5 Canvas、CSS3 和 JavaScript (Vanilla JS) 開發的經典俄羅斯方塊網頁遊戲。不需安裝任何套件，打開瀏覽器即可遊玩！

👉 **[點此線上遊玩](https://t1132b0016-max.github.io/note/)** *(註：建立好 GitHub Pages 後可把網址貼在這裡)*

---

## 🚀 遊戲特色
- **純原生開發**：不依賴任何第三方前端框架（如 React, Vue），純粹使用 Canvas 進行繪製。
- **現代感視覺**：採用深色模式（Dark Mode）與霓虹配色，帶來流暢的視覺體驗。
- **經典計分機制**：完整實作消行得分、方塊速度隨分數提升、以及 Game Over 判定。

## 🎮 操作說明
遊戲開始後，使用鍵盤方向鍵控制方塊：
- ⬅️ **左方向鍵**：向左移動
- ➡️ **右方向鍵**：向右移動
- ⬆️ **上方向鍵**：順時針旋轉方塊
- ⬇️ **下方向鍵**：加速下落（軟降落）
- ⌨️ **空白鍵 (Space)**：瞬間下落（硬降落，可依後續功能自行加入）

## 🛠️ 開發環境與技術棧
- **編輯器**：Visual Studio Code
- **語言/技術**：
  - HTML5 (Canvas)
  - CSS3 (Flexbox, CSS 變數)
  - JavaScript (ES6+, Game Loop, 二維矩陣碰撞偵測)

## 📂 專案架構
```text
├── index.html      # 遊戲網頁主結構與 Canvas 畫布
├── style.css       # 霓虹復古風樣式與排版
├── game.js         # 俄羅斯方塊核心邏輯與計分系統
└── README.md       # 本說明文件
