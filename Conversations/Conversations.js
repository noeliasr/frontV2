document.addEventListener("DOMContentLoaded", () => {
  const conversationsContainer = document.getElementById("conversations")

  const user = JSON.parse(sessionStorage.getItem("user"))
  if (!user) {
    console.error("No se han encontrado datos de sesion de este usuario :(")
    return
  }

  async function displayLastMessage(conversation) {
    // si no hay mensajes omitimos la conversacion
    if (conversation.directMessages.length === 0) {
      return
    }

    const conversationDiv = document.createElement("div")
    conversationDiv.classList.add("conversation")
    conversationDiv.tabIndex = 0

    let titleNameConversation = ""

    if (conversation.conversationPK.receiverUserID === user.userID) {
      try {
        const response = await fetch(
          `http://localhost:9000/memeo/api/getuser/${conversation.conversationPK.starterUserID}`
        )

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status}`)
        }

        const dataUserTitle = await response.json()
        titleNameConversation = dataUserTitle.username
      } catch (error) {
        console.error(
          "Error en la petición del dataUserTitle para el título de la conversación (2)"
        )
        console.error("ERROR REQUEST FETCH:", error)
      }
    } else {
      try {
        const response = await fetch(
          `http://localhost:9000/memeo/api/getuser/${conversation.conversationPK.receiverUserID}`
        )

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status}`)
        }

        const dataUserTitle = await response.json()
        titleNameConversation = dataUserTitle.username
      } catch (error) {
        console.error(
          "Error en la petición del dataUserTitle para el título de la conversación (2)"
        )
        console.error("ERROR REQUEST FETCH:", error)
      }
    }

    // const receiverUserName = users[receiverUserID];

    const lastMessage =
      conversation.directMessages[conversation.directMessages.length - 1]

    const conversationTitle = document.createElement("h2")
    conversationTitle.textContent = titleNameConversation
    conversationDiv.appendChild(conversationTitle)

    // const senderName = user[lastMessage.senderID] || `User ${lastMessage.senderID}`;
    const messageDiv = document.createElement("div")
    messageDiv.classList.add("message")
    messageDiv.innerHTML = `<strong>${
      conversation.conversationPK.senderID === user.userID
        ? user.username
        : titleNameConversation
    }:</strong> ${lastMessage.text_content}`
    conversationDiv.appendChild(messageDiv)

    conversationDiv.addEventListener("click", () => {
      const conversationID = conversation.conversationPK.conversationID
      window.location.href = `../SingleConversationScreen/SingleConversationScreen.html?conversationID=${conversationID}`
    })

    conversationsContainer.appendChild(conversationDiv)
  }

  // cuando haya conversaciones hacemos el fetch
  const url = `http://localhost:9000/memeo/api/getconversations/${user.userID}`
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((conversation) => displayLastMessage(conversation))
    })
    .catch((error) => console.log(error))
})
