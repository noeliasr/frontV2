async function obtenerDatosUsuario(userID) {
    const url = `http://192.168.56.1:9000/memeo/api/getuser/${userID}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const dataUser = await response.json();

        // setteo de variables
        var usernameH3 = document.getElementById('usernameHeader');
        usernameH3.textContent = dataUser.username;

        var imageURL = document.getElementById('profileImage');
        imageURL.src = dataUser.avatar;

        // settear posts
        var postContainer = document.getElementById('pin_container');
        if(!dataUser.posts){
            console.log("no tiene posts")
            var noPosts = document.createElement("p")
        }else{
            console.log("POST POST")
            var noPosts = document.createElement("p")
        }

        // return a consola
        return dataUser;

    } catch (error) {
        console.error('ERROR REQUEST FETCH:', error);
    }
}

console.log(obtenerDatosUsuario(1));