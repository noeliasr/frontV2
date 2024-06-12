// // para asegurarnos de que carga antes de tirar el evento
// document.addEventListener('DOMContentLoaded', (event) => {
//     obtenerDatosConversacion(1);
// });


async function obtenerDatosConversacion(userID) {
    const loggedUser = JSON.parse(sessionStorage.getItem("user"))
    // const url = `http://192.168.56.1:9000/memeo/api/getconversations/${loggedUser.userID}`;

    const url = `http://192.168.56.1:9000/memeo/api/getconversations/${userID}`;

    //qué conversación es?
    // const params = new URLSearchParams(window.location.search);
    // const conversationID = params.get('conversationID');

    var conversationID = 0; //hardcoded


    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const dataConversation = await response.json();
        
        if(!dataConversation){
            console.log("No está cogiendo conversaciones.")
        } else{
            console.log("Sí coge conversaciones.")
            console.log(dataConversation);

            // setteo de variables: persona con la que se mantiene la conversación
            var conversationWithUser = document.querySelector(".conversationWith");
            
            // lógica para saber cuál es el usuario sender-receiver//loggeado-remitente
            // if(dataConversation[conversationID].conversationPK.starterUserID == loggedUser.userID){ // userID del usuario loggeado
            if(dataConversation[conversationID].conversationPK.starterUserID == 4){ // hardcoded
                try {
                    const response = await fetch(`http://192.168.56.1:9000/memeo/api/getuser/${dataConversation[conversationID].conversationPK.receiverUserID}`);
                    
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }

                    const dataUserTitle = await response.json();
                    conversationWithUser.textContent = dataUserTitle.username;
                } catch (error) {
                    console.error("Error en la petición del dataUserTitle para el título de la conversación (1)")
                    console.error('ERROR REQUEST FETCH:', error);
                }

            } else{
                console.log("debería de salir si si")
                try {
                    const response = await fetch(`http://192.168.56.1:9000/memeo/api/getuser/${dataConversation[conversationID].conversationPK.starterUserID}`);
                    
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }

                    const dataUserTitle = await response.json();
                    conversationWithUser.textContent = dataUserTitle.username;
                } catch (error) {
                    console.error("Error en la petición del dataUserTitle para el título de la conversación (2)")
                    console.error('ERROR REQUEST FETCH:', error);
                }
            }

        }


        // settear mensajes
        var msgContainer = document.querySelector('.messagesContainer');

        if(dataConversation[conversationID].directMessages == 0){
            console.log("No hay mensajes.");

            var noMensajes = document.createElement("div");
            noMensajes.textContent = "No hay mensajes que mostrar :("
            msgContainer.appendChild(noMensajes); //FALTA ESTILO

        }else{
            console.log("Hay mensajes.");

            try {
                const response = await fetch(`http://192.168.56.1:9000/memeo/api/getdms/${conversationID}`);

                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }
        
                const dataMessages = await response.json();
                console.log(dataMessages); //dataMessages ya es un array
                 
                dataMessages.forEach( (dm)=> {
                    if(dataMessages.senderUser.userID[dm] === loggedUser.userID){
                        //se crea y va a la derecha
                        var containerMessage = document.createElement("div");
                        containerMessage.classList.add('sent');
                        containerMessage.textContent = `${dataMessages.text_content}`;
                        msgContainer.appendChild(containerMessage);
                    } else{
                        //se crea y va a la izquierda
                        var containerMessage = document.createElement("div");
                        containerMessage.classList.add('received');
                        containerMessage.textContent = `${dataMessages.text_content}`;
                        msgContainer.appendChild(containerMessage);
                    }
                });

            } catch (error) {
                console.error("Error en el fetch de los mensajes directos (1)");
                console.error('ERROR REQUEST FETCH:', error);
            }

        }

        return dataConversation;

    } catch (error) {
        console.error('ERROR REQUEST FETCH:', error);
    }
}

console.log(obtenerDatosConversacion(4));