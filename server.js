const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { imageSize } = require("image-size"); // ✅ 引入 image-size

const TCloud = require("tencentcloud-sdk-nodejs-ocr");
const dotenv = require("dotenv");
const app = express();
const port = 4000;

const conf = dotenv.config().parsed;

// ejs 模板引擎
app.set("view engine", "ejs");

// 上传目录
const upload = multer({ dest: "uploads/" });

// 腾讯云 OCR 客户端
const OcrClient = TCloud.ocr.v20181119.Client;
const client = new OcrClient({
  credential: {
    secretId: conf.TENCENT_SECRET_ID,
    secretKey: conf.TENCENT_SECRET_KEY,
    signMethod: "TC3-HMAC-SHA256",
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "ocr.tencentcloudapi.com",
    },
  },
});

// 首页
app.get("/", (req, res) => {
  res.render("index", { result: null });
});

// 上传处理
app.post("/upload", upload.single("image"), async (req, res) => {
  const imagePath = req.file.path;
  const base64 = fs.readFileSync(imagePath, { encoding: "base64" });

  const buffer = fs.readFileSync(imagePath);

  const dimensions = imageSize(buffer);

  // ✅ 获取图片尺寸
  const originalImageWidth = dimensions.width;

  const params = {
    ImageBase64: base64,
  };

  try {
    const data = await client.GeneralBasicOCR(params);
    const textList = data.TextDetections;

    res.render("index", {
      result: textList,
      imageBase64: base64,
      originalImageWidth, // ✅ 传给模板
    });
  } catch (err) {
    console.error("OCR error:", err);
    res.status(500).send("识别失败");
  } finally {
    fs.unlinkSync(imagePath); // 删除临时图片
  }
});

app.listen(port, () => {
  console.log(`服务已启动：http://localhost:${port}`);
});
