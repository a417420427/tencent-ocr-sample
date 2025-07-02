# OCR 上传识别 Demo（基于 Node.js + 腾讯云 OCR）

这是一个简单的 Web 应用，支持用户上传图片，使用 **腾讯云 OCR 服务**进行文字识别，并以框选方式在网页上高亮显示识别到的文字区域。

## 🧰 技术栈

- Node.js + Express
- EJS 模板引擎
- Multer (处理图片上传)
- Tencent Cloud OCR SDK
- image-size (用于获取图片宽度)
- 原生 HTML/CSS/JS（展示识别结果）

---

## 📦 安装依赖

```bash
npm install
```


## 🛠️ 环境变量配置
请在根目录下创建 .env 文件，内容如下：

``` bash
TENCENT_SECRET_ID=你的腾讯云SecretId
TENCENT_SECRET_KEY=你的腾讯云SecretKey
```
你可以在 [腾讯云 API 密钥管理](https://console.cloud.tencent.com/cam/capi) 页面获取这些信息。

## 🚀 启动服务
```bash
node server.js
```


## 📤 使用方式

1. 打开浏览器访问 http://localhost:4000

2. 上传一张图片（推荐包含中文或英文文本）

3. 点击“上传并识别”

4. 页面将展示：

 - 原图（左侧）

 - OCR 识别框（右侧，含检测文字与位置）

## [在线效果](https://secretclubscn.com/ocr-server/)


## 附nginx配置 
```Nginx
 location /ocr-server/ {
    proxy_pass http://localhost:8787/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 50M;
}
```

.env中basePath 设置成 /ocr-server