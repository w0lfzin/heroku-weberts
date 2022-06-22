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
    path.resolve(__dirname + "/../Frontend/Parceiro/pages/antecipacoesInfo.html")
  )});

app.get("/editarDados", (req,res) =>{
  res.sendFile(
    path.resolve(__dirname + "/../Frontend/Parceiro/pages/editarDados.html")
  )});

app.get("/index", (req,res) =>{
  res.sendFile(
    path.resolve(__dirname + "/../Frontend/Parceiro/index.html")
  )});

app.get("/editarBanco", (req,res) =>{
  res.sendFile(
    path.resolve(__dirname + "/../Frontend/Parceiro/pages/editarBanco.html")
  )});

app.get("/financeiro", (req,res) =>{
  res.sendFile(
    path.resolve(__dirname + "/../Frontend/Parceiro/pages/financeiro.html")
  )});

app.get("/historico", (req,res) =>{
  res.sendFile(
    path.resolve(__dirname + "/../Frontend/Parceiro/pages/historico.html")
  )});

  app.get("/antecipacoes", (req,res) =>{
    res.sendFile(
      path.resolve(__dirname + "/../Frontend/Parceiro/pages/antecipacoes.html")
    )});

    app.get("/dashboard", (req,res) =>{
      res.sendFile(
        path.resolve(__dirname + "/../Frontend/Parceiro/pages/dashboard.html")
      )});

  /*SERVIDOR API - ENDPOINTS (ACESSO AO BANCO DE DADOS) */
  
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
              __dirname + "/../Frontend/Parceiro/pages/dashboard.html"
            )
          );
        }else{
          res.cookie("id", response.id);
          res.sendFile(
            path.resolve(
              __dirname + "/../Frontend/Parceiro/pages/admin.html"
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

//GET VALOR ANTECIPAVEL
app.get("/valor1", (req, res) => {
  db.get(
    `SELECT SUM(valor) FROM reserva`,
    (error, data) => {
      res.json(data)
    }
  );
});

//GET VALOR ANTECIPADO
app.get("/valor2", (req, res) => {
  db.get(
    `SELECT SUM(montante) FROM antecipacao`,
    (error, data) => {
      res.json(data)
    }
  );
});

//GET MES1
app.get("/mes1", (req, res) => {
  db.get(
    `SELECT SUM(montante) FROM antecipacao WHERE data_recebimento == '01/2022'`,
    (error, data) => {
      res.json(data)
    }
  );
});

//GET MES2
app.get("/mes2", (req, res) => {
  db.get(
    `SELECT SUM(montante) FROM antecipacao WHERE data_recebimento == '02/2022'`,
    (error, data) => {
      res.json(data)
    }
  );
});

//Dados para página de solicitação

app.get("/hotelReserva", (req, res) => {
  db.all(
    'SELECT hotel.nome, reserva.code, reserva.data_checkout, reserva.valor FROM reserva, hotel WHERE reserva.hotel_id = hotel.id ORDER BY hotel.id',
    (error, data) => {
      res.json(data)
    }
  );
});

app.post("/mandarAntecipacao", (req, res) => {
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

app.post("/editarDados", (req, res) => {
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

//Coisa do luiz

app.get("/hotel", (req, res) => {
  db.all(
    `SELECT * FROM hotel WHERE (estado) IN (${JSON.parse(req.body.estado_hotel)}) AND (${JSON.parse(req.body.cidade_hotel)}) AND (${JSON.parse(req.body.nome_hotel)}) `,
    (error, data) => {
      res.json(data)
    }
  )
})

app.get("/antecipacao", (req, res) => {
  db.all(
    `SELECT * FROM antecipacao WHERE (estado) IN (${JSON.parse(req.body.data_recebimento_antecipacao)}) AND (${JSON.parse(req.body.regra_antecipacao)}) `,
    (error, data) => {
      res.json(data)
    }
  )
})

app.get("/stateFilter", (req, res) => {
  db.all(
    `SELECT DISTINCT (estado) FROM hotel `,
    (error, data) => {
      res.json(data)
    }
  )
})
app.get("/cityFilter", (req, res) => {
  db.all(
    `SELECT DISTINCT (cidade) FROM hotel `,
    (error, data) => {
      res.json(data)
    }
  )
})
app.get("/partnerFilter", (req, res) => {
  db.all(
    `SELECT DISTINCT (nome) FROM hotel `,
    (error, data) => {
      res.json(data)
    }
  )
})
app.get("/periodFilter", (req, res) => {
  db.all(
    `SELECT DISTINCT (data_recebimento) FROM antecipacao `,
    (error, data) => {
      res.json(data)
    }
  )
})
app.get("/typeFilter", (req, res) => {
  db.all(
    `SELECT DISTINCT (regra) FROM antecipacao `,
    (error, data) => {
      res.json(data)
    }
  )
})
app.get("/antecipations?states=[]", (req, res) => {
  var stateFiltered = JSON.parse(req.query.state);
  console.log(stateFiltered)
  if (!stateFiltered) { 
    db.get( 
      `SELECT SUM(estado) FROM hotel`,
      (error, data) => {
        res.json(data)
      }
    )
  } else {
    db.get(
      `SELECT SUM(estado) FROM hotel WHERE estado in ${stateFiltered}`,
      (error, data) => {
        res.json(data)
      }
    )
  }
})

app.get("/antecipations", (req, res) => {
  db.all(
    `SELECT COUNT (*) FROM antecipacao `,
    (error, data) => {
      res.json(data)
    }
  )
})

app.get("/montante", (req, res) => {
  db.all(
    `SELECT SUM (montante) FROM antecipacao`,
    (error, data) => {
      res.json(data)
    }
  )
  
})

app.get("/rentabilidade", (req, res) => {
  db.all(
    `SELECT SUM(montante)/SUM(valor) FROM antecipacao INNER JOIN reserva on reserva.code = antecipacao.reserva_code`,
    (error, data) => {
      res.json(data)
    }
  )

})

app.get("/antecipations?states=[]", (req, res) => {
  var stateFiltered = JSON.parse(req.query.state);
  console.log(stateFiltered)
  if (!stateFiltered) { 
    db.get( 
      `SELECT SUM(estado) FROM hotel`,
      (error, data) => {
        res.json(data)
      }
    )
  } else {
    db.get(
      `SELECT SUM(estado) FROM hotel WHERE estado in ${stateFiltered}`,
      (error, data) => {
        res.json(data)
      }
    )
  }
})

//Ranking

app.get("/ranking", (req, res) => {
  db.all(
    `SELECT montante,hotel.nome, antecipacao.regra, hotel.estado FROM hotel, antecipacao, reserva where hotel.id = reserva.hotel_id and reserva.code = antecipacao.reserva_code`,
    (error, data) => {
      res.json(data)
    }
  )
})

app.get("/historicodata", (req, res) => {
  db.all(
    'SELECT regra, data_recebimento, montante FROM antecipacao',
    (error, data) => {
      res.json(data)
    }
  )
})