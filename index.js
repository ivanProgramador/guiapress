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





//mandando os artigos pra home page 

app.get("/", (req,res)=>{

    Article.findAll({
        order:[
            ['id','DESC']],
            limit: 4
        
    }).then(articles =>{

        Category.findAll().then(categories => {

            res.render("index",{articles: articles, categories: categories});

        });     
    });
})

app.get('/:slug',(req,res)=>{
  
     var slug = req.params.slug;

     Article.findOne({
         where:{
            slug:slug
         }
     }).then(article =>{
         if(article != undefined){

            Category.findAll().then(categories => {

                res.render("article",{article: article, categories: categories});
    
            });     


         }else{
            res.redirect("/")
         }
     }).catch(error =>{

        res.redirect("/")
          
     })

})

/* rota para fazer a listagem de artigos por categoria de forma dinamica 
   de forma basica ela faz 2 select 1 pegar as categorias e listar na navbar 
   e outro pra pegar os artigos que pertencem a categoria e listar na pagina 
   para fazer isso foi preciso fazer um join como eu estou usando um orm,
   é mais facil fazer 
   ele começa na linha 1005 selecionando um categoria com base no slug dela 
   que vem pela requisição depois ele usa o include para incluir todos os artigos
   nisso so usando a função finOne eu ja peguei a categoria pelo artigo e todos os artigos 
   depois eu coloela dentro da variavel category testo se a cetagory esta indefinida 
   se não estiver  eu executo outro select pra fazer a busca por todas as categorias 
   
   depois da busca eu coloco o resultado dentro da variavel categories e rendirizo 
   ao que ao inves de passar so as categorias primiero eu defino a varivel articles
   depois eu pego avariavel category e pego so os artigos dela e mando pra dentro da varivel aticles 
   isso so é possivel fazer porque o joyn trouxe esses artigos pra mim 

   e depois eu passo as categorias normalmente para variavel categories
   assim tanto os artigos vão pra view quanto as categorias deles

   ai no caso toda vez que eu clicar em um link da navbar home ele executa um select com base 
   no slug da categoria e lista somente os artigos que pertencem a ela  

   
   

 */  

app.get('/category/:slug',(req,res)=>{

    var slug = req.params.slug;

    Category.findOne({
        where: {
            slug:slug
        },
        include: [{model:Article}]

    }).then( category => {
        if(category != undefined){

            Category.findAll().then(categories => {

                res.render("index",{articles: category.articles, categories: categories});
            })

        }else{
            res.redirect("/");
        }
    }).catch(error =>{
        res.redirect("/");
        
         
    })
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