const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");

const app = express();

// ======================
// MIDDLEWARES
// ======================
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "ga7_secret",
    resave: false,
    saveUninitialized: false
}));

// ======================
// MYSQL
// ======================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "archio_general_ga7"
});

db.connect(err => {
    if (err) {
        console.error("❌ Error MySQL", err);
        return;
    }
    console.log("✅ Conectado a MySQL");
});

// ======================
// AUTH
// ======================
function auth(req, res, next) {
    if (!req.session.user) return res.redirect("/");
    next();
}

// ======================
// LOGIN
// ======================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});

app.post("/login", (req, res) => {
    const { usuario, password } = req.body;

    const sql = "SELECT * FROM usuarios WHERE usuario=? AND password=?";
    db.query(sql, [usuario, password], (err, results) => {
        if (err) return res.send("Error servidor");
        if (results.length === 0) return res.send("Usuario o contraseña incorrectos");

        const user = results[0];
        req.session.user = user;

        if (user.rol === "admin") return res.redirect("/index");

        const dep = Number(user.dependencia_id);
        if (dep === 1) return res.redirect("/talento_humano");
        if (dep === 2) return res.redirect("/inteligencia");
        if (dep === 3) return res.redirect("/operaciones");
        if (dep === 4) return res.redirect("/logistica");

        res.redirect("/");
    });
});

// ======================
// MULTER (SUBIDA)
// ======================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const user = req.session.user;
        let carpeta = "";

        if (user.rol === "admin") {
            carpeta = req.body.departamento;
        } else {
            const dep = Number(user.dependencia_id);
            if (dep === 1) carpeta = "talento_humano";
            if (dep === 2) carpeta = "inteligencia";
            if (dep === 3) carpeta = "operaciones";
            if (dep === 4) carpeta = "logistica";
        }

        const ruta = path.join(__dirname, "uploads", carpeta);
        if (!fs.existsSync(ruta)) fs.mkdirSync(ruta, { recursive: true });

        cb(null, ruta);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ======================
// SUBIR DOCUMENTO ✅
// ======================
app.post("/subir_documento", auth, upload.single("archivo"), (req, res) => {
    const user = req.session.user;
    const { tipo_documento_id, fecha_documento } = req.body;

    let departamento = "";
    const dep = Number(user.dependencia_id);
    if (dep === 1) departamento = "talento_humano";
    if (dep === 2) departamento = "inteligencia";
    if (dep === 3) departamento = "operaciones";
    if (dep === 4) departamento = "logistica";

    const sql = `
        INSERT INTO documentos 
        (departamento, tipo_documento_id, nombre_archivo, ruta_archivo, fecha_documento, usuario_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        departamento,
        tipo_documento_id,
        req.file.filename,
        req.file.path,
        fecha_documento,
        user.id
    ], (err) => {
        if (err) {
            console.error(err);
            return res.send("❌ Error al guardar documento");
        }

        res.send("✅ Documento subido correctamente");
    });
});

// ======================
// VISTAS
// ======================
app.get("/index", auth, (req, res) => {
    if (req.session.user.rol !== "admin") return res.redirect("/");
    res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.get("/talento_humano", auth, (req, res) => {
    res.sendFile(path.join(__dirname, "public/views/Talento_Humano.html"));
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
});

// ======================
app.listen(3000, () => {
    console.log("🚀 Servidor en http://localhost:3000");
});
