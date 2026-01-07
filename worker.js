export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ===== UI =====
    if (request.method === "GET") {
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // ===== Generate =====
    if (request.method === "POST" && url.pathname === "/generate") {
      const form = await request.formData();

      if (form.get("password") !== env.ACCESS_PASSWORD) {
        return Response.json({ error: "访问密码错误" }, { status: 403 });
      }

      const prompt = form.get("prompt");
      if (!prompt) {
        return Response.json({ error: "Prompt 不能为空" }, { status: 400 });
      }

      const negative = form.get("negative_prompt") || "";
      const steps = form.get("steps") || "25";
      const guidance = form.get("guidance") || "7.5";
      const seed = form.get("seed") || "";
      const batch = Number(form.get("batch") || 1);

      let width = Number(form.get("width") || 1024);
      let height = Number(form.get("height") || 1024);

      width = Math.min(Math.max(width, 256), 1536);
      height = Math.min(Math.max(height, 256), 1536);

      const images = [];

      for (let i = 0; i < batch; i++) {
        const aiForm = new FormData();
        aiForm.append("prompt", prompt);
        if (negative) aiForm.append("negative_prompt", negative);
        aiForm.append("steps", steps);
        aiForm.append("guidance", guidance);
        aiForm.append("width", width);
        aiForm.append("height", height);
        if (seed) aiForm.append("seed", seed);

        const dummyReq = new Request("http://dummy", {
          method: "POST",
          body: aiForm,
        });

        const result = await env.AI.run(
          "@cf/black-forest-labs/flux-2-dev",
          {
            multipart: {
              body: dummyReq.body,
              contentType:
                dummyReq.headers.get("content-type") ||
                "multipart/form-data",
            },
          }
        );

        if (result?.image) images.push(result.image);
      }

      return Response.json({ images });
    }

    return new Response("Not Found", { status: 404 });
  },
};

// ================= UI =================

const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>FLUX Image Generator</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
:root{
  --bg:#0b1020;
  --panel:#111827;
  --card:#020617;
  --border:#1e293b;
  --primary:#6366f1;
  --text:#e5e7eb;
  --muted:#94a3b8;
}
*{box-sizing:border-box}
body{
  margin:0;
  background:var(--bg);
  color:var(--text);
  font-family:system-ui,-apple-system;
}
.container{
  max-width:1100px;
  margin:auto;
  padding:24px;
}
header{
  margin-bottom:24px;
}
h1{
  margin:0 0 6px;
  font-size:26px;
}
.subtitle{
  color:var(--muted);
  font-size:13px;
}
.panel{
  background:var(--panel);
  border-radius:18px;
  padding:20px;
  box-shadow:0 20px 40px rgba(0,0,0,.4);
}
.group{margin-bottom:14px}
label{
  display:block;
  font-size:13px;
  color:var(--muted);
  margin-bottom:6px;
}
textarea,input,select{
  width:100%;
  padding:10px;
  background:var(--card);
  border:1px solid var(--border);
  border-radius:10px;
  color:var(--text);
}
textarea{min-height:90px}
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
  gap:12px;
}
.inline{
  display:grid;
  grid-template-columns:2fr 1fr 1fr;
  gap:12px;
}
button{
  margin-top:8px;
  width:100%;
  padding:14px;
  border:none;
  border-radius:14px;
  background:var(--primary);
  color:white;
  font-size:16px;
  cursor:pointer;
}
button:disabled{opacity:.6}
.images{
  margin-top:24px;
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
  gap:16px;
}
.image-card{
  background:var(--card);
  padding:10px;
  border-radius:14px;
}
.image-card img{
  width:100%;
  border-radius:10px;
}
.image-card a{
  display:block;
  margin-top:8px;
  text-align:center;
  color:#93c5fd;
  font-size:13px;
}
.status{
  text-align:center;
  color:var(--muted);
  margin:16px 0;
}
</style>
</head>
<body>

<div class="container">

<header>
  <h1>FLUX Image Generator</h1>
  <div class="subtitle">Simple · Clean · Powered by FLUX-2-dev</div>
</header>

<form id="form" class="panel">

<div class="group">
  <label>访问密码</label>
  <input type="password" name="password" required>
</div>

<div class="group">
  <label>Prompt</label>
  <textarea name="prompt" placeholder="A cinematic cyberpunk city at night..." required></textarea>
</div>

<div class="group">
  <label>Negative Prompt（可选）</label>
  <textarea name="negative_prompt" placeholder="low quality, blurry, bad anatomy"></textarea>
</div>

<div class="group grid">
  <div>
    <label>尺寸</label>
    <select id="preset">
      <option value="1024x1024">1024 × 1024（推荐）</option>
      <option value="768x768">768 × 768</option>
      <option value="512x512">512 × 512</option>
      <option value="1024x768">1024 × 768（横向）</option>
      <option value="768x1024">768 × 1024（纵向）</option>
      <option value="custom">自定义</option>
    </select>
  </div>
  <div>
    <label>Width</label>
    <input type="number" name="width" value="1024">
  </div>
  <div>
    <label>Height</label>
    <input type="number" name="height" value="1024">
  </div>
</div>

<div class="group grid">
  <div>
    <label>Steps</label>
    <input type="number" name="steps" value="25">
  </div>
  <div>
    <label>Guidance</label>
    <input type="number" name="guidance" value="7.5" step="0.5">
  </div>
  <div>
    <label>Seed（可空）</label>
    <input type="number" name="seed">
  </div>
  <div>
    <label>Batch</label>
    <select name="batch">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
    </select>
  </div>
</div>

<button id="btn">生成图片</button>
</form>

<div id="status" class="status"></div>
<div id="images" class="images"></div>

</div>

<script>
const form=document.getElementById("form");
const btn=document.getElementById("btn");
const status=document.getElementById("status");
const images=document.getElementById("images");
const preset=document.getElementById("preset");

preset.onchange=()=>{
  if(preset.value!=="custom"){
    const [w,h]=preset.value.split("x");
    form.width.value=w;
    form.height.value=h;
  }
};

form.onsubmit=async e=>{
  e.preventDefault();
  btn.disabled=true;
  images.innerHTML="";
  status.textContent="生成中，请稍候…";

  const res=await fetch("/generate",{method:"POST",body:new FormData(form)});
  const data=await res.json();

  btn.disabled=false;
  status.textContent="";

  if(!data.images){
    status.textContent=JSON.stringify(data,null,2);
    return;
  }

  data.images.forEach((img,i)=>{
    const d=document.createElement("div");
    d.className="image-card";
    d.innerHTML=\`
      <img src="data:image/png;base64,\${img}">
      <a download="flux-\${i}.png" href="data:image/png;base64,\${img}">下载</a>
    \`;
    images.appendChild(d);
  });
};
</script>

</body>
</html>
`;
