# FLUX Image Generator (Cloudflare Workers)

一个基于 **Cloudflare Workers AI + FLUX-2-dev** 的 Web 文生图工具。  
无需前端框架、无需构建步骤，一个 `worker.js` 文件即可部署。

- 🌐 Web 界面直接生成图片
- 🖼️ 多种预设尺寸 + 自定义尺寸
- 🎛️ 可调 Steps / Guidance / Seed / Batch
- 🔐 内置访问密码（防止滥用）
- ⚡ 运行在 Cloudflare Workers，免服务器

---

## ✨ 特性

- 使用 **FLUX-2-dev（Black Forest Labs）** 文生图模型
- 原生 HTML / CSS / JavaScript
- 单文件 Worker，无依赖
- 不需要 API Key（Workers AI 自动注入）
- 图片生成完成后直接在页面显示
- 支持图片下载
- 适合 Demo / 内测 / 小规模分享

---

## 🧩 技术栈

- Cloudflare Workers
- Cloudflare Workers AI
- Model: `@cf/black-forest-labs/flux-2-dev`

---

## 🚀 快速开始

### 1. 前置条件

- 一个 Cloudflare 账号
- 已开启 **Workers** 和 **Workers AI**

---

### 2. 创建 Worker

进入 Cloudflare 控制台：

计算和 AI → Workers 和 Pages → 创建 → Worker

- 模板选择：**Hello World**
- Worker 名称任意

创建完成后进入在线编辑器。

---

### 3. 绑定 Workers AI（必须）

进入 Worker 设置：

Settings → Bindings → Add binding

配置：

- 类型：Workers AI
- 绑定名称：`AI`

保存。

---

### 4. 设置访问密码

进入：

Settings → Variables → Environment Variables

新增变量：

```
ACCESS_PASSWORD=你自己设置的密码
```

> 修改密码不需要重新部署

---

### 5. 部署代码

将本项目中的 `worker.js` 内容 **整体复制**，  覆盖 Worker 编辑器中的代码，点击 **Save and Deploy**。

部署完成后会得到一个访问地址，例如：

```
https://flux-image-generator.yourname.workers.dev
```

---

## 🖥️ 使用方法

1. 打开 Worker URL
2. 输入访问密码
3. 输入 Prompt（建议英文）
4. （可选）调整尺寸、Steps、Guidance 等参数
5. 点击 **生成图片**
6. 图片生成后直接显示在页面中
7. 点击「下载」保存图片

---

## 🎛️ 参数说明

| 参数            | 说明             | 建议       |
| --------------- | ---------------- | ---------- |
| Prompt          | 图片描述         | 英文、具体 |
| Negative Prompt | 不希望出现的内容 | 可选       |
| Size            | 图片尺寸         | 1024×1024  |
| Steps           | 推理步数         | 20–30      |
| Guidance        | 风格强度         | 6–8        |
| Seed            | 固定随机性       | 留空       |
| Batch           | 单次生成张数     | 1–4        |

---

## 🖼️ 尺寸支持

**预设尺寸**

- 512 × 512
- 768 × 768
- 1024 × 1024
- 1024 × 768（横向）
- 768 × 1024（纵向）

**自定义尺寸**

- Width / Height 可手动输入
- 最小：256
- 最大：1536

---

## 🔐 安全说明

- 访问密码在 **Worker 服务端校验**
- 前端无法绕过
- 密码错误不会触发 AI 调用
- 可有效防止被随意刷额度

---

## 💰 成本提示

费用与以下参数相关：

- 图片尺寸
- Steps
- Batch 数量

首次建议使用：

1024 × 1024
Steps = 25
Batch = 1

---

## ❓ 常见问题

**Q: 必须绑定 Workers AI 吗？**  
A: 是的，否则 `env.AI.run()` 无法使用。

**Q: 可以用 Cloudflare Pages 吗？**  
A: 可以，但推荐初次使用直接用 Worker。

**Q: 密码会被前端绕过吗？**  
A: 不会，密码在服务端校验。

---

## ⭐ 推荐用途

- Cloudflare Workers AI 学习示例
- FLUX 文生图 Demo
- 内部工具 / 创意实验
- 可 Fork、可二次开发

---

如果你觉得这个项目有用，欢迎 Star / Fork / PR！
