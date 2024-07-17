const express = require('express')
const app = express()
const port = 3000
// Get the client
const mysql = require('mysql2/promise')
const cors = require('cors')
const session = require('express-session')

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(session({
  secret: 'gsdhfj43uyrt9we4tj98awhaefvaweif',
}))

// Create the connection to database
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'buscacole',
  port: 3307
});


app.get('/login',async (req, res) => {
    const datos = req.query;
    // A simple SELECT query
try {
    const [results, fields] = await connection.query(
      "SELECT * FROM `usuario` WHERE `nombre` = ? AND `clave` = ?",
      [datos.usuario, datos.clave]
    );
    if (results.length > 0) {
      req.session.usuario = datos.usuario;
      res.status(200).send('Inicio correcto')
    } else {
      res.status(401).send('Usuario o Clave incorrectos')
    }
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  } catch (err) {
    console.log(err);
  }
    
  })
  app.get('/validar', (req, res) => {
     if (req.session.usuario){
      res.status(200).send('Sesion validada')
     }else {
      res.status(401).send('No autorizado')
     }
   
  })
  app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})