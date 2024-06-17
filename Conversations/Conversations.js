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
    let userID =
      conversation.conversationPK.receiverUserID === user.userID
        ? conversation.conversationPK.starterUserID
        : conversation.conversationPK.receiverUserID
    let urlGetUser = `http://localhost:9000/memeo/api/getuser/${userID}`
    try {
      const response = await fetch(urlGetUser)

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`)
      }

      const dataUserTitle = await response.json()
      titleNameConversation = dataUserTitle.username
    } catch (error) {
      console.error("Error:", error)
    }

    const lastMessage =
      conversation.directMessages[conversation.directMessages.length - 1]

    const conversationTitle = document.createElement("h2")
    conversationTitle.textContent = titleNameConversation
    conversationDiv.appendChild(conversationTitle)

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
