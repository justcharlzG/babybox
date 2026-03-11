# 带娃工具百宝箱 (Parenting Tool Chest)

这是一个为家长量身定制的带娃工具集合网页。它提供了一个左侧导航菜单，右侧通过 `iframe` 渲染具体的工具页面。

## 🌟 核心特性：灵活的菜单与页面添加机制

本项目设计了**无需重新编译代码即可添加新工具**的灵活机制。所有的菜单配置都外置在 `public/config.json` 中。由于该文件位于 `public` 目录，它会在运行时被动态加载。

### 如何添加新工具（以“儿童饮食”为例）

1. **添加 HTML 页面**
   在 `public/tools/` 目录下创建一个新的 HTML 文件，例如 `diet.html`。
   在这个文件里编写你需要的工具内容（支持引入外部的 CSS/JS，如 Tailwind CDN）。

2. **修改配置文件**
   打开 `public/config.json`，在数组中添加一个新的 JSON 对象：
   ```json
   {
     "id": "kids-diet",
     "title": "儿童饮食",
     "icon": "Utensils",
     "url": "/tools/diet.html"
   }
   ```
   *注：`icon` 字段支持 [Lucide React](https://lucide.dev/icons/) 中的所有图标名称。*

刷新页面，左侧菜单就会自动出现“儿童饮食”，点击即可在右侧加载 `diet.html`！

---

## 🛠️ 编译与安装说明

本项目基于 React 19 + Vite + Tailwind CSS 构建。

### 环境要求
- Node.js (建议 v18 或更高版本)
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 本地开发运行
```bash
npm run dev
```
运行后，在浏览器中访问 `http://localhost:3000` 即可预览。

### 编译打包
```bash
npm run build
```
执行后，会在项目根目录生成一个 `dist` 文件夹，里面包含了所有编译好的静态文件。

---

## 🚀 部署说明

由于本项目打包后是纯静态的前端页面（SPA + 静态 HTML 工具页），部署非常简单。

### 方式一：部署到静态托管服务（推荐）
你可以将 `dist` 目录下的所有文件直接上传到任何静态网站托管服务，例如：
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### 方式二：使用 Nginx 部署到自己的服务器
1. 将 `dist` 目录上传到服务器的某个目录，例如 `/var/www/parenting-tools`。
2. 配置 Nginx：
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/parenting-tools;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
3. 重启 Nginx 即可访问。

### 💡 动态更新说明（极其重要）
部署完成后，如果你想添加新的工具页面，**不需要重新执行 `npm run build`**。
你只需要：
1. 将新的 HTML 文件上传到服务器的 `tools/` 目录下。
2. 修改服务器根目录上的 `config.json` 文件。
3. 刷新浏览器，新菜单就会立即生效！
