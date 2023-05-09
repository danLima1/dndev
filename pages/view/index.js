$(document).ready(myView)
// essa funcao e carregada quando o documento "myView estiver pronto"
function myView() {

    const articleId = parseInt(sessionStorage.article)
    // Verifica se articleId não é um número, usando "isNaN" e se for, a e404 e chamada
    if (isNaN(articleId)) loadpage('e404')
// faz uma solicitacao get a api para oobter todos os artigos com o status on
    $.get(app.apiBaseURL + 'articles', { id: articleId, status: 'on' })
// se a solicitacao a api tiver sucesso executa uma funcao
    .done((data) => {
       // verifica se contem um artigo, se nao, a "e404" e carregada
            if (data.length != 1) loadpage('e404')
            //atribui o primeiro elemento de "data" a artData
            artData = data[0]
            //define o titulo do artigo atraves da jquery
            $('#artTitle').html(artData.title)
            //define o conteudo html do artigo usando a jquery
            $('#artContent').html(artData.content)
            //atualiza a contagem de vizualizacoes usando "artData"
            updateViews(artData)
             //atualiza o titulo do arrtigo usando "artData"
            changeTitle(artData.title)
            //obtem pega o autor e a data ddo artigo usando "artData"
            getAuthorDate(artData)
            //obtem uma lista de 5 artigos do autor
            getAuthorArticles(artData, 5)
           //exibe o comentario do usuaio sobre o artigo
            getUserCommentForm(artData)
             //obtem 999 comentarios do artigo
            getArticleComments(artData, 999)
        })
        //chama um callback se a solicitacao a api falhar
        .fail((error) => {
            //exibe um popUp do tipo "error" e um texto "Artigo não encontrado"
            popUp({ type: 'error', text: 'Artigo não encontrado!' })
            //chama a e404
            loadpage('e404')
        })

}
//faz uma solicitacao get a api para obter informacoes sobre o autor
function getAuthorDate(artData) {
    $.get(app.apiBaseURL + 'users/' + artData.author)
    // se a solicitacao tiver sucesso, o nome do autor e a data de publicacao sao adicionados ao html
        .done((userData) => {
            //obtem o nome do autor e a data da postagem do atigo e exibe no html
            $('#artMetadata').html(`<span>Por ${userData.name}</span><span>em ${myDate.sysToBr(artData.date)}.</span>`)
            //obtem o nome do autor, a bio, data de nascimento e a fotoe exibe no aside
            $('#artAuthor').html(`
            <img src="${userData.photo}" alt="${userData.name}">
            <h3>${userData.name}</h3>
            <h5>${getAge(userData.birth)} anos</h5>
            <p>${userData.bio}</p>
        `)
        })
        // se a solicitacao a api falhar carrega a e404
        .fail((error) => {
            console.error(error)
            loadpage('e404')
        })
}
//funcao que pega tdos oos artigos do autor, recebe os parametros artData e limit para obter informacoes sobre o autor e o limite de atigos
function getAuthorArticles(artData, limit) {
// faz uma solicitacao get a api para obter a lista de artigos do autor excluindo o que esta abeto da lista
    $.get(app.apiBaseURL + 'articles', {
        author: artData.author,
        status: 'on',
        id_ne: artData.id,
        _limit: limit
    })
    // se a solicitacao tive sucesso a funcao e executada
        .done((artsData) => {
            // verifica se a lista de atiigos e maior que 0, se for, exibe os arrtigos na pagina
            if (artsData.length > 0) {
                //lista os artigos
                var output = '<h3><i class="fa-solid fa-plus fa-fw"></i> Artigos</h3><ul>'
                //exibe os atigos na lista de forma aleatoria
                var rndData = artsData.sort(() => Math.random() - 0.5)
                //itera a lista de artiggos e anexa o codigo html de caga artigo a "output"
                rndData.forEach((artItem) => {
                    output += `<li class="art-item" data-id="${artItem.id}">${artItem.title}</li>`
                });
                //adiciiona ao codigo html substituindo o conteudo do elemento "authorArtcicles" 
                output += '</ul>'
                $('#authorArtcicles').html(output)
            }
        })
        //se a solicitacao a api falhar, executa a funcao abaixo que chama a pagina e404
        .fail((error) => {
            console.error(error)
            //chama a pagina e404
            loadpage('e404')
        })

}
//pega todos os comentarios do artigo, recebe os parametros artData e limit para obter informacoes sobre o autor e o limite dos comentarios
function getArticleComments(artData, limit) {
// variavel e declarada como string vazia
    var commentList = ''
// faz uma solicitacao get a api para obter a lista de comentarios
    $.get(app.apiBaseURL + 'comments', {
        article: artData.id,
        status: 'on',
        _sort: 'date',
        _order: 'desc',
        _limit: limit
    })
    // se a solicitacao tiverr sucesso, executa a funcao abaixo
        .done((cmtData) => {
            //verifica se a lista de comentarios nao esta vazia
            if (cmtData.length > 0) {
                // se a houver ao menos 1 comentario, executa a funcao abaixo
                cmtData.forEach((cmt) => {
                    //converte as quebras de linhas em "<br>"
                    var content = cmt.content.split("\n").join("<br>")
                    //comenteList recebe o html, com foto do autor, nome e data do comentario
                    commentList += `
                        <div class="cmtBox">
                            <div class="cmtMetadata">
                                <img src="${cmt.photo}" alt="${cmt.name}" referrerpolicy="no-referrer">
                                <div class="cmtMetatexts">
                                    <span>Por ${cmt.name}</span><span>em ${myDate.sysToBr(cmt.date)}.</span>
                                </div>
                            </div>
                            <div class="cmtContent">${content}</div>
                        </div>
                    `
                })
                // se nao tem comentarios, o else e executado
            } else {
                commentList = '<p class="center">Nenhum comentário!<br>Seja o primeiro a comentar...</p>'
            }
            //o conteudo e inserido na pagina html usando a jquery
            $('#commentList').html(commentList)
        })
        // se a soolicitacao a api falhar, executa a funcao abaixo que chama a e404
        .fail((error) => {
            console.error(error)
            loadpage('e404')
        })

}

