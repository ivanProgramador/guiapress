const Sequelize = require('sequelize'); //importando sequelize 
const connection = require('../database/database'); //importando o banco 


//criando o model 

const User = connection.define('users',{
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }
})


//atualizando o banco com a tabela 
//depois de executar uma vez tem que comentar o codigogo sync senão ele fica tentando criar a tabela de novo 
//User.sync({force:false});

module.exports = User;

