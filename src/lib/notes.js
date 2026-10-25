// 兴趣条目下的访客留言：阶段 1 存 localStorage，按作品名分组。
// 以后接后端时，把 read/write 换成 fetch 即可，组件不用动。
const KEY = "mb.notes.v1";
const MINE = "mb.myNoteIds";
const LAST = "mb.lastNote";

const BLOCKED = ["傻逼", "操你", "滚蛋", "fuck", "shit"];

function read() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

export function notesFor(item) {
  const all = read();
  return Array.isArray(all[item]) ? all[item] : [];
}

export function addNote(item, { nickname, text }) {
  const all = read();
  const note = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    nickname: nickname.trim() || "路人",
    text: text.trim(),
    at: new Date().toISOString(),
  };
  all[item] = [note, ...(all[item] || [])].slice(0, 100);
  localStorage.setItem(KEY, JSON.stringify(all));
  const mine = readMine();
  mine.push(note.id);
  localStorage.setItem(MINE, JSON.stringify(mine.slice(-200)));
  return note;
}

function readMine() {
  try {
    const ids = JSON.parse(localStorage.getItem(MINE) || "[]");
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

// 只有本浏览器发过的留言才显示「撤回」
export function isMine(id) {
  return readMine().includes(id);
}

export function removeNote(item, id) {
  const all = read();
  all[item] = (all[item] || []).filter((n) => n.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
  localStorage.setItem(MINE, JSON.stringify(readMine().filter((x) => x !== id)));
}

export function validateNote({ nickname, text }) {
  if (nickname.trim().length > 24) return "昵称最多 24 个字。";
  if (!text.trim()) return "写点什么再发吧。";
  if (text.trim().length < 2) return "再多写两个字。";
  if (text.trim().length > 300) return "最多 300 个字。";
  const hit = BLOCKED.find((w) => text.toLowerCase().includes(w));
  if (hit) return "这段里有不太合适的词，换个说法。";
  return "";
}

// 同一浏览器 15 秒内只能发一条，防连点
export function noteCooldown() {
  const last = Number(localStorage.getItem(LAST) || 0);
  const wait = 15_000 - (Date.now() - last);
  return wait > 0 ? Math.ceil(wait / 1000) : 0;
}

export function markNotePosted() {
  localStorage.setItem(LAST, String(Date.now()));
}