function getUserCommentForm(artData) {
// variavel e declarada como string vazia
    var cmtForm = ''
// inicia um obsever que verifica se o usuario esta logado ou nao
    firebase.auth().onAuthStateChanged((user) => {
        // se o usuario estiver logado, e exibido o codigo html abaixo com as informacoes do usuario
        if (user) {
            //preenche a variavel cmtForm com codigo html
            cmtForm = `
                <div class="cmtUser">Comentando como <em>${user.displayName}</em>:</div>
                <form method="post" id="formComment" name="formComment">
                    <textarea name="txtContent" id="txtContent">Comentário fake para testes</textarea>
                    <button type="submit">Enviar</button>
                </form>
            `
            //Insere o formulário na página HTML, na div com id commentForm.
            $('#commentForm').html(cmtForm)
            //Chama a função sendComment com os parâmetros necessários para enviar o comentário para o servidor.
            $('#formComment').submit((event) => {
                sendComment(event, artData, user)
            })
            // se o usuario nao estiver logado, exibe o codigo html abaixo com um botao para o usuario logar no app paa poder comentar
        } else {
            cmtForm = `<p class="center"><a href="login">Logue-se</a> para comentar.</p>`
            $('#commentForm').html(cmtForm)
        }
    })

}
//funcao que pega os comentarios
function sendComment(event, artData, userData) {
//Impede o comportamento de envio de formulário padrão do navegador.
    event.preventDefault()
   //remove todas as tags html usando "stripHtml" e remove espacos do inicio e final com "trim"
    var content = stripHtml($('#txtContent').val().trim())
//define o valor do "txtContent"
    $('#txtContent').val(content)
    //Verifica se o comentário está vazio e retorna false se estiver.
    if (content == '') return false

    const today = new Date()
    sysdate = today.toISOString().replace('T', ' ').split('.')[0]
// faz uma solicitacao get a api pegando o comentario pegando ID do usuário que enviou o comentário,  conteúdo do comentário e ID do artigo que o comentário foi enviado
    $.get(app.apiBaseURL + 'comments', {
            uid: userData.uid,
            content: content,
            article: artData.id
        })
        // se a solicitacao tiver sucesso, a funcao e executada
        .done((data) => {
 // verifica se já existe um comentário com o mesmo conteúdo
            if (data.length > 0) {
                //se houver um comentario com o mesmo conteudo, abre um popUp com a mensagem 'Ooops! Este comentário já foi enviado antes...'
                popUp({ type: 'error', text: 'Ooops! Este comentário já foi enviado antes...' })
                return false
            } 

        else {
// cria um objeto com os dados do comentário a ser enviado
                const formData = {
                    name: userData.displayName,
                    photo: userData.photoURL,
                    email: userData.email,
                    uid: userData.uid,
                    article: artData.id,
                    content: content,
                    date: sysdate,
                    status: 'on'
                }

                $.post(app.apiBaseURL + 'comments', formData)
                    .done((data) => {
                        if (data.id > 0) {
                            popUp({ type: 'success', text: 'Seu comentário foi enviado com sucesso!' })
                            loadpage('view')
                        }
                    })
                    .fail((err) => {
                        console.error(err)
                    })

            }
        })

}

function updateViews(artData) {
    $.ajax({
        type: 'PATCH',
        url: app.apiBaseURL + 'articles/' + artData.id,
        data: { views: parseInt(artData.views) + 1 }
    });
}