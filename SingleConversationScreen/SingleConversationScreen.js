// para asegurarnos de que carga antes de tirar el evento
document.addEventListener("DOMContentLoaded", () => {
  const loggedUser = JSON.parse(sessionStorage.getItem("user"))

  // try-catch to fetch and set messages
  async function fetchAndSetMessages(conversationIDReceived) {
    try {
      const response = await fetch(
        `http://localhost:9000/memeo/api/getdms/${conversationIDReceived}`
      )

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`)
      }

      const dataMessages = await response.json()

      // settear mensajes
      const msgContainer = document.querySelector(".messagesContainer")
      msgContainer.innerHTML = ""

      dataMessages.forEach((dm) => {
        //dm es el objeto mensaje
        if (dm.senderUser.userID === loggedUser.userID) {
          //se crea y va a la derecha
          const containerMessage = document.createElement("div")
          containerMessage.classList.add("sent")
          containerMessage.textContent = `${dm.text_content}`
          msgContainer.appendChild(containerMessage)
        } else {
          //set conversation title
          const conversationWithTitle =
            document.querySelector(".conversationWith")
          conversationWithTitle.textContent = dm.senderUser.username

          //se crea y va a la izquierda
          const containerMessage = document.createElement("div")
          containerMessage.classList.add("received")
          containerMessage.textContent = `${dm.text_content}`
          msgContainer.appendChild(containerMessage)
        }
      })
    } catch (error) {
      console.error("ERROR REQUEST FETCH:", error)
    }
  }

  async function fetchUserData() {
    //qué conversación es?
    const params = new URLSearchParams(window.location.search)
    const conversationIDReceived = params.get("conversationID")

    // boton submit mensaje
    const sentMessage = document.querySelector(".submitInput")
    const messageContent = document.getElementById("inputMessage")

    sentMessage.addEventListener("click", async (event) => {
      event.preventDefault()

      const messageData = {
        text_content: messageContent.value,
        senderUser: {
          username: loggedUser.username,
          userID: loggedUser.userID,
        },
      }
      messageContent.value = ""
      try {
        const response = await fetch(
          `http://localhost:9000/memeo/api/createdm/${conversationIDReceived}`,
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
      fetchUserData()
    })
    fetchAndSetMessages(conversationIDReceived)
  }
  fetchUserData()
})
