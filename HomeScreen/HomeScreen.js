document.addEventListener("DOMContentLoaded", () => {
  //creo las variables del dom
  const modals = document.querySelectorAll(".modal")
  const toggleBtns = document.querySelectorAll(".toggle-btn")

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
  const loginError = document.getElementById("login-error-message")

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault()

    const username = document.getElementById("username-login").value
    const password = document.getElementById("password-login").value

    try {
      const response = await fetch("http://localhost:9000/memeo/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      })
      if (!response.ok) {
        loginError.style.display = "block"
        throw new Error("Network response was not ok " + response.statusText)
      }
      const user = await response.json()
      if (user.userID) {
        sessionStorage.setItem("user", JSON.stringify(user))
        window.location.href = "../FeedScreen/FeedScreen.html"
      } else {
        loginError.style.display = "block"
      }
    } catch (error) {
      console.error("Error getting user:", error)
    }
  })

  //sign in
  const signinForm = document.getElementById("signin-form")
  const signinError = document.getElementById("signin-error-message")

  signinForm.addEventListener("submit", async function (event) {
    event.preventDefault()

    const name = document.getElementById("name").value
    const surname = document.getElementById("surname").value
    const email = document.getElementById("email").value
    const username = document.getElementById("username-signin").value
    const password = document.getElementById("password-signin").value
    const birth_date = document.getElementById("birth_date").value

    const avatar = document.getElementById("avatar")
    let avatarBase64 = ""
    const file = avatar.files[0]
    const reader = new FileReader()
    reader.onloadend = async function () {
      avatarBase64 = reader.result.replace("data:", "").replace(/^.+,/, "")

      const request = {
        user: {
          name: name,
          surname: surname,
          email: email,
          username: username,
          birth_date: birth_date,
          avatar: avatarBase64,
        },
        password: password,
      }

      try {
        const response = await fetch("http://localhost:9000/memeo/api/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        })
        if (!response.ok) {
          signinError.style.display = "block"
          throw new Error("Network response was not ok " + response.statusText)
        }
        const user = await response.json()
        if (user.userID) {
          sessionStorage.setItem("user", JSON.stringify(user))
          window.location.href = "../FeedScreen/FeedScreen.html"
        } else {
          signinError.style.display = "block"
        }
      } catch (error) {
        console.error("That username already exists:", error)
      }
    }
    reader.readAsDataURL(file)
  })

  // logout
  //mover a FeedScreen y/o a ProfileScreen
  // const logoutButton = document.getElementById("logout-button")

  // logoutButton.addEventListener("click", function () {
  //   fetch("http://localhost:9000/logout", {
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
