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


module.exports = router;
  

