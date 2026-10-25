// 站点与个人信息：改这里即可替换昵称、简介、社交链接
export const profile = {
  name: "raine",
  tagline: "写代码，也写一点生活。",
  intro:
    "白天写前端，晚上写点没用的东西。喜欢干净的界面、缓慢的音乐，和在流言板上留下的一句句闲话。",
  location: "杭州",
  email: "hello@example.com",
  socials: [
    { label: "GitHub", href: "#" },
    { label: "X", href: "#" },
    { label: "Email", href: "mailto:hello@example.com" },
  ],
};

export const skills = ["React", "TypeScript", "Node.js", "CSS", "交互设计"];

export const timeline = [
  { year: "2025", title: "开始记录", desc: "把这个博客从一张草图变成线上页面。" },
  { year: "2023", title: "前端工程师", desc: "做设计系统与复杂交互，渐渐喜欢上克制的界面。" },
  { year: "2021", title: "第一份工作", desc: "写下了第一行真正上线的代码。" },
];

// 兴趣数据整理自我的 Notion「兴趣记录」：阅读 / 观影 / 游戏
export const interests = [
  {
    key: "reading",
    icon: "📖",
    title: "阅读",
    blurb: "漫画与故事，追更比读书勤快。",
    items: [
      { name: "一人之下", meta: "漫画", rating: 5, img: "interests/reading-1.webp", review: "设定够野，人物不装。冯宝宝那种天然呆、下手又极狠的反差最上头，民俗和门派那套底子铺得也扎实。", by: "raine" },
      { name: "魔都精兵のスレイブ", meta: "漫画", rating: 3, img: "interests/reading-2.webp", review: "打斗和福利都来得直接，节奏快，翻起来不费脑子，适合当消遣。", by: "raine" },
    ],
  },
  {
    key: "films",
    icon: "🎞️",
    title: "观影",
    blurb: "偏爱有点丧、又有点温柔的故事。",
    items: [
      {
        name: "无耻之徒 Shameless",
        meta: "人生 · 温情 · 观看中",
        rating: 5,
        img: "interests/films-2.webp",
        review: "活一天要爽一天。",
      },
      { name: "无职转生", meta: "剑与魔法 · 人生", rating: 5, img: "interests/films-3.webp", review: "把“重来一次”这件事拍得很认真，作画和世界观都舍得下本，人物一个个都长出了自己的样子。", by: "raine" },
      {
        name: "猜火车",
        meta: "电影",
        rating: 4,
        img: "interests/films-1.webp",
        review: "剧情很简单，看完之后没什么感悟。歌很好听，感觉整个片子就是一个巨长的 MV。",
      },
      { name: "凡人修仙传", meta: "修仙 · 人生", rating: 4, img: "interests/films-4.webp", review: "韩立那种能苟就苟、该狠就狠的活法看着踏实。打斗和建模在国漫里是头一档，修仙的规矩讲得很细。", by: "raine" },
      { name: "分裂 Split", meta: "恐怖 · 美国", rating: 3, img: "interests/films-7.webp", review: "一美一个人演出一整屋人，“野兽”那个设定很跳，可他演得让人信；结尾彩蛋串回《不死劫》很妙。", by: "raine" },
      {
        name: "恋如雨止",
        meta: "动画",
        rating: 2,
        img: "interests/films-6.webp",
        review: "看到了最后半小时，然后猜到结局了，就不想看了。",
      },
      { name: "溺水小刀", meta: "爱情 · 没看完", rating: 1, img: "interests/films-5.webp", review: "看不下去。" },
    ],
  },
  {
    key: "games",
    icon: "🎮",
    title: "游戏",
    blurb: "JRPG、ACT 和一点点 galgame。",
    items: [
      { name: "P5R", meta: "JRPG", rating: 5, img: "interests/games-9.webp", review: "美术和音乐是天花板，日常和迷宫的切换让人停不下来。皇家版把第三学期又铺开一层，收得挺完整。", by: "raine" },
      {
        name: "轮舞曲Duo-黎明的最强音",
        meta: "gal · PC",
        rating: 5,
        img: "interests/games-8.webp",
        review: "10 年前的伟大作品。最强替身使者——卡特琳娜。",
      },
      { name: "GTA5", meta: "RPG · STG", rating: 4, img: "interests/games-1.webp", review: "童年回忆，圣安地列斯。" },
      {
        name: "荒野乱斗",
        meta: "多人对战 · 手机",
        rating: 4,
        img: "interests/games-4.webp",
        review: "打野球队伍输了，下去休息的时候来两把。",
      },
      {
        name: "魔女之泉R",
        meta: "日本 · RPG",
        rating: 4,
        img: "interests/games-5.webp",
        review: "之前没玩过这种战斗系统，感觉很好玩。",
      },
      {
        name: "赛博朋克2077",
        meta: "RPG · STG · 已通关",
        rating: 3,
        img: "interests/games-2.webp",
        review:
          "需要用键鼠和手柄交换着玩，挺鸡肋的：打枪的时候用键鼠，过剧情和开车用手柄。第一次玩开了简单模式一直推主线，很快就做完了，主线太短；那时候还没有往日之影，也没有好结局，玩完之后挺难受的。",
      },
      {
        name: "明末渊虚之羽",
        meta: "中国 · 魂类",
        rating: 3,
        img: "interests/games-3.webp",
        review:
          "玩的第一款类魂，打击感很爽，但地图有点绕，不看攻略或者开挂有点玩不下去。人物模型很高清，动作却像古早网游，有点僵硬。风景很好看，打到鸟人居所就没有玩了。",
      },
      { name: "绝区零", meta: "ACT", rating: 3, img: "interests/games-11.webp", review: "战斗，爽。" },
      {
        name: "剑星",
        meta: "ACT",
        rating: 3,
        img: "interests/games-12.webp",
        review: "战斗系统比想象中好玩。平时玩绝区零多了，玩这个还挺顺手的。",
      },
      {
        name: "アマカノ3",
        meta: "gal · PC",
        rating: 3,
        img: "interests/games-10.webp",
        review:
          "玩的第一款 gal，到第一个选择点之前感觉全部都是神人，比如第一次见面就喊主人的，只能硬着头皮选了最贴近现实生活的纱由美线。缺点是太有沉浸感，毒品来的，看一半感觉不能再虚度青春了，看了一条线就不想碰其他线了。",
      },
      {
        name: "雨中冒险",
        meta: "STG · 肉鸽",
        rating: 2,
        img: "interests/games-6.webp",
        review: "玩了一会，感觉不是很感兴趣。",
      },
      { name: "灵魂面甲", meta: "SLG", rating: 2, img: "interests/games-7.webp", review: "驯服面具那套机制很上头，和朋友开荒能玩很久，把部落一点点养起来的过程很耐嚼。", by: "raine" },
    ],
  },
];

// 首页与流言板可选的兴趣标签
export const interestTags = [
  "漫画",
  "动画",
  "电影",
  "galgame",
  "JRPG",
  "ACT",
  "魂类",
  "肉鸽",
  "修仙",
  "科幻",
  "恐怖",
  "温情",
];
