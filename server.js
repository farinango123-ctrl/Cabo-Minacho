const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const app = express();

// ======================
// CONFIGURACIÓN DE MIDDLEWARES
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: "ga7_secret_key_2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // 1 hora
      secure: false, // true solo con HTTPS
    },
  })
);

// ======================
// CONEXIÓN A BASE DE DATOS
// ======================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "archio_general_ga7",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error de conexión a MySQL:", err);
    return;
  }
  console.log("✅ Conexión establecida con la Base de Datos GA7");
});

// ======================
// MIDDLEWARES DE SEGURIDAD
// ======================

function auth(req, res, next) {
  if (!req.session.user) return res.redirect("/");
  next();
}

function onlyAdmin(req, res, next) {
  const user = req.session.user;
  if (!user) return res.status(401).json({ success: false, message: "No autenticado" });

  // Si quieres separar: "superadmin" y "admin"
  if (user.rol !== "admin" && user.rol !== "superadmin") {
    return res.status(403).json({ success: false, message: "Sin permisos" });
  }
  next();
}

function permisoDependencia(idPermitido) {
  return (req, res, next) => {
    const user = req.session.user;

    if (user.rol === "admin" || user.rol === "superadmin") return next();

    if (Number(user.dependencia_id) === idPermitido) return next();

    console.log(`🚫 Bloqueado: ${user.usuario} intentó entrar a dependencia ${idPermitido}`);
    return res.redirect("/home");
  };
}

// ======================
// HELPERS
// ======================
function folderByDepId(depId) {
  const folders = {
    1: "talento_humano",
    2: "inteligencia",
    3: "operaciones",
    4: "logistica",
  };
  return folders[depId] || "otros";
}

function generarClaveTemporal() {
  // fuerte y corta (sin caracteres raros)
  return crypto.randomBytes(9).toString("base64url"); // ~12 chars
}

function passwordFuerte(pw) {
  return (
    typeof pw === "string" &&
    pw.length >= 10 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw)
  );
}

function isBcryptHash(value) {
  return typeof value === "string" && (value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$"));
}

// ======================
// SISTEMA DE AUTENTICACIÓN (LOGIN)
// ======================
// Entrega el Login al entrar a la raíz o a /login
app.get(["/", "/login"], (req, res) => {
    res.sendFile(path.join(__dirname, "public","login.html"));
});

// Entrega el Index (Panel Principal)
app.get("/index", auth, onlyAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, "public","views", "index.html"));
});
// Ruta Cambiar Clave
app.get("/cambiar_clave", auth, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "views", "CambiarClave.html"));
});
app.post("/login", (req, res) => {
  const { usuario, password } = req.body;
  const sql = "SELECT * FROM usuarios WHERE usuario = ? LIMIT 1";

  db.query(sql, [usuario], async (err, results) => {
    try {
      if (err) return res.status(500).json({ success: false, message: "Error en el servidor" });
      
      // ✅ Mensaje genérico: Esto permite que el HTML ejecute el borrado de campos
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
      }

      const user = results[0];
      const esHash = isBcryptHash(user.password);
      let esValida = esHash ? await bcrypt.compare(password, user.password) : (password === user.password);

      if (!esValida) {
        // ✅ Si falla la clave, mandamos este JSON para que el script limpie los cuadros
        return res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
      }

      // Migración a hash (Mantenemos tu lógica intacta)
      if (esValida && !esHash) {
        const nuevoHash = await bcrypt.hash(password, 12);
        db.query("UPDATE usuarios SET password=? WHERE id=?", [nuevoHash, user.id]);
        user.password = nuevoHash;
      }

      req.session.user = user;
      
      let redirect = "/home";
      if (Number(user.force_password_change) === 1) redirect = "/cambiar_clave";
      else if (user.rol === "admin" || user.rol === "superadmin") redirect = "/index";
      else {
        const rutas = { 1: "/talento_humano", 2: "/inteligencia", 3: "/operaciones", 4: "/logistica" };
        redirect = rutas[Number(user.dependencia_id)] || "/home";
      }

      // ✅ Enviamos éxito y la ruta. Tu script se encarga del resto.
      return res.json({ success: true, redirect });

    } catch (e) {
      return res.status(500).json({ success: false, message: "Error interno" });
    }
  });
});
// Endpoint para procesar el cambio de contraseña
app.post("/api/auth/cambiar-password", auth, async (req, res) => {
    const { actual, nueva } = req.body;
    const userId = req.session.user.id;

    // Validación de campos
    if (!actual || !nueva) {
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
    }

    db.query("SELECT password FROM usuarios WHERE id = ?", [userId], async (err, results) => {
        if (err || results.length === 0) return res.status(500).json({ success: false, message: "Error de servidor" });

        // Verificar contraseña actual (soporta texto plano y bcrypt)
        const user = results[0];
        const esValida = user.password.startsWith('$2b$') ? 
                         await bcrypt.compare(actual, user.password) : 
                         (actual === user.password);

        if (!esValida) {
            return res.status(400).json({ success: false, message: "La contraseña actual es incorrecta" });
        }

        // Encriptar nueva clave y actualizar
        const nuevoHash = await bcrypt.hash(nueva, 12);
        db.query("UPDATE usuarios SET password = ?, force_password_change = 0 WHERE id = ?", [nuevoHash, userId], (err) => {
            if (err) return res.status(500).json({ success: false, message: "No se pudo actualizar" });
            
            // Actualizamos la sesión para que ya no pida cambio
            req.session.user.force_password_change = 0;
            res.json({ success: true, message: "Contraseña actualizada correctamente" });
        });
    });
});
// ======================
// GESTIÓN DE ARCHIVOS (MULTER)
// ======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const user = req.session.user;
    if (!user) return cb(new Error("Sesión no válida"));

    // admin puede elegir dependencia, usuario normal no
    const depIdFinal =
      user.rol === "admin" || user.rol === "superadmin"
        ? Number(req.body.dependencia_id || 4)
        : Number(user.dependencia_id);

    const ruta = path.join(__dirname, "uploads", folderByDepId(depIdFinal));
    if (!fs.existsSync(ruta)) fs.mkdirSync(ruta, { recursive: true });

    cb(null, ruta);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^\w.\-]/g, "_");
    cb(null, Date.now() + "-" + safeName);
  },
});
const upload = multer({ storage });

