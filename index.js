const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const port = process.env.PORT||3031;
const db = new sqlite3.Database("database.db")

const path = require("path");
const cors = require("cors");
const bp = require("body-parser");
const cookieParser = require("cookie-parser");
const urlencodedParser = bp.urlencoded({ extended: false })
app.use(bp.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(express.static("./Frontend/Parceiro"));

app.listen(port, () => {
  console.log(`Server running at http://${port}/`);
});

/*SERVIDOR DE PÁGINAS HTML - FRONTEND */

app.get("/antecipacoesInfo", (req,res) =>{
  res.sendFile(
    path.resolve(__dirname + "/../frontend/Parceiro/pages/antecipacoesInfo.html")
  )});

app.get("/editarDados", (req,res) =>{
  res.sendFile(
    path.resolve(__dirname + "/../frontend/Parceiro/pages/editarDados.html")
  )});

app.get("/index", (req,res) =>{
  res.sendFile(
    path.resolve(__dirname + "/../frontend/Parceiro/index.html")
  )});

app.get("/editarBanco", (req,res) =>{
  res.sendFile(
    path.resolve(__dirname + "/../frontend/Parceiro/pages/editarBanco.html")
  )});

app.get("/financeiro", (req,res) =>{
  res.sendFile(
    path.resolve(__dirname + "/../frontend/Parceiro/pages/financeiro.html")
  )});

app.get("/historico", (req,res) =>{
  res.sendFile(
    path.resolve(__dirname + "/../frontend/Parceiro/pages/historico.html")
  )});

  app.get("/antecipacoes", (req,res) =>{
    res.sendFile(
      path.resolve(__dirname + "/../frontend/Parceiro/pages/antecipacoes.html")
    )});

    app.get("/dashboard", (req,res) =>{
      res.sendFile(
        path.resolve(__dirname + "/../frontend/Parceiro/pages/dashboard.html")
      )});

  /*API SERVER - ENDPOINTS (DATABASE ACCESS) */
  
//LOGIN
app.post("/login", (req, res) => {
  const infos = req.body;
  db.get(
    `SELECT senha, id, admin FROM login WHERE email == '${infos.email}'`,
    (error, response) => {
      if (response) {
        console.log(response.senha, infos.senha);
        if (response.senha == infos.senha) {
          if(response.admin == 0){
          res.cookie("id", response.id);
          res.sendFile(
            path.resolve(
              __dirname + "/../frontend/Parceiro/pages/dashboard.html"
            )
          );
        }else{
          res.cookie("id", response.id);
          res.sendFile(
            path.resolve(
              __dirname + "/../frontend/Parceiro/pages/admin.html"
            )
          )
        }
       } else {
          res.send("Email ou senha incorreta, tente novamente!");
          res.end();
        }
      }
    }
  );
});

//GET value that may be anticipated
app.get("/value1", (req, res) => {
  db.get(
    `SELECT SUM(valor) FROM reserva`,
    (error, data) => {
      res.json(data)
    }
  );
});

//GET antecipated value
app.get("/value2", (req, res) => {
  db.get(
    `SELECT SUM(montante) FROM antecipacao`,
    (error, data) => {
      res.json(data)
    }
  );
});

//GET 1st month
app.get("/month1", (req, res) => {
  db.get(
    `SELECT SUM(montante) FROM antecipacao WHERE data_recebimento == '01/2022'`,
    (error, data) => {
      res.json(data)
    }
  );
});

//GET 2nd month
app.get("/month2", (req, res) => {
  db.get(
    `SELECT SUM(montante) FROM antecipacao WHERE data_recebimento == '02/2022'`,
    (error, data) => {
      res.json(data)
    }
  );
});

// Data for the request page 

app.get("/hotelReservation", (req, res) => {
  db.all(
    'SELECT hotel.nome, reserva.code, reserva.data_checkout, reserva.valor FROM reserva, hotel WHERE reserva.hotel_id = hotel.id ORDER BY hotel.id',
    (error, data) => {
      res.json(data)
    }
  );
});

// Places in the database the antecipation request
app.post("/sendAntecipation", (req, res) => {
  const infos = req.body;
  db.get(
    `INSERT INTO antecipacao (regra, data_pedido, data_recebimento, montante, reserva_code) VALUES ('${infos.regra}', '${infos.data_pedido}', '${infos.data_recebimento}', '${infos.montante}', '${infos.reserva_code}')`,
    (error, response) => {
        if (error) {
          console.log(error)
        } else {
          res.send('sent')
        }
    }
  );
});

// Creates a new user in the database
app.post("/editData", (req, res) => {
  const infos = req.body;
  db.get(
    `INSERT INTO hoteleiro (nome, cpf) VALUES ('${infos.hoteleiro_nome}', '${infos.cpf}')`,
    (error, response) => {
        if (error) {
          console.log(error)
        }
    }
  );
  db.get(
    `INSERT INTO hotel (nome, hoteleiro_cpf, cnpj, cep, rua, numero, estado, cidade, banco, agencia, conta) VALUES ('${infos.hotel_nome}', '${infos.cpf}', '${infos.cnpj}', '${infos.cep}', '${infos.rua}', '${infos.numero}', '${infos.estado}', '${infos.cidade}', '${infos.banco}', '${infos.agencia}', '${infos.conta}') `,
    (error, response) => {
        if (error) {
          console.log(error)
        }
    }
  );
});

// Searches for states that differ from what we possess in the database
app.get("/openStates", (req, res) => {
  db.all(
    `SELECT DISTINCT (estado) FROM hotel `,
    (error, data) => {
      res.json(data)
    }
  )
})

// Filters the ranking information using selected states
app.post("/stateFilter", (req, res) => {
  db.all(
    `SELECT montante,hotel.nome, antecipacao.regra, hotel.estado FROM hotel, antecipacao, reserva where hotel.id = reserva.hotel_id and reserva.code = antecipacao.reserva_code and hotel.estado = '${req.body.estado}'`,
    (error, data) => {
      res.json(data)
    }
  )
})

// Searches for partners that differ from what we possess in the databse
app.get("/openPartner", (req, res) => {
  db.all(
    `SELECT nome, hotel.id, code, reserva_code, hotel_id FROM hotel, antecipacao, reserva where hotel.id = reserva.hotel_id and reserva.code = antecipacao.reserva_code `,
    (error, data) => {
      res.json(data)
    }
  )
})

// Filters the ranking informations according to the selected partner
app.post("/partnerFilter", (req, res) => {
  db.all(
    `SELECT montante,hotel.nome, antecipacao.regra, hotel.estado FROM hotel, antecipacao, reserva where hotel.id = reserva.hotel_id and reserva.code = antecipacao.reserva_code and hotel.nome = '${req.body.partner}'`,
    (error, data) => {
      res.json(data)
    }
  )
})

// Searches the database for requests we don't possess
app.get("/openType", (req, res) => {
  db.all(
    `SELECT DISTINCT (regra) FROM antecipacao`,
    (error, data) => {
      res.json(data)
    }
  )
})

// Searches the ranking information according to the type of selected requests
app.post("/typeFilter", (req, res) => {
  db.all(
    `SELECT montante,hotel.nome, antecipacao.regra, hotel.estado FROM hotel, antecipacao, reserva where hotel.id = reserva.hotel_id and reserva.code = antecipacao.reserva_code and antecipacao.regra = '${req.body.regra}'`,
    (error, data) => {
      res.json(data)
    }
  )
})

// Searches the database for the antecipationxdeadline value division
app.get("/antecipations", (req, res) => {
  db.all(
    `SELECT COUNT (*) FROM antecipacao `,
    (error, data) => {
      res.json(data)
    }
  )
})

// Searches the database for the paymentsxdeadline value division
app.get("/fullValue", (req, res) => {
  db.all(
    `SELECT SUM (montante) FROM antecipacao`,
    (error, data) => {
      res.json(data)
    }
  )
  
})

// Searches the database for the avarage rentability division
app.get("/profitability", (req, res) => {
  db.all(
    `SELECT SUM(montante)/SUM(valor) FROM antecipacao INNER JOIN reserva on reserva.code = antecipacao.reserva_code`,
    (error, data) => {
      res.json(data)
    }
  )

})

// Hotel's ranking data

app.get("/ranking", (req, res) => {
  db.all(
    `SELECT montante,hotel.nome, antecipacao.regra, hotel.estado FROM hotel, antecipacao, reserva where hotel.id = reserva.hotel_id and reserva.code = antecipacao.reserva_code ORDER BY antecipacao.montante ASC`,
    (error, data) => {
      res.json(data)
    }
  )
})

//Hotel history data
app.get("/historyData", (req, res) => {
  db.all(
    'SELECT regra, data_recebimento, montante FROM antecipacao',
    (error, data) => {
      res.json(data)
    }
  )
})