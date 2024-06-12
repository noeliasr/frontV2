document.addEventListener("DOMContentLoaded", () => {
  //creo las variables del dom
  const modals = document.querySelectorAll(".modal")
  const toggleBtns = document.querySelectorAll(".toggle-btn")
  const closeBtns = document.querySelectorAll(".close-btn")

  //función para añadir la clase open al modal
  const openModal = (index) => {
    modals[index].classList.add("open")
  }

  //para cada botón, le asigno un evento para abrir el modal del index de ese botón
  //ya que habrá la misma cantidad de botones que de modales
  toggleBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      openModal(index)
    })
  })

  //para cerrar el modal pulsando fuera
  window.addEventListener("click", (e) => {
    if (e.target.className === "modal-wrapper") {
      modals.forEach((modal) => {
        modal.classList.remove("open")
      })
    }
  })

  // login
  const loginForm = document.getElementById("login-form")
  const errorMessage = document.getElementById("error-message")

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault()

    const username = document.getElementById("username-login").value
    const password = document.getElementById("password-login").value

    try {
      const response = await fetch("http://192.168.1.86:9000/memeo/api/hola", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      })
      if (!response.ok) {
        errorMessage.style.display = "block"
        throw new Error("Network response was not ok " + response.statusText)
      }
      const user = await response.json()
      if (user.userID) {
        sessionStorage.setItem("user", JSON.stringify(user))
        window.location.href = "../FeedScreen/FeedScreen.html"
      } else {
        errorMessage.style.display = "block"
      }
    } catch (error) {
      console.error("Error getting user:", error)
    }
  })

  // logout
  //mover a FeedScreen y/o a ProfileScreen
  // const logoutButton = document.getElementById("logout-button")

  // logoutButton.addEventListener("click", function () {
  //   fetch("http://192.168.1.59:9000/logout", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     credentials: "include",
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         window.location.href = "../HomeScreen/HomeScreen.html" // PANTALLA HOME SCREEN
  //       } else {
  //         console.error("Logout failed")
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error)
  //     })
  // })
})
