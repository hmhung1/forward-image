const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const generateRandomId = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
};

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const id = generateRandomId();
        const ext = path.extname(file.originalname);
        cb(null, id + ext);
    }
});
const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Vui lòng chọn file!" });
    res.json({
        message: "Upload thành công!",
        id: req.file.filename.split(".")[0],
        fileUrl: `/uploads/${req.file.filename}`
    });
});

app.get("/image/:id", (req, res) => {
    const id = req.params.id;
    const files = fs.readdirSync("uploads");
    const file = files.find(f => f.startsWith(id));
    
    if (!file) return res.status(404).json({ message: "Không tìm thấy ảnh!" });

    res.json({ fileUrl: `/uploads/${file}` });
});

app.listen(PORT, () => {
    console.log(`ok`);
});