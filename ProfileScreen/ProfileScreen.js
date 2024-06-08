function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

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
        var postContainer = document.querySelector('.pin_container');
        if(!dataUser.posts){
            console.log("No hay posts.");

            var noPosts = document.createElement("div");
            noPosts.textContent = "No hay posts que mostrar :("
            postContainer.appendChild(noPosts); //FALTA FORMATO
        }else{
            console.log("Hay posts.");
            var postsArray = dataUser.posts;
            console.log(postsArray);

            postsArray.forEach( ()=> {
                var unPost = document.createElement("div");
                unPost.classList.add("card");
    
                var aleatorio = randomIntFromInterval(1,3);
                if(aleatorio === 1){
                    unPost.classList.add("card-small");
                } else if(aleatorio === 2){
                    unPost.classList.add("card-medium");
                } else{
                    unPost.classList.add("card-large");
                }
                postContainer.appendChild(unPost);
            });
        }

        // return a consola
        return dataUser;

    } catch (error) {
        console.error('ERROR REQUEST FETCH:', error);
    }
}

console.log(obtenerDatosUsuario(1));