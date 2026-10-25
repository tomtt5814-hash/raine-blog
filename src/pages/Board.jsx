import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { interestTags } from "../data/site.js";
import {
  addMessage,
  checkRateLimit,
  deleteMessage,
  listMessages,
  markPosted,
  validateMessage,
} from "../lib/store.js";
import Reveal from "../components/Reveal.jsx";

function timeText(iso) {
  return new Date(iso).toLocaleString("zh-CN", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Board() {
  const [params, setParams] = useSearchParams();
  const activeTag = params.get("tag") || "";

  const [messages, setMessages] = useState(() => listMessages());
  const [form, setForm] = useState({ nickname: "", content: "", email: "", tags: [] });
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [admin, setAdmin] = useState(false);
  const [askPwd, setAskPwd] = useState(false);
  const [pwd, setPwd] = useState("");
  const [fresh, setFresh] = useState("");

  const shown = useMemo(
    () =>
      activeTag
        ? messages.filter((m) => (m.interestTags || []).includes(activeTag))
        : messages,
    [messages, activeTag]
  );

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleTag = (tag) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));

  const flash = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2600);
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    const invalid = validateMessage(form);
    if (invalid) return setError(invalid);
    const wait = checkRateLimit();
    if (wait) return setError(`发得有点快，${wait} 秒后再来一条。`);

    const message = addMessage({ ...form, interestTags: form.tags });
    markPosted();
    setMessages((prev) => [message, ...prev]);
    setForm({ nickname: "", content: "", email: "", tags: [] });
    setFresh(message.id);
    flash("留言已发布，谢谢你的字。");
  };

  const toggleAdmin = () => {
    if (admin) {
      setAdmin(false);
      flash("管理员模式已关闭。");
      return;
    }
    setAskPwd((v) => !v);
    setError("");
  };

  const unlock = () => {
    if (pwd === (import.meta.env.VITE_ADMIN_PASSWORD || "admin")) {
      setAdmin(true);
      setAskPwd(false);
      setPwd("");
      setError("");
      flash("管理员模式已开启。");
    } else {
      setError("密码不对。");
    }
  };

  const remove = (id) => {
    setMessages(deleteMessage(id));
    flash("留言已删除。");
  };

  return (
    <>
      <section className="page-head container">
        <Reveal as="p" className="eyebrow">
          流言板
        </Reveal>
        <Reveal as="h1" delay={40}>
          说点什么。
        </Reveal>
        <Reveal as="p" className="lede" delay={80}>
          不用登录，留一句话就好。邮箱可以填，但不会公开。
        </Reveal>
      </section>

      <section className="container board-grid">
        <Reveal className="card form-card">
          <form onSubmit={submit} noValidate>
            <div className="row2">
              <label className="field">
                <span>昵称</span>
                <input
                  value={form.nickname}
                  onChange={update("nickname")}
                  maxLength={24}
                  placeholder="怎么称呼你"
                  autoComplete="nickname"
                />
              </label>
              <label className="field">
                <span>
                  邮箱 <em>可选，不公开</em>
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
            </div>

            <label className="field">
              <span>
                留言 <em>{form.content.length}/300</em>
              </span>
              <textarea
                value={form.content}
                onChange={update("content")}
                rows={5}
                maxLength={300}
                placeholder="最近在做什么、看了什么，或者只是打个招呼。"
              />
            </label>

            <div className="field">
              <span>
                兴趣标签 <em>可选</em>
              </span>
              <div className="tag-picker">
                {interestTags.map((t) => {
                  const on = form.tags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      className={"pick" + (on ? " on" : "")}
                      onClick={() => toggleTag(t)}
                      aria-pressed={on}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                发布留言
              </button>
              <button type="button" className="link-btn" onClick={toggleAdmin}>
                {admin ? "退出管理员" : "管理员"}
              </button>
            </div>

            {askPwd && !admin && (
              <div className="admin-row">
                <input
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      unlock();
                    }
                  }}
                  placeholder="管理员密码"
                  autoComplete="current-password"
                  aria-label="管理员密码"
                />
                <button type="button" className="btn btn-ghost btn-sm" onClick={unlock}>
                  确认
                </button>
              </div>
            )}
          </form>
        </Reveal>

        <div className="board-list">
          <div className="list-head">
            <h2>{activeTag ? `兴趣：${activeTag}` : "全部流言"}</h2>
            <span className="muted">{shown.length} 条</span>
          </div>

          {activeTag && (
            <div className="filter-bar">
              <span>只看「{activeTag}」相关的留言</span>
              <button type="button" onClick={() => setParams({})}>
                清除筛选
              </button>
            </div>
          )}

          {shown.length === 0 ? (
            <div className="card empty">
              <p>{activeTag ? "这个标签下还没有留言。" : "还没有留言，来写第一条吧。"}</p>
              {activeTag && (
                <button type="button" className="link-btn" onClick={() => setParams({})}>
                  查看全部
                </button>
              )}
            </div>
          ) : (
            shown.map((m, i) => (
              <Reveal key={m.id} delay={Math.min(i, 5) * 40}>
                <article className={"card msg-card" + (m.id === fresh ? " enter" : "")}>
                  <div className="msg-head">
                    <span className="avatar" aria-hidden="true">
                      {(m.nickname || "?").trim().slice(0, 1).toUpperCase()}
                    </span>
                    <div className="msg-who">
                      <p className="msg-name">{m.nickname}</p>
                      <p className="meta">{timeText(m.createdAt)}</p>
                    </div>
                    {admin && (
                      <button
                        type="button"
                        className="delete"
                        onClick={() => remove(m.id)}
                        aria-label={`删除 ${m.nickname} 的留言`}
                      >
                        删除
                      </button>
                    )}
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
            ))
          )}
        </div>
      </section>

      <div className={"toast" + (toast ? " show" : "")} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
