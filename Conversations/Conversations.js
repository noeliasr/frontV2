// // /getconversations/{userID}

// // const url = `http://localhost:9000/memeo/api/getconversations/${userID}`
// const url = `http://localhost:9000/memeo/api/getconversations/4`
// fetch(url)
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error =>console.log(error))

document.addEventListener('DOMContentLoaded', () => {
    const conversationsContainer = document.getElementById('conversations');

    const user = JSON.parse(sessionStorage.getItem("user"));
    if(!user){
        console.error("No se han encontrado datos de sesion de este usuario :(");
        return;
    }

    // const users = {
    //     4: "blackpanther",
    //     5: "theking",
    //     6: "spiderman",
    //     8: "ironman"
    // };

    // // Datos simulados temporales
    // const simulatedData = [
    //     {
    //         conversationPK: { conversationID: 1, receiverUserID: 4, starterUserID: 5 },
    //         created_at: "2024-06-02T22:52:20.000+00:00",
    //         directMessages: [
    //             { senderID: 5, receiverID: 4, text: "Hola, ¿cómo estás?" },
    //             { senderID: 4, receiverID: 5, text: "¡Bien! ¿Y tú?" },
    //             { senderID: 5, receiverID: 4, text: "Estoy bien, gracias." }
    //         ]
    //     },
    //     {
    //         conversationPK: { conversationID: 2, receiverUserID: 6, starterUserID: 5 },
    //         created_at: "2024-06-03T15:34:10.000+00:00",
    //         directMessages: [
    //             { senderID: 5, receiverID: 6, text: "¿Qué tal tu día?" },
    //             { senderID: 6, receiverID: 5, text: "Ha sido genial, ¿y el tuyo?" }
    //         ]
    //     },
    //     {
    //         conversationPK: { conversationID: 3, receiverUserID: 8, starterUserID: 4 },
    //         created_at: "2024-06-04T10:10:10.000+00:00",
    //         directMessages: []
    //     }
    // ];

    async function displayLastMessage(conversation) {
        // si no hay mensajes omitimos la conversacion
        if (conversation.directMessages.length === 0) {
            return; 
        }

        const conversationDiv = document.createElement('div');
        conversationDiv.classList.add('conversation');

        let titleNameConversation = "";

        if(conversation.conversationPK.receiverUserID === user.userID){
            try {
                
                const response = await fetch(`http://192.168.56.1:9000/memeo/api/getuser/${conversation.conversationPK.starterUserID}`);
                
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }

                const dataUserTitle = await response.json();
                titleNameConversation = dataUserTitle.username;
            } catch (error) {
                console.error("Error en la petición del dataUserTitle para el título de la conversación (2)")
                console.error('ERROR REQUEST FETCH:', error);
            }
        }else{
            try {
                const response = await fetch(`http://192.168.56.1:9000/memeo/api/getuser/${conversation.conversationPK.receiverID}`);
                
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }

                const dataUserTitle = await response.json();
                titleNameConversation = dataUserTitle.username;
            } catch (error) {
                console.error("Error en la petición del dataUserTitle para el título de la conversación (2)")
                console.error('ERROR REQUEST FETCH:', error);
            }
            
        }

        // const receiverUserName = users[receiverUserID];
        debugger
        const lastMessage = conversation.directMessages[conversation.directMessages.length - 1];

        const conversationTitle = document.createElement('h2');
        conversationTitle.textContent = titleNameConversation;
        conversationDiv.appendChild(conversationTitle);

        // const senderName = user[lastMessage.senderID] || `User ${lastMessage.senderID}`;
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.innerHTML = `<strong>${conversation.conversationPK.senderID === user.userID ? user.username : titleNameConversation}:</strong> ${lastMessage.text_content}`;
        conversationDiv.appendChild(messageDiv);

        conversationDiv.addEventListener('click', () => {
            const conversationID=conversation.conversationPK.conversationID;
            window.location.href = `../SingleConversationScreen/SingleConversationScreen.html?conversationID=${conversationID}`
        });

        conversationsContainer.appendChild(conversationDiv);
    }

    // usamos los datos simulados de momento
    // simulatedData.forEach(conversation => displayLastMessage(conversation));
    
    // cuando haya conversaciones hacemos el fetch 
    const url = `http://192.168.56.1:9000/memeo/api/getconversations/${user.userID}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(conversation => displayLastMessage(conversation));
        })
        .catch(error => console.log(error));

});
