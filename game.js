// ==========================================
// 1. 初始化 Canvas 與 遊戲網格
// ==========================================
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(24, 24); // 將畫面放大 24 倍（1格 = 24x24 像素）

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
let score = 0;

// 建立 10x20 的二維陣列遊戲地圖
const arena = createMatrix(GRID_WIDTH, GRID_HEIGHT);

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

// ==========================================
// 2. 定義方塊形狀與顏色
// ==========================================
const TETROMINOES = {
    'I': [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
    'L': [[0,2,0],[0,2,0],[0,2,2]],
    'J': [[0,3,0],[0,3,0],[3,3,0]],
    'O': [[4,4],[4,4]],
    'Z': [[5,5,0],[0,5,5],[0,0,0]],
    'S': [[0,6,6],[6,6,0],[0,0,0]],
    'T': [[0,7,0],[7,7,7],[0,0,0]]
};

const COLORS = [
    null,
    '#00f0f0', // I - 青色
    '#ffa500', // L - 橘色
    '#0000ff', // J - 藍色
    '#ffff00', // O - 黃色
    '#ff0000', // Z - 紅色
    '#00ff00', // S - 綠色
    '#a000f0'  // T - 紫色
];

// 玩家目前控制的方塊狀態
const player = {
    pos: { x: 0, y: 0 },
    matrix: null
};

// ==========================================
// 3. 核心邏輯：碰撞偵測、固定與消行
// ==========================================

// 碰撞偵測
function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] === undefined || 
                arena[y + o.y][x + o.x] === undefined ||
                arena[y + o.y][x + o.x] !== 0)) {
                return true;
            }
        }
    }
    return false;
}

// 將方塊固定到遊戲地圖上
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

// 隨機重置/生成下一個方塊
function playerReset() {
    const pieces = 'ILJOSZT';
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    player.matrix = TETROMINOES[randomPiece];
    
    // 計算置中位置
    player.pos.y = 0;
    player.pos.x = Math.floor(GRID_WIDTH / 2) - Math.floor(player.matrix[0].length / 2);

    // 【遊戲結束判斷】如果剛出生就碰撞，代表方塊滿了
    if (collide(arena, player)) {
        alert("GAME OVER! 最終分數: " + score);
        arena.forEach(row => row.fill(0)); // 清空畫布重來
        score = 0;
        updateScore();
    }
}

// 檢查是否滿行並消除、加分
function arenaSweep() {
    let rowCount = 0;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer; // 隻要有一個是空格就不處理這行
            }
        }
        // 這行全滿了，移除並在最上方補一空行
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        rowCount++;
    }

    if (rowCount > 0) {
        // 經典經典消行加乘分數：1行100, 2行300, 3行500, 4行800
        const scoreTable = [0, 100, 300, 500, 800];
        score += (scoreTable[rowCount] || 800);
        updateScore();
    }
}

function updateScore() {
    document.getElementById('score').innerText = score;
}

// ==========================================
// 4. 控制與旋轉邏輯
// ==========================================

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir; // 撞牆就退回
    }
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--; // 撞到底部或既有方塊，退回一格
        merge(arena, player); // 固定
        arenaSweep();         // 檢查消行
        playerReset();        // 生成新方塊
    }
    dropCounter = 0; // 重設下落計時
}

// 矩陣旋轉演算法 (順時針)
function rotateMatrix(matrix) {
    // 轉置矩陣
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    // 左右反轉
    matrix.forEach(row => row.reverse());
}

function playerRotate() {
    const pos = player.pos.x;
    let offset = 1;
    rotateMatrix(player.matrix);
    
    // 基礎防卡牆(踢牆)機制
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            // 修正失敗，轉回原本狀態
            rotateMatrix(player.matrix);
            rotateMatrix(player.matrix);
            rotateMatrix(player.matrix);
            player.pos.x = pos;
            return;
        }
    }
}

// 監聽鍵盤操作
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        playerMove(-1);
    } else if (event.key === 'ArrowRight') {
        playerMove(1);
    } else if (event.key === 'ArrowDown') {
        playerDrop();
    } else if (event.key === 'ArrowUp') {
        playerRotate();
    }
});

// ==========================================
// 5. 繪製與遊戲循環 (Game Loop)
// ==========================================
let dropCounter = 0;
let dropInterval = 1000; // 自動下落速度 (1秒)
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = COLORS[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    // 背景填充
    context.fillStyle = '#161b22';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 繪製地圖上已固定的方塊
    drawMatrix(arena, { x: 0, y: 0 });
    // 繪製玩家當前操作的方塊
    drawMatrix(player.matrix, player.pos);
}

// ==========================================
// 6. 遊戲初始化啟動
// ==========================================
playerReset();
updateScore();
update();