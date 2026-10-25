import { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import BgmPlayer from "./components/BgmPlayer.jsx";
import Home from "./pages/Home.jsx";
import Interests from "./pages/Interests.jsx";
import Board from "./pages/Board.jsx";
import Placeholder from "./pages/Placeholder.jsx";

function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light"
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* 隐私模式下忽略 */
    }
  }, [theme]);
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return [theme, toggle];
}

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const location = useLocation();
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 夜晚模式才挂视频；系统要求减少动态效果时不挂
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setShowVideo(theme === "dark" && !mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [theme]);

  // 滚过首屏、切到后台就停掉解码，只剩一帧
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let raf = 0;
    const sync = () => {
      const far = window.scrollY > window.innerHeight * 1.6;
      if (document.hidden || far) video.pause();
      else video.play().catch(() => {});
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [showVideo]);

  return (
    <>
      <div className="bg" aria-hidden="true">
        {showVideo && (
          <video
            ref={videoRef}
            className="bg-video"
            src="/video/aurora-loop.mp4"
            poster="/video/aurora-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            tabIndex={-1}
          />
        )}
        <span className="blob b1" />
        <span className="blob b2" />
      </div>

      <Nav theme={theme} onToggleTheme={toggleTheme} />

      <main className="route" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/about" element={<Navigate to="/interests" replace />} />
          <Route path="/board" element={<Board />} />
          <Route
            path="/articles"
            element={<Placeholder title="文章" note="文章列表、详情与 Markdown 渲染会在阶段 2 上线。" />}
          />
          <Route
            path="*"
            element={<Placeholder title="页面走丢了" note="这条链接不存在，回首页看看吧。" />}
          />
        </Routes>
      </main>

      <Footer />
      <BgmPlayer />
    </>
  );
}
