const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../midwares/adminAuth');

router.get('/admin/users',adminAuth.authenticate,(req,res)=>{

     User.findAll().then(users =>{
        res.render('admin/user/index',{users:users});
     })
});

router.get('/admin/users/create',adminAuth.authenticate,(req,res)=>{

    res.render('admin/user/create');
})

router.post('/users/create',(req,res)=>{

    var email = req.body.email;
    var password = req.body.password;

    //nunca se deve salvar na base de dados uma senha exatamente como ela foi digitada pelo usuario
    // exite duas formas de codifica-la a forma menos segura e a criptografia porque a criptografia
    //segue padrões e existem regras de decodificação que podem ser aplicadas para pegar as senhas dos usuarios 
    //a forma mais segura para este projeto foi o rash porque não tem extamente um jeito de reverter um rash
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


router.post('/user/delete/',adminAuth.authenticate,(req,res)=>{

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

//rota pra tela de login

router.get("/login", (req,res)=>{
    res.render('admin/user/login')
})

//rota que executa o login

router.post("/authenticate", (req,res)=>{

   //pegando os dados que vem da reuisição 
   var email = req.body.email;
   var password = req.body.password;

   //buscando usuario na base de dados 

      User.findOne({where:{email: email}}).then(user => {
           
         if(user != undefined){

          //validar senha 
          //aqui eu uso o bcrypt para comparar as senhas 
          //internamente o metodo compare sync vai pegar a senha que veio da requisição 
          //trasnformar ela em um rash e comparar com a rash que esta na base de dados 
          //se bater ele coloca o valor true na variavel correct   

          var correct = bcrypt.compareSync(password, user.password);

          if(correct){

            //se o correct for igual a true eu vou criar um a cessao 

         var usel =  req.session.user = {
               id: user.id,
               email: user.email
           }

         
           res.redirect("/admin/articles");
            

             }else{

            res.redirect("/login");

          }



         }else{

            res.redirect("/login");
         }



      })


})

router.get("/logout",(req,res)=>{
    
   req.session.user = undefined;
   res.redirect("/");
})




module.exports = router;

