const Sequelize = require('sequelize'); //importando sequelize 
const connection = require('../database/database'); //importando o banco

//importando o model para instabelecer o relacionamento
 
const Category  = require("../categories/Category");

//criando o model 

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull:false 

    }
})

//criando relacionamento

Category.hasMany(Article); //uma categoria pode ter muitos artigos 
Article.belongsTo(Category); //um artigo pertence a uma categoria 

//atualizando as alterações para incluir o relacionamento isso tem que ser feito em todos os models 

// Article.sync({force:true});




module.exports = Article;

