const board = document.getElementById("chessboard");
const moveSound = document.getElementById("moveSound");

/* ================= BOARD STATE ================= */

let boardState = [
  ["r","n","b","q","k","b","n","r"],
  ["p","p","p","p","p","p","p","p"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["P","P","P","P","P","P","P","P"],
  ["R","N","B","Q","K","B","N","R"]
];

const symbols = {
  r:"♜", n:"♞", b:"♝", q:"♛", k:"♚", p:"♟",
  R:"♖", N:"♘", B:"♗", Q:"♕", K:"♔", P:"♙"
};

let turn = "white";
let selected = null;

/* ================= DRAW BOARD ================= */

function drawBoard() {
  board.innerHTML = "";

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {

      const sq = document.createElement("div");
      sq.classList.add("square", (r + c) % 2 === 0 ? "white" : "black");
      sq.dataset.row = r;
      sq.dataset.col = c;
      sq.textContent = symbols[boardState[r][c]] || "";

      sq.onclick = () => handleClick(r, c);

      board.appendChild(sq);
    }
  }
}

drawBoard();

/* ================= HELPERS ================= */

function isWhite(piece) {
  return piece === piece.toUpperCase();
}

function clearHighlights() {
  document.querySelectorAll(".highlight,.capture")
    .forEach(sq => sq.classList.remove("highlight","capture"));
}

/* ================= PATH CHECK ================= */

function isPathClear(fr, fc, tr, tc) {
  const dr = Math.sign(tr - fr);
  const dc = Math.sign(tc - fc);
  let r = fr + dr, c = fc + dc;

  while (r !== tr || c !== tc) {
    if (boardState[r][c] !== "") return false;
    r += dr;
    c += dc;
  }
  return true;
}

/* ================= MOVE RULES ================= */

function isValidMove(fr, fc, tr, tc) {
  const piece = boardState[fr][fc];
  const target = boardState[tr][tc];
  if (!piece) return false;
  if (target && isWhite(piece) === isWhite(target)) return false;

  const dr = tr - fr;
  const dc = tc - fc;

  switch (piece.toLowerCase()) {

    case "p": {
      const dir = isWhite(piece) ? -1 : 1;
      const start = isWhite(piece) ? 6 : 1;

      if (dc === 0 && dr === dir && !target) return true;
      if (dc === 0 && fr === start && dr === 2 * dir &&
          !boardState[fr + dir][fc] && !target) return true;
      if (Math.abs(dc) === 1 && dr === dir && target) return true;
      return false;
    }

    case "r":
      return (dr === 0 || dc === 0) && isPathClear(fr, fc, tr, tc);

    case "b":
      return Math.abs(dr) === Math.abs(dc) && isPathClear(fr, fc, tr, tc);

    case "q":
      return (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))
             && isPathClear(fr, fc, tr, tc);

    case "n":
      return (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
             (Math.abs(dr) === 1 && Math.abs(dc) === 2);

    case "k":
      return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
  }
  return false;
}

/* ================= HIGHLIGHT ================= */

function highlightMoves(fr, fc) {
  clearHighlights();

  document.querySelectorAll(".square").forEach(sq => {
    const r = +sq.dataset.row;
    const c = +sq.dataset.col;

    if (isValidMove(fr, fc, r, c)) {
      boardState[r][c] === ""
        ? sq.classList.add("highlight")
        : sq.classList.add("capture");
    }
  });
}

/* ================= CLICK HANDLER ================= */

function handleClick(r, c) {
  const piece = boardState[r][c];

  // select piece
  if (!selected) {
    if (!piece) return;
    if ((turn === "white" && !isWhite(piece)) ||
        (turn === "black" && isWhite(piece))) return;

    selected = [r, c];
    highlightMoves(r, c);
    return;
  }

  // move piece
  const [fr, fc] = selected;

  if (isValidMove(fr, fc, r, c)) {
    boardState[r][c] = boardState[fr][fc];
boardState[fr][fc] = "";

drawBoard();

/* 🔥 ADD THIS BELOW */
const index = r * 8 + c;
const movedSquare = board.children[index];
movedSquare.classList.add("moved");

setTimeout(() => {
  movedSquare.classList.remove("moved");
}, 300);
    moveSound.currentTime = 0;
    moveSound.play();

    turn = turn === "white" ? "black" : "white";
  }
    selected = null;
    clearHighlights();
}
