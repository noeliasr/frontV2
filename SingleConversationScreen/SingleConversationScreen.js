// para asegurarnos de que carga antes de tirar el evento
document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = JSON.parse(sessionStorage.getItem("user"))

    // try-catch  fetch and set messages
    async function fetchAndSetMessages(dataConversationSelection){
        try {
            const response = await fetch(`http://localhost:9000/memeo/api/getdms/${dataConversationSelection.conversationPK.conversationID}`);

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
    
            const dataMessages = await response.json();
            console.log("DATA MESSAGES:")
            console.log(dataMessages); //dataMessages ya es un array

            // settear mensajes
            var msgContainer = document.querySelector('.messagesContainer');
            
            dataMessages.forEach( (dm)=> { //dm es el objeto mensaje
                if(dm.senderUser.userID === loggedUser.userID){
                    //se crea y va a la derecha
                    var containerMessage = document.createElement("div");
                    containerMessage.classList.add('sent');
                    containerMessage.textContent = `${dm.text_content}`;
                    msgContainer.appendChild(containerMessage);
                } else{
                    //set conversation title
                    var conversationWithTitle = document.querySelector(".conversationWith");
                    conversationWithTitle.textContent = dm.senderUser.username

                    //se crea y va a la izquierda
                    var containerMessage = document.createElement("div");
                    containerMessage.classList.add('received');
                    containerMessage.textContent = `${dm.text_content}`;
                    msgContainer.appendChild(containerMessage);

                }
            });

        } catch (error) {
            console.error('ERROR REQUEST FETCH:', error);
        }
    }

    async function fetchUserData() {
        const url = `http://localhost:9000/memeo/api/getconversations/${loggedUser.userID}`;

        //qué conversación es?
        const params = new URLSearchParams(window.location.search);
        const conversationIDReceived = params.get('conversationID');

        // boton submit mensaje
        var sentMessage = document.querySelector('.submitInput')
        var messageContent = document.getElementById('inputMessage');
        
        sentMessage.addEventListener("click", (event) => {
            event.preventDefault()

            const messageData = {
                "text_content" : messageContent.value,
                "senderUser" : {
                    "username" : loggedUser.username,
                    "userID" : loggedUser.userID
                }
            }

            try {
                // console.log(dataConversationSelection.conversationPK.conversationID)
                // console.log(dataConversationSelection.conversationPK.starterUserID)
                // console.log(dataConversationSelection.conversationPK.receiverUserID)
                // debugger

                const response = fetch(`http://localhost:9000/memeo/api/createdm/${dataConversationSelection.conversationPK.conversationID}/${dataConversationSelection.conversationPK.starterUserID}/${dataConversationSelection.conversationPK.receiverUserID}`,
                    {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(messageData),
                    }
                )

                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText)
                }

            } catch (error) {
                console.error("Error catch (1)", error)
            }

            // reload to show new message
            fetchUserData();
        })

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }

            const dataConversation = await response.json();
            if(!dataConversation){
                console.error("No está cogiendo conversaciones.")
            } else{
                console.log("Sí coge conversaciones:")
                console.log(dataConversation)

                var dataConversationSelection = null

                dataConversation.forEach(conversation => {
                    try {
                        if(conversation.conversationPK.conversationID == conversationIDReceived){
                            console.log("Yes, conversation.conversationID: " + conversation.conversationPK.conversationID + " y " + "conversationIDReceived: " + conversationIDReceived)
                            dataConversationSelection = conversation
    
                            // console.log("Hemos encontrado y lo guardamos en dataConversationSelection: ")
                            // console.log(conversation)
                        }
                    } catch (error) {
                        console.error("No corresponde: conversation.conversationID ningún conversationIDReceived (?)")
                        console.error('Sent error:', error);
                    }
                });

                //necesitamos saber quién es el starterConversation y el recieverConversation
                if(dataConversationSelection.conversationPK.starterUserID == loggedUser.userID){ // usuario loggeado es el que inició la conversación 
                    if(dataConversationSelection.directMessages == 0){
                        console.log("No hay mensajes.");
    
                        var noMensajes = document.createElement("div");
                        noMensajes.textContent = "No hay mensajes que mostrar :("
                        msgContainer.appendChild(noMensajes); //FALTA ESTILO
    
                    } else{
                        console.log("Hay mensajes.");

                        // fetch and set messages
                        fetchAndSetMessages(dataConversationSelection);
                        
                    }
                } else{ //qué sucede cuando el starter no es el loggeado
                    if(dataConversationSelection.directMessages == 0){
                        console.log("No hay mensajes.");
    
                        var noMensajes = document.createElement("div");
                        noMensajes.textContent = "No hay mensajes que mostrar :("
                        msgContainer.appendChild(noMensajes); 
    
                    } else{
                        console.log("Hay mensajes.");

                        // fetch and set messages
                        fetchAndSetMessages(dataConversationSelection);
                    }
                }
                
                return dataConversation;
            }
        
        } catch (error) {
            console.error("Error en el fetch de los mensajes directos (1)");
            console.error('ERROR REQUEST FETCH:', error);
        }
    }

    fetchUserData();
});