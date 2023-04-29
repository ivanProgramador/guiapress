const Sequelize = require('sequelize'); //importando sequelize 
const connection = require('../database/database'); //importando o banco 


//criando o model 

const Category = connection.define('categories',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
})


//atualizando o banco com a tabela 
//depois de executar uma vez tem que comentar o codigogo sync senão ele ficatentandio crirar a tabela de novo 
//Category.sync({force:true});

module.exports = Category;

