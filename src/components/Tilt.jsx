import { useRef } from "react";

/**
 * 让卡片跟着鼠标轻微倾斜、浮起来。
 * 用 as 指定渲染成什么（button / a / Link），其余 props 透传。
 */
export default function Tilt({
  as: Tag = "div",
  className = "",
  max = 12,
  lift = 10,
  children,
  ...rest
}) {
  const ref = useRef(null);

  function onPointerMove(e) {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const ry = Math.max(-max, Math.min(max, px * max * 2.6));
    const rx = Math.max(-max, Math.min(max, -py * max * 2.6));
    el.style.transform = `perspective(760px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(
      2
    )}deg) translateY(-${lift}px)`;
  }

  function onPointerLeave() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`.trim()}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}
