document.addEventListener("DOMContentLoaded", () => {
  function formateoFecha(fecha) {
    var date = new Date(fecha)
    var dia = date.getDate()
    var mes = date.getMonth() + 1
    var año = date.getFullYear()

    dia = dia < 10 ? "0" + dia : dia
    mes = mes < 10 ? "0" + mes : mes

    return `${dia}-${mes}-${año}`
  }

  const loggedUser = JSON.parse(sessionStorage.getItem("user"))

  var imageURL = document.getElementById("profileImage")
  var inputUsername = document.getElementById("inputUsername")
  var inputName = document.getElementById("inputName")
  var inputSurname = document.getElementById("inputSurname")
  var inputBirthdate = document.getElementById("inputBirthdate")
  var infoP = document.getElementById("signInDate")

  async function fetchUserData() {
    const url = `http://localhost:9000/memeo/api/getuser/${loggedUser.userID}`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`)
      }

      const dataUser = await response.json()
      imageURL.src = `http://localhost:9000/${dataUser.avatar}`
      inputUsername.value = dataUser.username
      inputName.value = dataUser.name
      inputSurname.value = dataUser.surname
      inputBirthdate.value = formateoFecha(dataUser.birth_date)
      infoP.textContent = `You registered on meme-o on ${formateoFecha(
        dataUser.signup_date
      )}`

      // return a consola
      return dataUser
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const saveButtonAct = document.querySelector(".submitA")
  saveButtonAct.addEventListener("click", async function (event) {
    event.preventDefault()

    const avatar = document.getElementById("avatar")

    const userID = loggedUser.userID
    const username = loggedUser.username
    const name = loggedUser.name
    const surname = loggedUser.surname
    const email = loggedUser.email
    const birth_date = loggedUser.birth_date
    const signup_date = loggedUser.signup_date

    let avatarBase64 = ""
    var file = avatar.files[0]
    var reader = new FileReader()

    reader.onloadend = async function () {
      avatarBase64 = reader.result.replace("data:", "").replace(/^.+,/, "")

      const user = {
        userID: userID,
        username: username,
        name: name,
        surname: surname,
        email: email,
        signup_date: signup_date,
        birth_date: birth_date,
        avatar: avatarBase64,
      }

      try {
        const response = await fetch(
          `http://localhost:9000/memeo/api/updateuser/${userID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        )

        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText)
        } else {
          window.location.href = "../ProfileScreen/ProfileScreen.html"
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }
    reader.readAsDataURL(file)
  })

  fetchUserData()
})
