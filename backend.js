// aplicação principal do back end
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(cors());

const Filme = mongoose.model ("Filme",mongoose.Schema({
    titulo: {type: String},
    sinopse: {type: String}
    // quando instanciamos com const, usamos () indicando construtor
}))

const usuarioSchema = mongoose.Schema ({
    login: {type: String, required: true, unique: true},
    senha: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator);
const Usuario = mongoose.model("Usuario", usuarioSchema);
//indica que o usuario vai usar a tabela usuarioSchema

// fazendo uma functino para conectar
async function conectarMongo() {
    await mongoose.connect(`mongodb+srv://lkmtada:mongo123@lucaskmongodb.tuupars.mongodb.net/?retryWrites=true&w=majority`);
}

// ponto de acesso teste
app.get('/oi', (req, res) => res.send('oi'));

// ponto de acesso para consultar a lista de filmes
app.get('/filmes', async (req, res) => {
    const filmes = await Filme.find();
    res.json(filmes)
    //mudamos para .json por que a página está preparada para receber um objeto json
});

// ponto de acesso para enviar um novo filme
app.post('/filmes', async (req, res) => {
    const titulo = req.body.titulo;
    const sinopse = req.body.sinopse;

    const filme = new Filme({titulo: titulo, sinopse: sinopse});
    await filme.save()
    

    const filmes = await Filme.find();
    res.json(filmes)

    //todos esse elementos aqui são assincronos e devemos tratalos como tal
})

app.post('/signup', async (req, res) => {
    try {
        const login = req.body.login;
        const senha = req.body.senha;
        const criptografada = await bcrypt.hash(senha,10);

        const usuario = new Usuario({login: login, senha: criptografada});
        const respostaMongo = await usuario.save();
        // essa é uma requisição longe do async, colocamos await

        console.log(respostaMongo);
        res.end();
        res.status(201).end();
    }
    catch (e) {
        console.log("erro: ", e);
        res.status(409).end();
    }
})
app.post('/login', async (req, res) => {
    //trazer para o contexto o que foi digitado no front end
    const login = req.body.login;
    const senha = req.body.senha; // isso equivale a ir no corpo da requisição e pega=egar a senha
    const user = await Usuario.findOne({login: login}); // verifca se o login digitado na variável login eixste
    if (!user) {
        // !user = se o usuário não existir
        return res.status(401).json({mensagem: "usuário não cadastrado"}); //se ele passar pelo if, qeur dizer que ele existe, agora tenho que ver se a senha é a mesma
    }
        //trazer para o contexto
        //const senhaValida = compare(senha, user.senha) //versão errada, compara a senha no banco, com a senha que o user digitou, não dá certo por que a senha no banco está criptografada

    const senhaValida = await bcrypt.compare(senha, user.senha) // dessa forma vai comprar a senha encryputada
    if (!senhaValida) {
        // ! = not, se a senha foi inválida
        return res.status(401).json({mensagem: "senha incorreta, acesso negado, tente novamente"});
    }
    
    const token = jwt.sign(
        {login: login},
        "minha_chave",
        {expiresIn: "1h"} // objetos json estão entre {}
    )

    //código para login
    //res.end();

    res.status(200).json({token: token});
    
})

// para o listen precisamos de uma porta, e uma ação em função seta
// como so terá uma instrução emitimos elementos
app.listen(3000, () => {
    try {
        conectarMongo();
        console.log("Conexão ok e aplicação running")
    }
    catch (e) {
        console.log("erro: ", e)
    }
});