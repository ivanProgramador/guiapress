const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

// configurando a view engine pra trabalhar com o retorno em html 
app.set('view engine','ejs'); 

//condfigurando o express pra trabalhar com aqrquivos estaticos 
app.use(express.static('public'));

//database

connection
      .authenticate()
      .then(()=>{
        
         console.log("conectado com sucesso")
      }).catch((error)=>{

          console.log(error);
      })





//body parser para trabalhar com a conversão do corpo dos formularios 
app.use(bodyParser.urlencoded({extended: false}));
// e converter json tambem 
app.use(bodyParser.json());











app.get("/", (req,res)=>{

    //ela vai buscar a index dentro da pasta views

    res.render("index");

})

app.listen(8080,()=>{
    console.log("o servidor está rodando");
})      