const express = require('express')
const multer  = require('multer')
const Minio = require('minio')
const path = require('path')
const fs = require('fs')

const upload = multer({ dest: './tmp/' })
upload.limits = {
    fileSize: 10 * 1024 * 1024 // 最大 10MB
}

const app = express()

// minio 客户端
const minioClient = new Minio.Client({
    endPoint: 'xxxxx',
    port: 80,
    useSSL: false,
    accessKey: 'xxxx',
    secretKey: 'xxxxx'
});

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

app.post('/', upload.single('file'), function(req, res, next) {
    // 检查 token
    // header example with get
    const token = req.get('token')
    if (token !== 'xxxxx') {
        return handleError('', res)
    }
    // 文件临时存储文件夹
    const {originalname, path: tmpPath} = req.file
    // 文件后缀
    const extname = path.extname(originalname).toLowerCase()

    if (['.png', '.jpg', '.jpeg', '.gif'].indexOf(extname) !== -1) {
        // minio 中保存的文件名
        const filePath =  `${tmpPath}.${extname}`
        // 获取月份
        const today = new Date()
        const month = today.getMonth() + 1
        const year = today.getFullYear()
        // 重命名文件
        fs.rename(tmpPath, filePath,  err => {
            if (err) return handleError(err, res)
            // 上传指 minio 中
            minioClient.fPutObject("resource", `img/${year}/${month}/${originalname}`, filePath, {
                'Content-Type': `image/${extname.split('.')[1]}`,
            }, async () => {
                await fs.unlink(filePath, function() {})
                res.json({
                    "data": `http://xxxxx/resource/img/${year}/${month}/${originalname}`
                })
            })
        });
    } else {
        // 删除文件
        fs.unlink(tmpPath, err => {
            if (err) return handleError(err, res);
        })
        res.status(403).contentType("text/plain").end("Only img files are allowed!");
    }
})

app.listen(3002, () => {
    console.log("app listening on port 3002")
})