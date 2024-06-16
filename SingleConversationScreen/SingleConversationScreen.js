document.addEventListener("DOMContentLoaded", () => {
  const loggedUser = JSON.parse(sessionStorage.getItem("user"))

  // Function para que al enviar un mensaje "baje"
  function scrollToBottom() {
    const msgContainer = document.querySelector(".messagesContainer")
    msgContainer.scrollTop = msgContainer.scrollHeight
  }

  async function fetchAndSetMessages(conversationIDReceived) {
    try {
      const response = await fetch(
        `http://localhost:9000/memeo/api/getdms/${conversationIDReceived}`
      )

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`)
      }

      const dataMessages = await response.json()

      // Settear mensajes
      const msgContainer = document.querySelector(".messagesContainer")
      msgContainer.innerHTML = ""

      dataMessages.forEach((dm) => {
        // dm es el objeto mensaje
        const containerMessage = document.createElement("div")
        containerMessage.textContent = `${dm.text_content}`

        if (dm.senderUser.userID === loggedUser.userID) {
          // Se crea y va a la derecha
          containerMessage.classList.add("sent")
        } else {
          // Set conversation title
          const conversationWithTitle =
            document.querySelector(".conversationWith")
          conversationWithTitle.textContent = dm.senderUser.username

          // Se crea y va a la izquierda
          containerMessage.classList.add("received")
        }
        msgContainer.appendChild(containerMessage)
      })

      scrollToBottom()
    } catch (error) {
      console.error("ERROR REQUEST FETCH:", error)
    }
  }

  async function sendMessage(
    conversationIDReceived,
    messageContent,
    loggedUser,
    isNew
  ) {
    let idConversation = ""
    if (isNew) {
      const createConversation = {
        conversationPK: {
          receiverUserID: conversationIDReceived,
          starterUserID: loggedUser.userID,
        },
      }
      try {
        const response = await fetch(
          "http://localhost:9000/memeo/api/createconversation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(createConversation),
          }
        )
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText)
        }
        const dataConversation = await response.json()
        idConversation = dataConversation.conversationPK.conversationID
      } catch (error) {
        console.error("Error catch (1)", error)
      }
    }
    const messageData = {
      text_content: messageContent.value.trim(), // Eliminar espacios en blanco
      senderUser: {
        username: loggedUser.username,
        userID: loggedUser.userID,
      },
    }

    if (messageData.text_content === "") {
      return // evitar enviar mensaje vacío, además de required
    }

    messageContent.value = "" // Limpiar el campo de mensaje
    let url = "http://localhost:9000/memeo/api/createdm/"
    if (isNew) {
      url += idConversation
      conversationIDReceived = idConversation
    } else {
      url += conversationIDReceived
    }
    try {
      const response = await fetch(`${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText)
      }
      // Recargar los mensajes después de enviar el nuevo mensaje
      fetchAndSetMessages(conversationIDReceived)
    } catch (error) {
      console.error("Error catch (1)", error)
    }
  }

  function setupEventListeners(conversationIDReceived, isNew = false) {
    const sentMessage = document.querySelector(".submitInput")
    const messageContent = document.getElementById("inputMessage")

    sentMessage.addEventListener("click", (event) => {
      event.preventDefault()
      sendMessage(conversationIDReceived, messageContent, loggedUser, isNew)
    })
  }

  async function fetchUserData() {
    const params = new URLSearchParams(window.location.search)
    const conversationIDReceived = params.get("conversationID")
    const idReceived = params.get("receivedID")
    const isNew = params.get("isNew") === "true"
    if (isNew) {
      setupEventListeners(idReceived, isNew)
    } else {
      setupEventListeners(conversationIDReceived ?? idReceived)
      fetchAndSetMessages(conversationIDReceived ?? idReceived)
    }
  }

  fetchUserData()
})
