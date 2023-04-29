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
          
            res.redirect("/")
      })
     

  }else{
      
     res.redirect('admin/categories/new');

  }
  
});



module.exports = router;
  

