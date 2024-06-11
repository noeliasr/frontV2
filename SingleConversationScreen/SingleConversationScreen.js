// // para asegurarnos de que carga antes de tirar el evento
// document.addEventListener('DOMContentLoaded', (event) => {
//     obtenerDatosConversacion(1);
// });

// coger el userID del primer mensaje y buscar el siguiente userID que no sea igual,
// ese será el que habrá que mostrar en el título


async function obtenerDatosConversacion(userID) {
    const url = `http://192.168.56.1:9000/memeo/api/getmessages/${userID}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const dataConversation = await response.json();

        // setteo de variables
        var senderUserH3 = document.querySelector(".senderUserH");
        senderUserH3.textContent = dataConversation.; // json??

        // settear mensajes
        var msgContainer = document.querySelector('.messagesContainer');

        if(!dataConversation.){ // json??
            console.log("No hay mensajes.");

            var noMensajes = document.createElement("div");
            noMensajes.textContent = "No hay posts que mostrar :("
            msgContainer.appendChild(noMensajes); //FALTA ESTILO

        }else{
            console.log("Hay mensajes.");

            var mensajesArray = dataConversation.; // json?
            console.log("Array de post:" + mensajesArray);

            mensajesArray.forEach( (mensajes)=> {
                // CÓDIGO REVISADO HASTA AQUÍ
                var containerPost = document.createElement("div");
                containerPost.classList.add("card");

                var aleatorio = randomIntFromInterval(1,3);
                if(aleatorio === 1){
                    containerPost.classList.add("card_small");

                } else if(aleatorio === 2){
                    containerPost.classList.add("card_medium");
                } else{
                    containerPost.classList.add("card_large");
                }
                pinContainer.appendChild(containerPost);

                var anImage = document.createElement("img");
                anImage.src = `http://192.168.56.1:9000/${post.media_file}`;
                anImage.alt = "Imagen de un post";
                anImage.classList.add("cardImage");
                containerPost.appendChild(anImage);
            });
        }

        // return a consola
        return dataUser;

    } catch (error) {
        console.error('ERROR REQUEST FETCH:', error);
    }
}

console.log(obtenerDatosConversacion(4));