const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");



//body parser para trabalhar com a conversão do corpo dos formularios 
//ele nunca deve ser usado antes dos controllers primeiro chama app use e depois importa 
//os controllers 
app.use(bodyParser.urlencoded({extended: false}));
// e converter json tambem 
app.use(bodyParser.json());




//importando as rotas 
const categoriesController = require('./categories/categoriesController');
const articlesController = require('./articles/articlesController');

//usando as rotas que eu importei 
app.use('/', categoriesController);
app.use('/', articlesController);

//importando os models para atualizar as tabelas
//tudo qoue esta aqui é executado portanto se eu importar os models pra ca
//ele vai executar a logica dentro deles

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const router = require("./categories/categoriesController");



// configurando a view engine pra trabalhar com o retorno em html 
app.set('view engine','ejs'); 

//condfigurando o express pra trabalhar com aqrquivos estaticos 
app.use(express.static('public'));






app.get("/", (req,res)=>{

    //ela vai buscar a index dentro da pasta views

    res.render("index");

})



//rotas administrativas categorias

router.get('/admin/categories/new',(req,res)=>{

})













//database

connection
      .authenticate()
      .then(()=>{
        
         console.log("conectado com sucesso")
      }).catch((error)=>{

          console.log(error);
      })

//server

app.listen(8080,()=>{
    console.log("o servidor está rodando");
})      