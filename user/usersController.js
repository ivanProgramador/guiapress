const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');

router.get('/admin/users',(req,res)=>{

     User.findAll().then(users =>{
        res.render('admin/user/index',{users:users});
     })
});

router.get('/admin/users/create',(req,res)=>{

    res.render('admin/user/create');
})

router.post('/users/create',(req,res)=>{

    var email = req.body.email;
    var password = req.body.password;

    //nunca se deve salvar na base de dados uma senha exatamente como ela foi digitada pelo usuario
    // exite duas formas de codifica-la a forma menos segura e a criptografia porque a criptografia
    //segue padrões e existem regras de decodificação que podem ser aplicadas para pegar as senhas dos usuarios 
    //a forma mais segura para este porjeto foi o rash porque não tem extamente um jeito de reverter um rash
    //para fazer iss eu usei a biblioteca bcryptjs

    //evitando emails repetidos no cadastro aqui eu faço um select onde eu procuro o email
    //que o susrio tentou cadastrar se não vier nada na consulta ele vai dar undefied e vai executar o cadastro
    //porem se o resultado da compração não for indefinido ele retorna o usuario pra pagina de cadastro sem cadastrar
    //o email repetido 

    User.findOne({where:{email:email}}).then(user =>{

      if(user == undefined){

               var salt = bcrypt.genSaltSync(10); //criando o salt 

               var hash = bcrypt.hashSync(password,salt); //pegando a senha e o salt pra gerar uma hash pra senha  
         
               //salavndo a rash lgerada com abse na senha no banco de dados e salvando tambem o email 
               
               User.create({
                  email: email,
                  password: hash
         
               }).then(()=>{
         
                  res.redirect("/");
         
               }).catch((err)=>{
         
                  res.redirect("/");
               })

               }else{

                res.redirect("/admin/users/create");

      }

    });
  
});


router.post('/user/delete/',(req,res)=>{

   var id = req.body.id;

   if(id != undefined){ //testando se o id e diferente de undefined

      if(!isNaN(id)){ //testando se o id que vai vir e um numero 
  
        //se ele for diferente de indefinido e for um numero 
  
        User.destroy({
         where:{
            id:id
         }
       }).then(()=>{
  
         res.redirect('/admin/users');
            
       })
  
         
  
      }else{
  
         res.redirect('/admin/users');
      }
  
  
    }else{
      res.redirect('/admin/users');
    }
  

  
})

module.exports = router;

