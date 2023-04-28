// configuração do firebase para o site do danLima

const firebaseConfig = {
    apiKey: "AIzaSyAX2bYwaZsNYc9VKG9kimBCoQboAmmWGk8",
    authDomain: "frontendeirosss.firebaseapp.com",
    projectId: "frontendeirosss",
    storageBucket: "frontendeirosss.appspot.com",
    messagingSenderId: "1057465817692",
    appId: "1:1057465817692:web:ec56a5970171db78416499",
    measurementId: "G-PGNCJRE2ER"
  };

 // Importa o "core" do Firebase.
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";

 // Importa o Authentication do Firebase.
 import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
 
 // Initializa o Firebase.
const fbapp = initializeApp(firebaseConfig);

// Inicializa o mecanismo de autenticação.
const auth = getAuth();

// Especifica o provedor de autenticação.
const provider = new GoogleAuthProvider();

// Observa o status de autenticação do usuário.
onAuthStateChanged(auth, (user) => {
    if (user) {
        sessionStorage.userData = JSON.stringify({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid,
            created: user.metadata.createdAt,
            lastLogin: user.metadata.lastLoginAt 
        })
    } else {
        delete sessionStorage.userData
    }
});

// Executa a jQuery quando o documento estiver pronto.
$(document).ready(myFirebase)

function myFirebase() {

    // Detecta cliques no botão de login.
    $('#navUser').click(login)
}

function login() {

    // Se não está logado...
    if (!sessionStorage.userData) {

        // Faz login usando popup.
        signInWithPopup(auth, provider)

            // Se logou corretamente.
            .then(() => {

                // Redireciona para a 'home'.
                location.href = '/home'
            })

        // Se está logado..
    } else

        // Redireciona para 'profile'.
        location.href = '/profile'
        return false
}