import { useEffect, useRef, useState } from "react";

// 右下角悬浮 BGM 开关：形态参考绝区零官网——黑色圆形玻璃钮 + 细白描边 + 白色双音符。
// 点击播放/暂停《Everything I Am》；组件挂在 App 根部，切页面不重建，播放状态延续。
// 换成自己的完整版：把文件放进 public/audio/，改下面的 TRACK 即可。
const TRACK = "/audio/everything-i-am-preview.m4a";

export default function BgmPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState("");
  const [hintReady, setHintReady] = useState(false);
  const [hintClosed, setHintClosed] = useState(false);
  const timer = useRef(0);

  // 每次打开/刷新都重新来一遍：延迟 1.4 秒淡入，没人理就 14 秒后自己走
  useEffect(() => {
    const show = window.setTimeout(() => setHintReady(true), 1400);
    const hide = window.setTimeout(() => setHintClosed(true), 14000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    audio.loop = true;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => {
      setPlaying(false);
      setNotice("音频加载失败，检查 public/audio/ 下的文件");
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      window.clearTimeout(timer.current);
    };
  }, []);

  const flash = (text) => {
    setNotice(text);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(""), 4200);
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch {
      flash("浏览器拦截了播放，再点一次试试");
    }
  };

  return (
    <>
      <button
        type="button"
        className={"bgm" + (playing ? " is-playing" : "")}
        onClick={toggle}
        aria-label={playing ? "暂停 BGM" : "播放 BGM"}
        aria-pressed={playing}
      >
        <span className="bgm-disc" aria-hidden="true">
          <span className="bgm-ring" />
          {playing ? (
            <span className="bgm-eq">
              <i />
              <i />
              <i />
              <i />
            </span>
          ) : (
            <svg className="bgm-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9.4 17.4V6.4l9-1.6v9.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="6.8" cy="17.4" r="2.6" fill="currentColor" />
              <circle cx="15.8" cy="15.8" r="2.6" fill="currentColor" />
            </svg>
          )}
        </span>
        <span className="bgm-tip">{playing ? "暂停 BGM" : "播放 BGM"}</span>
      </button>

      {hintReady && !hintClosed && !playing && (
        <div className="bgm-hint" role="note">
          <span className="bgm-hint-line">想听点什么吗</span>
          <span className="bgm-hint-sub">点这里，有段很轻的音乐</span>
        </div>
      )}

      {notice && (
        <p className="bgm-notice" role="status">
          {notice}
        </p>
      )}

      <audio ref={audioRef} src={TRACK} preload="metadata" />
    </>
  );
}
