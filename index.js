const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

const db_name = path.join(__dirname, "data", "apptest.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Conexão com banco realizada");
});

const sql_create = `CREATE TABLE IF NOT EXISTS Estrategia (
  Estrategia_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Descricao VARCHAR(100) NOT NULL,
  TempoJogoInicial INTEGER NULL,
  TempoJogoFinal INTEGER NULL,
  OddCasaInicial DOUBLE NULL,
  OddCasaFinal DOUBLE NULL,
  OddDesafianteInicial DOUBLE NULL,
  OddDesafianteFinal DOUBLE NULL,
  AtaquesCasaInicial INTEGER NULL,
  AtaquesCasaFinal INTEGER NULL,
  AtaquesDesafianteInicial INTEGER NULL,
  AtaquesDesafianteFinal INTEGER NULL,
  SomaCasaInicial INTEGER NULL,
  SomaCasaFinal INTEGER NULL,
  SomaDesafianteInicial INTEGER NULL,
  SomaDesafianteFinal INTEGER NULL,
  PlacarCasaFavoravel INTEGER NULL,
  PlacarEmpatado INTEGER NULL,
  HoraInicial VARCHAR(5) NULL,
  HoraFinal VARCHAR(5) NULL
);
`;
db.run(sql_create, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Criação da tabelas");

/*   const sql_insert = `INSERT INTO estrategia (Descricao,TempoJogoInicial,
    TempoJogoFinal, OddCasaInicial, OddCasaFinal, OddDesafianteInicial, 
    OddDesafianteFinal, AtaquesCasaInicial, AtaquesCasaFinal, AtaquesDesafianteInicial, 
    AtaquesDesafianteFinal, SomaCasaInicial, SomaCasaFinal, SomaDesafianteInicial, 
    SomaDesafianteFinal, PlacarCasaFavoravel, PlacarEmpatado, HoraInicial, HoraFinal) VALUES
  ('Estrategia 1', 7, 15, 1, 3, 1, 2, null, null, null, null, null, null, null, null, null, null, null, null),
  ('Estrategia 2', 12, 25, 2, 3, 0, 2, null, null, null, null, null, null, null, null, null, null, null, null);`;
  db.run(sql_insert, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Registros incluídos em Estrategias");
  });  */
});

app.listen(3000, () => {
    console.log("Disponível em: (http://localhost:3000/) !");
});

// GET /
app.get("/", (req, res) => {
  res.render("index", { page: 'home' });
});

// GET /estrategia
app.get("/estrategia", (req, res) => {
  const sql = "SELECT * FROM estrategia ORDER BY descricao";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("estrategia", { model: rows, page: 'estrategia' });
  });
});

// GET /data
app.get("/data", (req, res) => {
  const test = {
    titre: "Test",
    items: ["un", "deux", "trois"]
  };
  res.render("data", { model: test, page: 'jogos' });
});

// GET /livres
app.get("/livres", (req, res) => {
  const sql = "SELECT * FROM Livres ORDER BY Titre";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("livres", { model: rows, page: 'livres' });
  });
});

// GET /create
app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