// ======================
// RUTAS DE NAVEGACIÓN
// ======================
app.get("/home", auth, (req, res) => {
  const user = req.session.user;
  if (user.rol === "admin" || user.rol === "superadmin") return res.redirect("/index");

  const rutas = {
    1: "/talento_humano",
    2: "/inteligencia",
    3: "/operaciones",
    4: "/logistica",
  };
  res.redirect(rutas[Number(user.dependencia_id)] || "/");
});

app.get("/index", auth, (req, res) => {
  if (req.session.user.rol !== "admin" && req.session.user.rol !== "superadmin") return res.redirect("/home");
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.get("/admin_usuarios", auth, onlyAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/AdminUsuarios.html"));
});

app.get("/talento_humano", auth, permisoDependencia(1), (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/Talento_Humano.html"));
});

app.get("/inteligencia", auth, permisoDependencia(2), (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/Inteligencia.html"));
});

app.get("/operaciones", auth, permisoDependencia(3), (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/Operaciones.html"));
});

app.get("/logistica", auth, permisoDependencia(4), (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/Logistica.html"));
});

// ======================
// API Y OPERACIONES (CRUD)
// ======================
app.get("/api/user-info", auth, (req, res) => {
  res.json({
    rol: req.session.user.rol,
    usuario: req.session.user.usuario,
  });
});

// ======================
// ADMIN: USUARIOS (SUPER USUARIO)
// ======================

// Lista usuarios (para panel admin)
app.get("/api/admin/usuarios", auth, onlyAdmin, (req, res) => {
  db.query(
    "SELECT id, usuario, rol, dependencia_id, force_password_change FROM usuarios ORDER BY id DESC",
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: "Error consultando usuarios" });
      res.json(rows);
    }
  );
});

// Reset contraseña (temporal) + forzar cambio
app.post("/api/admin/usuarios/:id/reset-password", auth, onlyAdmin, async (req, res) => {
  const userId = Number(req.params.id);

  const tempPassword = generarClaveTemporal();
  const hash = await bcrypt.hash(tempPassword, 12);

  db.query(
    "UPDATE usuarios SET password=?, force_password_change=1 WHERE id=?",
    [hash, userId],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Error reseteando contraseña" });
      if (!result || result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      // SOLO se muestra una vez al admin
      res.json({ success: true, tempPassword });
    }
  );
});

// ======================
// DOCUMENTOS
// ======================
app.get("/api/documentos/:dependencia", auth, (req, res) => {
  const user = req.session.user;
  const depSolicitada = Number(req.params.dependencia);

  if (
    user.rol !== "admin" &&
    user.rol !== "superadmin" &&
    Number(user.dependencia_id) !== depSolicitada
  ) {
    return res.status(403).json({ error: "Acceso no autorizado" });
  }

  const sql = `
    SELECT d.id, d.titulo, d.archivo, d.fecha_documento,
           d.tipo_documento_id, t.nombre AS tipo_nombre
    FROM documentos d
    JOIN tipos_documento t ON d.tipo_documento_id = t.id
    WHERE d.dependencia_id = ?
    ORDER BY d.id DESC
  `;

  db.query(sql, [depSolicitada], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al consultar documentos" });
    res.json(results);
  });
});

app.post("/subir-documento", auth, upload.single("archivo"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No hay archivo seleccionado" });

  const user = req.session.user;
  const { tipo_documento_id, fecha_documento, titulo } = req.body;

  const depIdFinal =
    user.rol === "admin" || user.rol === "superadmin"
      ? Number(req.body.dependencia_id)
      : Number(user.dependencia_id);

  const rutaRelativa = `uploads/${folderByDepId(depIdFinal)}/${req.file.filename}`;

  const sql = `INSERT INTO documentos (titulo, archivo, fecha_documento, tipo_documento_id, dependencia_id, usuario_id)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [titulo || req.file.originalname, rutaRelativa, fecha_documento, Number(tipo_documento_id), depIdFinal, user.id],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: "Error al guardar en BD" });
      res.json({ success: true, message: "Documento guardado exitosamente" });
    }
  );
});

app.delete("/api/documentos/:id", auth, (req, res) => {
  const user = req.session.user;
  const docId = Number(req.params.id);
  const { ruta } = req.body;

  if (user.rol !== "admin" && user.rol !== "superadmin") {
    return res.status(403).json({ error: "Privilegios insuficientes" });
  }

  db.query("DELETE FROM documentos WHERE id = ?", [docId], (err) => {
    if (err) return res.status(500).json({ error: "Error al borrar registro" });

    if (ruta) {
      // ruta viene tipo "uploads
      const rutaArchivo = path.join(__dirname, ruta.replace(/^\/+/, ""));
      if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);
    }

    res.json({ success: true, message: "Documento eliminado" });
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// ======================
// ARRANQUE DEL SERVIDOR
// ======================
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SERVIDOR GA7 PROTEGIDO INICIADO`);
  console.log(`------------------------------------------`);
  console.log(`> Local:   http://localhost:${PORT}`);
  console.log(`> Red LAN: http://192.168.18.27:${PORT}`);
});