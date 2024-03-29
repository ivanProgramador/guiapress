const express = require("express");
const session = require("express-session");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const articlesController = require("./articles/articlesController");
const categoriesController = require("./categories/categoriesController");
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User =  require("./user/User");
const usersController = require("./user/usersController");

//view engine 
app.set('view engine','ejs');

app.use(session({
    secret:'qualquercoisa',
    cookies:{maxAge: 30000}
}))



//static 
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use("/",categoriesController);

//database test 
connection.authenticate().then(()=>{
    console.log('conectado');
}).catch((error)=>{
     console.log(error);
});



app.use("/",categoriesController);
app.use("/",articlesController);
app.use("/",usersController);




app.get("/",(req,res)=>{

    Article.findAll({
        order:[['id','DESC']],
        limit:4
    }).then(articles=>{

        Category.findAll().then(categories=>{

            res.render("index",{articles:articles,categories:categories});

        })

        
    })
});






//rota de busca pelo slug 
app.get("/:slug",(req,res)=>{

    var slug = req.params.slug;

    Article.findOne({  

        where:{
            slug:slug
        }
    }).then(article=>{
        if(article != undefined){

            Category.findAll().then(categories=>{

                res.render("article",{article:article,categories:categories});
    
            })


        }else{
            res.redirect("/");
        }
    }).catch(err=>{

        res.redirect("/");
    })
})


//rota usada pra renderizar a lista especifica 
// de artigos com base na barra de navegação 

app.get("/category/:slug",(req,res)=>{

  var slug = req.params.slug;

  Category.findOne({

    where:{
        slug:slug
    },
    include:[{model: Article}]

  }).then(category=>{
    if(category != undefined){

        Category.findAll().then(categories=>{
            res.render("index",{articles: category.articles, categories: categories});
        })

    }else{
        res.redirect("/");
    }
  }).catch(err=>{
    res.redirect("/");

  });

})



app.listen(8080,()=>{
    console.log("servidor rodando")
});