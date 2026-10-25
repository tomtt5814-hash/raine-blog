import { Link } from "react-router-dom";

export default function Placeholder({ title, note }) {
  return (
    <section className="container page-head">
      <p className="eyebrow">即将上线</p>
      <h1>{title}</h1>
      <p className="lede">{note}</p>
      <div className="actions">
        <Link className="btn btn-primary" to="/">
          回到首页
        </Link>
        <Link className="btn btn-ghost" to="/board">
          去流言板坐坐
        </Link>
      </div>
    </section>
  );
}
