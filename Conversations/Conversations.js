// // /getconversations/{userID}

// // const url = `http://localhost:9000/memeo/api/getconversations/${userID}`
// const url = `http://localhost:9000/memeo/api/getconversations/4`
// fetch(url)
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error =>console.log(error))

document.addEventListener('DOMContentLoaded', () => {
    const conversationsContainer = document.getElementById('conversations');

    // const user = JSON.parse(sessionStorage.getItem("user"));
    // if(!user){
    //     console.error("No se han encontrado datos de sesion de este usuario :(");
    //     return;
    // }

    const users = {
        4: "blackpanther",
        5: "theking",
        6: "spiderman",
        8: "ironman"
    };

    // Datos simulados temporales
    const simulatedData = [
        {
            conversationPK: { conversationID: 1, receiverUserID: 4, starterUserID: 5 },
            created_at: "2024-06-02T22:52:20.000+00:00",
            directMessages: [
                { senderID: 5, receiverID: 4, text: "Hola, ¿cómo estás?" },
                { senderID: 4, receiverID: 5, text: "¡Bien! ¿Y tú?" },
                { senderID: 5, receiverID: 4, text: "Estoy bien, gracias." }
            ]
        },
        {
            conversationPK: { conversationID: 2, receiverUserID: 6, starterUserID: 5 },
            created_at: "2024-06-03T15:34:10.000+00:00",
            directMessages: [
                { senderID: 5, receiverID: 6, text: "¿Qué tal tu día?" },
                { senderID: 6, receiverID: 5, text: "Ha sido genial, ¿y el tuyo?" }
            ]
        },
        {
            conversationPK: { conversationID: 3, receiverUserID: 8, starterUserID: 4 },
            created_at: "2024-06-04T10:10:10.000+00:00",
            directMessages: []
        }
    ];

    function displayLastMessage(conversation) {
        // si no hay mensajes omitimos la conversacion
        if (conversation.directMessages.length === 0) {
            return; 
        }

        const conversationDiv = document.createElement('div');
        conversationDiv.classList.add('conversation');

        const receiverUserID = conversation.conversationPK.receiverUserID;
        const receiverUserName = users[receiverUserID] || `User ${receiverUserID}`;
        const lastMessage = conversation.directMessages[conversation.directMessages.length - 1];

        const conversationTitle = document.createElement('h2');
        conversationTitle.textContent = `${receiverUserName}`;
        conversationDiv.appendChild(conversationTitle);

        const senderName = users[lastMessage.senderID] || `User ${lastMessage.senderID}`;
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.innerHTML = `<strong>${senderName}:</strong> ${lastMessage.text}`;
        conversationDiv.appendChild(messageDiv);

        conversationDiv.addEventListener('click', () => {
            const conversationID=conversation.conversationPK.conversationID;
            window.location.href = `../SingleConversationScreen/SingleConversationScreen.html?conversationID=${conversationID}`
        });

        conversationsContainer.appendChild(conversationDiv);
    }

    // usamos los datos simulados de momento
    simulatedData.forEach(conversation => displayLastMessage(conversation));
    
    // cuando haya conversaciones hacemos el fetch 
    // const url = `http://localhost:9000/memeo/api/getconversations/${user.userID}`
    // fetch(url)
    //     .then(response => response.json())
    //     .then(data => {
    //         data.forEach(conversation => displayLastMessage(conversation));
    //     })
    //     .catch(error => console.log(error));

});