// POST /create
app.post("/create", (req, res) => {
  const sql = "INSERT INTO Livres (Titre, Auteur, Commentaires) VALUES (?, ?, ?)";
  const book = [req.body.Titre, req.body.Auteur, req.body.Commentaires];
  db.run(sql, book, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

// GET /createEstrategia
app.get("/createEstrategia", (req, res) => {
  res.render("createEstrategia", { model: {}, page: 'estrategia' });
});

// POST /createEstrategia
app.post("/createEstrategia", (req, res) => {
  const sql = `INSERT INTO Livres (Descricao,TempoJogoInicial,
    TempoJogoFinal, OddCasaInicial, OddCasaFinal, OddDesafianteInicial, 
    OddDesafianteFinal, AtaquesCasaInicial, AtaquesCasaFinal, AtaquesDesafianteInicial, 
    AtaquesDesafianteFinal, SomaCasaInicial, SomaCasaFinal, SomaDesafianteInicial, 
    SomaDesafianteFinal, PlacarCasaFavoravel, PlacarEmpatado, HoraInicial, HoraFinal) VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,?)`;
  const estrategia = [req.body.Descricao, req.body.TempoJogoInicial, req.body.TempoJogoFinal, 
    req.body.OddCasaInicial, req.body.OddCasaFinal, req.body.OddDesafianteInicial, 
    req.body.OddDesafianteFinal, req.body.AtaquesCasaInicial, req.body.AtaquesCasaFinal, req.body.AtaquesDesafianteInicial, 
    req.body.AtaquesDesafianteFinal, req.body.SomaCasaInicial, req.body.SomaCasaFinal, req.body.SomaDesafianteInicial, 
    req.body.SomaDesafianteFinal, req.body.PlacarCasaFavoravel, req.body.PlacarEmpatado, req.body.HoraInicial, req.body.HoraFinal, Estrategia_ID];
  db.run(sql, estrategia, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

// GET /editEstrategia/5
app.get("/editEstrategia/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Estrategia WHERE Estrategia_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("editEstrategia", { model: row, page: 'estrategia' });
  });
});

// GET /edit/5
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Livres WHERE Livre_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("edit", { model: row, page: 'estrategia' });
  });
});

// POST /editEstrategia/5
app.post("/editEstrategia/:id", (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  const estrategia = [req.body.Descricao, req.body.TempoJogoInicial, req.body.TempoJogoFinal, 
    req.body.OddCasaInicial, req.body.OddCasaFinal, req.body.OddDesafianteInicial, 
    req.body.OddDesafianteFinal, req.body.AtaquesCasaInicial, req.body.AtaquesCasaFinal, req.body.AtaquesDesafianteInicial, 
    req.body.AtaquesDesafianteFinal, req.body.SomaCasaInicial, req.body.SomaCasaFinal, req.body.SomaDesafianteInicial, 
    req.body.SomaDesafianteFinal, req.body.PlacarCasaFavoravel, req.body.PlacarEmpatado, req.body.HoraInicial, req.body.HoraFinal, id];
  const sql = `UPDATE Estrategia SET Descricao = ?,TempoJogoInicial = ?,
  TempoJogoFinal = ?, OddCasaInicial = ?, OddCasaFinal = ?, OddDesafianteInicial = ?, 
  OddDesafianteFinal = ?, AtaquesCasaInicial = ?, AtaquesCasaFinal = ?, AtaquesDesafianteInicial = ?, 
  AtaquesDesafianteFinal = ?, SomaCasaInicial = ?, SomaCasaFinal = ?, SomaDesafianteInicial = ?, 
  SomaDesafianteFinal = ?, PlacarCasaFavoravel = ?, PlacarEmpatado = ?, HoraInicial = ?, HoraFinal = ? WHERE (Estrategia_ID = ?)`;
  db.run(sql, estrategia, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/Estrategia");
  });
});

// POST /edit/5
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const book = [req.body.Titre, req.body.Auteur, req.body.Commentaires, id];
  const sql = "UPDATE Livres SET Titre = ?, Auteur = ?, Commentaires = ? WHERE (Livre_ID = ?)";
  db.run(sql, book, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

// GET /deleteEstrategia/5
app.get("/deleteEstrategia/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Estrategia WHERE Estrategia_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("deleteEstrategia", { model: row, page: 'estrategia' });
  });
});

// GET /delete/5
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Livres WHERE Livre_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("delete", { model: row });
  });
});

// POST /delete/5
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Livres WHERE Livre_ID = ?";
  db.run(sql, id, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

// POST /deleteEstrategia/5
app.post("/deleteEstrategia/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Estrategia WHERE Estrategia_ID = ?";
  db.run(sql, id, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/Estrategia");
  });
});
