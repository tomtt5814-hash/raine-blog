// 静态资源路径：兼容部署在根目录和直接双击 dist/index.html 打开
export const asset = (path) =>
  import.meta.env.BASE_URL + String(path).replace(/^\/+/, "");
