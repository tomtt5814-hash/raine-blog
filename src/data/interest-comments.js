// Notion 条目页的评论（原 Notion 显示名 tt tom，这里统一为 tianming）
export const interestComments = {
  魔都精兵のスレイブ: [{ text: "top", at: "2026-08-18" }],
  猜火车: [{ text: "主角逃离那群吸毒的童年朋友的故事", at: "2026-08-17" }],
  溺水小刀: [
    { text: "痞", at: "2026-08-17" },
    { text: "痞到我了", at: "2026-10-17" },
  ],
  灵魂面甲: [
    { text: "https://www.bilibili.com/video/BV15D4y1K7cC?t=1.8", at: "2026-08-17" },
  ],
  P5R: [
    { text: "沉浸感max", at: "2026-10-17" },
    {
      text: "鸭志田，要被我在现实中碰到，我直接拿🔪爆他的菊，所有作品里，我最讨厌的反派，没有之一",
      at: "2026-10-17",
    },
  ],
  アマカノ3: [{ text: "PPT游戏闹麻了", at: "2026-08-16" }],
  绝区零: [{ text: "玩绝区零的人最纯真了", at: "2026-08-16" }],
};

export function commentsFor(name) {
  if (interestComments[name]) return interestComments[name];
  const key = Object.keys(interestComments).find((k) =>
    name.toLowerCase().includes(k.toLowerCase())
  );
  return key ? interestComments[key] : [];
}
