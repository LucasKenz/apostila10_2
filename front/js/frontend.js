// precisamos fazer uma string de conexão com protocolo + servidor + porta + acesso
// de exemplo temos: http://localhost:3000/filmes
const protocolo = 'http://';
const host = 'localhost:3000';
const filmesEndPoint = '/filmes'; //ponto de acesso

async function obterFilmes(){
    const URLcompleta = `${protocolo}${host}${filmesEndPoint}`
    //estabelecemos uma conexão de url

    //vamos pegar os filmes e trazer, de onde? da urlcompleta, que guarda a url do nosso localhost
    const filmes = (await axios.get(URLcompleta)).data
    //a variavel filmes, existeno servidor, trazpara o front end através da função abaixo, ao carregar a página
    
    //console.log(filmes);

    let tabela = document.querySelector('.filmes');
    let corpoTabela = tabela.getElementsByTagName('tbody')[0];
    for (let filme of filmes) {
        let linha = corpoTabela.insertRow(0);
        let celulaTitulo = linha.insertCell(0);
        let celulaSinopse = linha.insertCell(1);
        celulaTitulo.innerHTML = filme.titulo;
        celulaSinopse.innerHTML = filme.sinopse;
    }
}

async function cadastrarFilme(){
    const URLcompleta = `${protocolo}${host}${filmesEndPoint}`;
    let tituloInput = document.querySelector('#tituloInput');
    let sinopseInput = document.querySelector('#sinopseInput');
    // let tituloFilme = tituloInput.value;
    // let sinopseFilme = sinopseInput.value;
    let titulo = tituloInput.value;
    let sinopse = sinopseInput.value;
    //estamos programando o que ocorre na caixa de entrada para cadastrar filmes
    if (titulo && sinopse) {
        //segundo a tabela de convenção qlqr tipo que não seja fazio assumer verdadeiro como padrão
            // console.log({tituloFilme, sinopseFilme});

        tituloInput.value = "";
        sinopseInput.value = "";
        // const filmes = (await axios.post(URLcompleta, {titulo: tituloInput, sinopse: sinopseInput})).data;
        const filmes = (await axios.post(URLcompleta, {titulo, sinopse})).data;

        let tabela = document.querySelector('.filmes');
        let corpoTabela = tabela.getElementsByTagName('tbody')[0];
        corpoTabela.innerHTML = "";
        for (let filme of filmes){
            console.log(filme.titulo, filme.sinopse);
            let linha = corpoTabela.insertRow(0);
            let celulaTitulo = linha.insertCell(0);
            let celulaSinopse = linha.insertCell(1);
            celulaTitulo.innerHTML = filme.titulo;
            celulaSinopse.innerHTML = filme.sinopse;
        }
    }
    else{
        let alert = document.querySelector('.alert');
        alert.classList.add('show');
        alert.classList.remove('d-none');
        setTimeout ( () => {
            alert.classList.remove('show');
            alert.classList.add('d-none');
        }, 2000)
    }


}