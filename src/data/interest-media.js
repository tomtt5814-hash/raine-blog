// Notion 条目页里的额外内容：多图条目、B 站 / YouTube 嵌入
// 图片已转 webp 放在 public/interests/media/
export const interestMedia = {
  P5R: {
    images: [
      "interests/media/P5R-0.webp",
      "interests/media/P5R-1.webp",
      "interests/media/P5R-2.webp",
      "interests/media/P5R-3.webp",
      "interests/media/P5R-4.webp",
      "interests/media/P5R-5.webp",
    ],
    embeds: [],
  },
  荒野乱斗: { images: ["interests/media/荒野乱斗-0.webp"], embeds: [] },
  魔女之泉R: { images: ["interests/media/魔女之泉R-0.webp"], embeds: [] },
  アマカノ3: {
    images: [],
    embeds: [
      { provider: "bilibili", url: "https://www.bilibili.com/video/BV1jyE3zoEYB" },
      { provider: "bilibili", url: "https://www.bilibili.com/video/BV1Azj2zcEgx" },
    ],
  },
  无职转生: {
    images: [],
    embeds: [
      {
        provider: "youtube",
        url: "https://youtu.be/UKcJqQqiXq0",
        title: "『無職転生Ⅲ』ノンクレジットED映像",
      },
    ],
  },
  绝区零: {
    images: [],
    embeds: [
      { provider: "youtube", url: "https://youtu.be/vI1lPuLHaVI", title: "Zenless is a Gooner Game" },
    ],
  },
};

export function mediaFor(name) {
  if (interestMedia[name]) return interestMedia[name];
  const key = Object.keys(interestMedia).find((k) =>
    name.toLowerCase().includes(k.toLowerCase())
  );
  return key ? interestMedia[key] : { images: [], embeds: [] };
}

export const bvid = (url) => (url.match(/BV[0-9A-Za-z]+/) || [""])[0];
export const ytId = (url) =>
  (url.match(/(?:youtu\.be\/|v=)([0-9A-Za-z_-]{6,})/) || ["", ""])[1];
