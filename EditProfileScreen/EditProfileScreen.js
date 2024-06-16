document.addEventListener("DOMContentLoaded", () => {
  function formateoFecha(fecha) {
    let date = new Date(fecha)
    let dia = date.getDate()
    let mes = date.getMonth() + 1
    let año = date.getFullYear()

    dia = dia < 10 ? "0" + dia : dia
    mes = mes < 10 ? "0" + mes : mes

    return `${dia}-${mes}-${año}`
  }

  const loggedUser = JSON.parse(sessionStorage.getItem("user"))

  let imageURL = document.getElementById("profileImage")
  let inputUsername = document.getElementById("inputUsername")
  let inputName = document.getElementById("inputName")
  let inputSurname = document.getElementById("inputSurname")
  let inputBirthdate = document.getElementById("inputBirthdate")
  let infoP = document.getElementById("signInDate")

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
    let file = avatar.files[0]
    let reader = new FileReader()

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
