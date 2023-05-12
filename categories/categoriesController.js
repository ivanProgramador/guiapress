const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
//para executar gravaçãop no baco eu vou precisar do model 
const Category = require('./Category');
const slugify = require('slugify');

router.get("/categories",(req,res)=>{

  res.send("Rota de categorias");

});

router.get("/admin/categories/new",(req,res)=>{
    
    //apontando para a view de cadastro(ela vai mostrar um formulario)
    //a rota começã pelo admin porque a pasta view 
    //ja esta sendo reconhecida de forma automatica

    res.render("admin/categories/new");

});


//Rota que vai executar a gravação dos dados na base 

router.post("/categories/save",(req,res)=>{

  

  var title = req.body.title; //pegando o valor do elemento titulo do body 

  //testando se relamente ele tem algum valor nele 

  if(title != undefined){
    
    // se tiver ele vai ser gravado 

     Category.create({

        title: title, //passando o valor da variavel titutulo para a coluna titulo 

        slug: slugify(title) //passandoa  aversão slud do titulo para a coluna slug

      }).then(()=>{

         //depois de adicionar eu mando o cliente pra home 
          
         res.redirect("/admin/categories");
      })
     

  }else{
      
     res.redirect('admin/categories/new');

  }
  
});


router.get('/admin/categories',(req,res)=>{

  //findAll e como um select deposi que ele seleciona ele envia os dados para a função then() 
  //que recebe uma função de call back então eu criei o parametro categories e dentro dela joguei topas as categorias encontradas 
   

  Category.findAll().then(categories =>{
    //aqui eu passo para a função reder que vai retornar a view no primeiro parametro 
    // e no segundo eu pásso um objeto que diz que colocar todas as categorias encontradas na varivel de categorias  
    res.render("admin/categories/index",{categories: categories});
     
   });  
});


// rota para deletar uma categoria 

router.post("/categories/delete", (req,res) => {

   var id = req.body.id;

   if(id != undefined){ //testando se o id e diferente de undefined

     if(!isNaN(id)){ //testando se o id que vai vir e um numero 

       //se ele for diferente de indefinido e for um numero 

       Category.destroy({
        where:{
           id:id
        }
      }).then(()=>{

        res.redirect('/admin/categories');
           
      })

        

     }else{

        res.redirect('/admin/categories');
     }


   }else{
      res.redirect('/admin/categories')
   }


});


//rota apara editar categoria 

router.get("/admin/categories/edit/:id",(req,res)=>{
  var id = req.params.id;
   
   if(isNaN(id)){
     
    res.redirect("/admin/categories");
     

   }

  Category.findByPk(id).then(category=>{
      if(category != undefined){

        //mostrando a view de editar 
        res.render("admin/categories/edit",{category: category});

         

      }else{
         res.redirect("/admin/categories");
      }
  }).catch(erro =>{

     res.redirect("/admin/categories");
  })
  
})

//rota para atualizar categorias 

router.post("/categories/update",(req,res)=>{

  var id = req.body.id;
  var title = req.body.title;

  Category.update({title:title, slug:slugify(title)},{
    where: {
      id:id
    }
  }).then(()=>{

    res.redirect("/admin/categories");
  })

});


module.exports = router;
  

