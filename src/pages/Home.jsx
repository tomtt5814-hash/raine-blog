import { Link } from "react-router-dom";
import { articles } from "../data/articles.js";
import { interestTags, profile } from "../data/site.js";
import { listMessages } from "../lib/store.js";
import Reveal from "../components/Reveal.jsx";
import Tilt from "../components/Tilt.jsx";

function shortDate(iso) {
  return new Date(iso).toLocaleDateString("zh-CN", { month: "long", day: "numeric" });
}

function initial(name) {
  return (name || "?").trim().slice(0, 1).toUpperCase();
}

export default function Home() {
  const latest = listMessages().slice(0, 3);

  return (
    <>
      <section className="hero container">
        <Reveal as="p" className="eyebrow">
          个人博客 · 2025
        </Reveal>
        <Reveal as="h1" delay={40}>
          {profile.name} 在这里。
        </Reveal>
        <Reveal as="p" className="lede" delay={90}>
          屋里都收拾好了。
          <br />
          看过的、玩过的归在这儿，想说什么就往流言板上写一句。
        </Reveal>
        <Reveal className="actions" delay={140}>
          <Link className="btn btn-primary" to="/articles">
            进入博客
          </Link>
          <Link className="btn btn-ghost" to="/board">
            写下一条流言
          </Link>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal className="section-head">
          <h2>精选文章</h2>
          <Link className="more" to="/articles">
            全部文章 →
          </Link>
        </Reveal>
        <div className="grid grid-3">
          {articles.map((a, i) => (
            <Reveal key={a.id} delay={i * 60}>
              <Tilt as={Link} className="card article-card" to="/articles">
                <div className={"cover " + a.cover} aria-hidden="true">
                  <span>{a.tags[0]}</span>
                </div>
                <div className="article-body">
                  <p className="meta">
                    {a.publishedAt} · {a.readTime} 分钟
                  </p>
                  <h3>{a.title}</h3>
                  <p className="summary">{a.summary}</p>
                  <div className="tags">
                    {a.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section">
        <Reveal className="section-head">
          <h2>最新流言</h2>
          <Link className="more" to="/board">
            去流言板 →
          </Link>
        </Reveal>
        <div className="grid grid-3">
          {latest.map((m, i) => (
            <Reveal key={m.id} delay={i * 60}>
              <article className="card msg-card">
                <div className="msg-head">
                  <span className="avatar" aria-hidden="true">
                    {initial(m.nickname)}
                  </span>
                  <div>
                    <p className="msg-name">{m.nickname}</p>
                    <p className="meta">{shortDate(m.createdAt)}</p>
                  </div>
                </div>
                <p className="msg-text">{m.content}</p>
                {m.interestTags?.length > 0 && (
                  <div className="tags">
                    {m.interestTags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section">
        <Reveal className="section-head">
          <h2>兴趣</h2>
          <Link className="more" to="/interests">
            看看全部 →
          </Link>
        </Reveal>
        <Reveal className="chips">
          {interestTags.map((t) => (
            <Link className="chip" key={t} to={"/board?tag=" + encodeURIComponent(t)}>
              {t}
            </Link>
          ))}
        </Reveal>
      </section>
    </>
  );
}
