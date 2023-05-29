//essa e a função de midware de autenticação de usuarios

module.exports.authenticate = function adminAuth(req,res,next){

    if(req.session.user != undefined){
        //se a cessão for diferente de undefined segue o codigo da rota  
       next();

    }else{

        //se não redireciona pra tela de login 
        res.redirect("/login");

    }

}

