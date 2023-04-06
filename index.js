$(document).ready(myApp)

function myApp() {
    // carrega a página inicial
    loadpage('contacts')



}
// carrega uma página
function loadpage(page) {

    // montar os caminhos para os componentes da pagina solicitada.
    const path = {
        html: `/pages/${page}/index.html`,
        css: `/pages/${page}/index.css`,
        js: `pages/${page}/index.js`
    }
    $.get(path.html).done((data) => {
        $('main').html(data)
    })
        .fail((error) => {
            loadpage('e404')

        })
}
