$(document).ready(myContacts)
// função principal da página home
function myContacts() {
// altera o titulo da página quando home for acessado
changeTitle('faça contato')
$(document).on('submit', '#cForm', sendContact)
}

function sendContact(ev) {

    var formJSON = {}

    const formData = new FormData(ev.target);

    for (const [key, value] of formData) {
        formJSON[key] = value
    }
 
    formJSON = JSON.stringify(formJSON)

    console.log(formJSON)
    
    // console.log(JSON.parse(formJSON))

    return false}