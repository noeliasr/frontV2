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

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault()

    const username = document.getElementById("username-login").value
    const password = document.getElementById("password-login").value

    fetch("http://172.20.10.3:9000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`,
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "../FeedScreen/FeedScreen.html" //CONSEGUIR EL USUARIO REGISTRADO
        } else {
          errorMessage.style.display = "block"
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
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
