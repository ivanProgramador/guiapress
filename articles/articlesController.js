const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require('./Article');
const slugify = require('slugify');

router.get("/admin/articles",(req,res)=>{
  //desnto do find all eu digo quais as tebelas que eu quero incluir 
  //no caso eu mandei incluir categorias pra pegar so o titulo delas 

  Article.findAll({
      include:[{model: Category}]
  }).then(articles =>{

    res.render("admin/articles/index",{articles: articles});

  })

});



router.get("/admin/articles/new",(req,res)=>{
    
    Category.findAll().then(categories =>{

      res.render("admin/articles/new",{categories: categories});
      
    })    
});



router.post("/articles/save",(req,res)=>{
  
   var title = req.body.title;
   var body  = req.body.body;
   var category = req.body.category;


   Article.create({
     title: title,
     slug: slugify(title),
     body: body,
     categoryId: category

   }).then(()=>{

     res.redirect("/admin/articles");

   })
});


router.post("/articles/delete", (req,res) => {

  var id = req.body.id;

  if(id != undefined){ //testando se o id e diferente de undefined

    if(!isNaN(id)){ //testando se o id que vai vir e um numero 

      //se ele for diferente de indefinido e for um numero 

      Article.destroy({
       where:{
          id:id
       }
     }).then(()=>{

       res.redirect('/admin/articles');
          
     })

       

    }else{

       res.redirect('/admin/articles');
    }


  }else{
     res.redirect('/admin/categories')
  }


});

//rota que leva para a pagina de edição 

router.get("/admin/articles/edit/:id", (req,res)=>{
  
  var id = req.params.id; 

  Article.findByPk(id).then(article =>{

    if(article != undefined){

      Category.findAll().then( categories =>{

        res.render("admin/articles/edit",{categories: categories, article: article})
         
      } )

    

    }else{

       res.redirect("/");
    }
     
  }).catch(err =>{

    res.redirect("/")

  })
   
  
});

//rota que executa a edição 

router.post("/articles/update",(req,res)=>{

  //pegando as informações que vem da requisição

   var id = req.body.id;
   var title = req.body.title;
   var body = req.body.body;
   var category = req.body.category;
  
  //mandanbdo os dados atualizados para o banco  
   Article.update({
     title: title,
     body: body,
     categoryId: category,
     slug: slugify(title)

   },{
     where:{
        id:id
     }
   }).then(()=>{

      res.redirect("/admin/articles")

   }).catch(err =>{

      res.redirect("/");

   })
});

//rota de paginação 

router.get("/articles/page/:num",(req,res)=>{

   var page = req.params.num;
    var offset = 0;

   // o metodo findAndCountAll serve para encontrar e contar todos os artigos 
   // isso torna possivel controlar quantos deles vão aparecer em cada consulta
   // o parametro limit diz quantos serão exibidos eo páramentro offset paratir de qual
   // ele vai exibir 
   // digamos eu quero exibir 4 em cada pagina -> limit: 4 
   // e quero exibir opartir do numero 10      -> offset:10 
   // e a assim que a paginação e controlada  

   //testando se a verivel page traz um numero dentro dela ou se ela e igual a 1 

   if(isNaN(page) || page == 1){

      //se sim 
      
       offset = 0;

   }else{
      //no caso eu tenho que multiplicar o offset por 4 porque eu quero que ele mostre 4 dados por página 
       offset = (parseInt(page) - 1)   * 4;
   }

   Article.findAndCountAll({
     
      limit: 4,
      offset: offset  //passando o valor do offset 
      ,order:[
        ['id','DESC']
      ]

   }).then(articles =>{

       //antes de paginar eu preciso saber se ainda existe mais uma pagina para frente 
       //para saber isso eu  vou pegar a quantidade de dados contidos na pagina que são 4 
       // e somar como o offset que sao mais 4 e comparar com o valor total de artigos 
       // se eu tenho 21 atigos e ele exibe 4 por pagina vai dar 5 paginas sendo que uma dela vai ficar so com 1 artigo
       //no caso eu vou somar o offset com a quantidade de artigos por pagina se a quantidade for maior que 5 então acabaram os artigos
       //e não tem mais pagina pra exibir
       
       var next;

       if(offset + 4 >= articles.count){
          next = false;
       }else{
          next = true;
       }

       var result ={

          page:parseInt(page),
          next:next,
          articles:articles
       }

       Category.findAll().then(categories =>{
         res.render("admin/articles/page",{result: result, categories: categories})
       })



       
       
     
   });




})

module.exports = router;
  

