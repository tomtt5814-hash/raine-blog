// 阶段 1：留言存在 localStorage。阶段 2 起可接 VITE_API_BASE 的后端，函数签名保持不变。
const KEY = "mb.messages.v1";
const SEEDED = "mb.messages.seeded";

export const seedMessages = [
  {
    id: "m5",
    nickname: "阿岚",
    content: "首页的背景光晕很舒服，夜里看不刺眼。冬天来了记得多穿点。",
    email: "",
    interestTags: ["温情"],
    avatarSeed: "阿岚",
    createdAt: "2025-10-20T09:12:00.000Z",
    status: "published",
  },
  {
    id: "m4",
    nickname: "K",
    content: "P5R 天下第一。什么时候写一篇讲怪盗团配乐的？",
    email: "",
    interestTags: ["JRPG"],
    avatarSeed: "K",
    createdAt: "2025-10-18T14:40:00.000Z",
    status: "published",
  },
  {
    id: "m3",
    nickname: "小满",
    content: "第一次来，BGM 按钮转起来的时候有点惊喜，像旧唱片。",
    email: "",
    interestTags: ["电影"],
    avatarSeed: "小满",
    createdAt: "2025-10-15T21:05:00.000Z",
    status: "published",
  },
  {
    id: "m2",
    nickname: "老周",
    content: "文章列表什么时候上线？想看那篇写洛圣都的。",
    email: "",
    interestTags: ["科幻"],
    avatarSeed: "老周",
    createdAt: "2025-10-11T08:30:00.000Z",
    status: "published",
  },
  {
    id: "m1",
    nickname: "豆子",
    content: "流言板这个名字比留言板好玩。先留个脚印。",
    email: "",
    interestTags: ["漫画"],
    avatarSeed: "豆子",
    createdAt: "2025-10-08T19:22:00.000Z",
    status: "published",
  },
];

export function listMessages() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seedMessages));
      return seedMessages;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return seedMessages;
  }
}

export function addMessage(input) {
  const message = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : "m" + Date.now(),
    nickname: input.nickname.trim(),
    content: input.content.trim(),
    email: (input.email || "").trim(),
    interestTags: input.interestTags || [],
    avatarSeed: input.nickname.trim(),
    createdAt: new Date().toISOString(),
    status: "published",
  };
  const next = [message, ...listMessages()];
  localStorage.setItem(KEY, JSON.stringify(next));
  return message;
}

export function deleteMessage(id) {
  const next = listMessages().filter((m) => m.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function resetMessages() {
  localStorage.setItem(KEY, JSON.stringify(seedMessages));
  return seedMessages;
}

// 简单的本地频率限制：同一浏览器 20 秒内只能发一条
export function checkRateLimit() {
  const last = Number(localStorage.getItem("mb.lastPost") || 0);
  const wait = 20_000 - (Date.now() - last);
  return wait > 0 ? Math.ceil(wait / 1000) : 0;
}

export function markPosted() {
  localStorage.setItem("mb.lastPost", String(Date.now()));
}

// 敏感词与长度约束
const BLOCKED = ["傻逼", "操你", "滚蛋", "fuck", "shit"];
export function validateMessage({ nickname, content, email }) {
  if (!nickname.trim()) return "还差一个昵称。";
  if (nickname.trim().length > 24) return "昵称最多 24 个字。";
  if (!content.trim()) return "留言内容不能为空。";
  if (content.trim().length < 2) return "再多写两个字吧。";
  if (content.trim().length > 300) return "留言最多 300 个字，长故事可以写到文章里。";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return "邮箱格式好像不太对（不会公开）。";
  const hit = BLOCKED.find((w) => content.toLowerCase().includes(w));
  if (hit) return "这段内容里有不合适的词，换个说法试试。";
  return "";
}

// —— 阶段 2 后端接口占位 ——
// const API = import.meta.env.VITE_API_BASE;
// export async function fetchMessages() { ... }
// export async function postMessage(payload) { ... }
