const express = require('express')
const path = require('path');
const app = express()
const port = 8080
const cors = require('cors')

app.use(cors())
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'))
})

app.post('/login', (req, res) => {
  console.log(req.body)
  authorization(req.body.login, req.body.password)
  .then((resolve) => {
    if(resolve.length == 0) {
      console.log('Ничего не найдено')
    } else {
      return getUserCoins(resolve[0].id)
    }
  })
  .then((resolve, reject)=>{
    if (reject) {
      console.log(reject);
    } else {
      res.json({msg: resolve, isAuthorized: true })
    }    
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const mysql = require('mysql');
const { resolve } = require('path');
var sqlCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "fufel",
});

function authorization (login, password) {
  return new Promise ((result, reject)=> {
    sqlCon.query(sqlRequests.authorization(login, password),function(err, results) {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        console.log(results)
        result(results);
      }
    });
  });
}

function getUserCoins (userId) {
  return new Promise ((result, reject) => {
    sqlCon.query(sqlRequests.getCoins(userId),function(err, results) {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        console.log(results)
        result(results);
      }
    });
  })
}

let sqlRequests = {
  authorization: ((login, password) => {
    return `SELECT * FROM users
            WHERE login='${login}' AND pass='${password}'`
  }),
  getCoins: ((userId) => {
    return `SELECT DISTINCT user_id, action, SUM(price) AS fullAmount FROM coins
            WHERE user_id='${userId}'`
  }),
  getProducts: 'SELECT * FROM products',

}