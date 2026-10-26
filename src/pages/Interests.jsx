import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { addNote, isMine, markNotePosted, noteCooldown, notesFor, removeNote, validateNote } from "../lib/notes";
import { interests } from "../data/site.js";
import { interestDetails } from "../data/interest-details.js";
import { mediaFor, bvid, ytId } from "../data/interest-media.js";
import { commentsFor } from "../data/interest-comments.js";
import Reveal from "../components/Reveal.jsx";
import { asset } from "../lib/asset.js";
import Tilt from "../components/Tilt.jsx";

function Stars({ n }) {
  return (    <span className="stars" aria-label={`${n} 星`}>
      {"★".repeat(n)}
      <span className="dim">{"★".repeat(5 - n)}</span>
    </span>
  );
}

function fmtNote(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getMonth() + 1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function detailFor(name) {  if (interestDetails[name]) return interestDetails[name];
  const key = Object.keys(interestDetails).find((k) =>
    name.toLowerCase().includes(k.toLowerCase())
  );
  return key ? interestDetails[key] : {};
}

function Detail({ item, onClose }) {
  const extra = detailFor(item.name);
  const media = mediaFor(item.name);
  const comments = commentsFor(item.name);
  const photos = [
    ...(item.img ? [asset(item.img)] : []),
    ...media.images.map((s) => asset(s)),
  ];
  const [zoom, setZoom] = useState(null);
  const [notes, setNotes] = useState(() => notesFor(item.name));
  const [form, setForm] = useState({ nickname: "", text: "" });
  const [noteErr, setNoteErr] = useState("");
  const [sent, setSent] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ x: 0, active: false, moved: false });

  const step = (delta) => {
    if (photos.length < 2 || zoom == null) return;
    setZoom((i) => (i + delta + photos.length) % photos.length);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (zoom != null) setZoom(null);
        else onClose();
      }
      if (zoom != null && photos.length > 1) {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, zoom, photos.length]);

  function onDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, active: true, moved: false };
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function onMove(e) {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 6) drag.current.moved = true;
    setDragX(dx);
  }

  function onUp() {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    if (photos.length > 1 && Math.abs(dragX) > 60) step(dragX < 0 ? 1 : -1);
    setDragX(0);
  }

  function retract(id) {
    removeNote(item.name, id);
    setNotes((list) => list.filter((n) => n.id !== id));
  }

  function submitNote(e) {
    e.preventDefault();
    const msg = validateNote(form);
    if (msg) return setNoteErr(msg);
    const wait = noteCooldown();
    if (wait) return setNoteErr(`刚发过一条，${wait} 秒后再来。`);
    const note = addNote(item.name, form);
    markNotePosted();
    setNotes((list) => [note, ...list]);
    setForm({ nickname: "", text: "" });
    setNoteErr("");
    setSent(true);
    window.setTimeout(() => setSent(false), 2200);
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="sheet-close" onClick={onClose} aria-label="关闭">
          ✕
        </button>
        <div className="sheet-scroll">
        <div className="sheet-grid">
          {item.img && (
            <button
              type="button"
              className="sheet-cover-btn"
              onClick={() => setZoom(0)}
              aria-label="查看大图"
            >
              <img className="sheet-cover" src={asset(item.img)} alt={item.name} />
            </button>
          )}
          <div className="sheet-body">
            <p className="meta">{item.meta}</p>
            <h2>{item.name}</h2>
            <div className="sheet-stars">
              <Stars n={item.rating} />
              <span className="muted small">{item.rating} / 5</span>
            </div>

            {extra.fields?.length > 0 && (
              <dl className="sheet-fields">
                {extra.fields.map((f) => (
                  <div key={f.k}>
                    <dt>{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="msg msg-raine">
              <p className="msg-label">
                <span className="msg-dot" />
                {item.by === "raine" ? "raine" : "tianming"} 的留言
              </p>
              <p className="msg-text">{item.review || "无"}</p>
            </div>

            {comments.length > 0 && (
              <div className="msg-list">
                {comments.map((c, i) => (
                  <div className="msg msg-tianming" key={i}>
                    <div className="msg-head">
                      <span className="avatar small-avatar" aria-hidden="true">T</span>
                      <strong>tianming</strong>
                      <span className="muted small">{c.at}</span>
                    </div>
                    {/^https?:\/\//.test(c.text) ? (
                      <a className="link" href={c.text} target="_blank" rel="noreferrer">
                        {c.text}
                      </a>
                    ) : (
                      <p className="msg-text">{c.text}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {extra.link && (
              <a className="btn btn-ghost sheet-link" href={extra.link} target="_blank" rel="noreferrer">
                打开链接 ↗
              </a>
            )}
          </div>
        </div>

        <div className="note-block">
          <p className="note-title">
            看过、玩过的人也可以留一句
            {notes.length > 0 && <span className="muted small"> · {notes.length} 条</span>}
          </p>

          {notes.length > 0 && (
            <div className="msg-list">
              {notes.map((n) => (
                <div className="msg msg-visitor" key={n.id}>
                  <div className="msg-head">
                    <span className="avatar small-avatar" aria-hidden="true">
                      {n.nickname.slice(0, 1).toUpperCase()}
                    </span>
                    <strong>{n.nickname}</strong>
                    <span className="muted small">{fmtNote(n.at)}</span>
                    {isMine(n.id) && (
                      <button
                        type="button"
                        className="note-retract"
                        onClick={() => retract(n.id)}
                      >
                        撤回
                      </button>
                    )}
                  </div>
                  <p className="msg-text">{n.text}</p>
                </div>
              ))}
            </div>
          )}

          <form className="note-form" onSubmit={submitNote}>
            <input
              className="note-name"
              value={form.nickname}
              maxLength={24}
              placeholder="昵称，可不填"
              onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
            />
            <textarea
              className="note-text"
              value={form.text}
              maxLength={300}
              rows={2}
              placeholder="想对这部作品说点什么？"
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            />
            <button className="btn btn-primary note-submit" type="submit">
              发一条
            </button>
            <p className={"note-hint" + (noteErr ? " is-error" : "")}>
              {noteErr || (sent ? "记下了，谢谢。" : `${form.text.length} / 300`)}
            </p>
          </form>
        </div>

        {(media.images.length > 0 || media.embeds.length > 0) && (
          <div className="sheet-media">
            {media.images.length > 0 && (
              <div className="sheet-gallery">
                {media.images.map((src, i) => (
                  <button
                    type="button"
                    className="gallery-item"
                    key={src}
                    onClick={() => setZoom((item.img ? 1 : 0) + i)}
                    aria-label={`查看大图：${item.name} 截图`}
                  >
                    <img src={asset(src)} alt={`${item.name} 截图`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
            {media.embeds.map((embed) => (
              <div className="sheet-video" key={embed.url}>
                {embed.title && <p className="sheet-video-title">{embed.title}</p>}
                <iframe
                  src={
                    embed.provider === "youtube"
                      ? `https://www.youtube.com/embed/${ytId(embed.url)}?rel=0`
                      : `https://player.bilibili.com/player.html?bvid=${bvid(embed.url)}&autoplay=0`
                  }
                  title={embed.title || `${item.name} 相关视频`}
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {zoom != null &&
        createPortal(
          <div
            className="lightbox"
            role="dialog"
            aria-label="大图"
            onClick={(e) => {
              e.stopPropagation();
              if (!drag.current.moved) setZoom(null);
              drag.current.moved = false;
            }}
          >
          <div
            className="lightbox-stage"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <img
              src={photos[zoom]}
              alt={item.name}
              draggable={false}
              style={{
                transform: dragX ? `translateX(${dragX}px)` : undefined,
                transition: dragging ? "none" : "transform 220ms var(--ease)",
              }}
            />
          </div>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="lightbox-nav prev"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="上一张"
              >
                ‹
              </button>
              <button
                type="button"
                className="lightbox-nav next"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="下一张"
              >
                ›
              </button>
              <span className="lightbox-count">
                {zoom + 1} / {photos.length}
              </span>
            </>
          )}

          <span className="lightbox-hint">
            {photos.length > 1 ? "左右拖动切换，点击空白处关闭" : "点击任意处关闭"}
          </span>
          </div>,
          document.body
        )}
    </div>
  );
}

export default function Interests() {
  const total = interests.reduce((sum, g) => sum + g.items.length, 0);
  const [active, setActive] = useState(null);

  return (
    <>
      <section className="page-head container">
        <Reveal as="p" className="eyebrow">
          兴趣
        </Reveal>
        <Reveal as="h1" delay={40}>
          看过的，玩过的。
        </Reveal>
        <Reveal as="p" className="lede" delay={80}>
          tianming 读过、看过、玩过的东西，{total} 条，评价都是当时随手写的。点开卡片看全文。
        </Reveal>
      </section>

      <section className="container section interests">
        {interests.map((group) => (
          <Reveal className="interest-group" key={group.key}>
            <div className="interest-head">
              <span className="interest-icon" aria-hidden="true">
                {group.icon}
              </span>
              <div>
                <h3>{group.title}</h3>
                <p className="muted">{group.blurb}</p>
              </div>
              <span className="muted small interest-count">{group.items.length} 项</span>
            </div>
            <div className="grid grid-2 interest-items">
              {group.items.map((item) => (
                <Tilt
                  as="button"
                  type="button"
                  className="card interest-item"
                  key={item.name}
                  onClick={() => setActive(item)}
                >
                  {item.img && (
                    <img
                      className="interest-thumb"
                      src={asset(item.img)}
                      alt={item.name}
                      loading="lazy"
                      width="64"
                      height="86"
                    />
                  )}
                  <div className="interest-body">
                    <h4 className="interest-name">{item.name}</h4>
                    <div className="interest-sub">
                      <Stars n={item.rating} />
                    </div>
                    <p className="meta">{item.meta}</p>
                    {item.review ? <p className="interest-review">{item.review}</p> : null}
                  </div>
                </Tilt>
              ))}
            </div>
          </Reveal>
        ))}
      </section>

      {active && <Detail item={active} onClose={() => setActive(null)} />}
    </>
  );
}
