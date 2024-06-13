// para asegurarnos de que carga antes de tirar el evento
document.addEventListener("DOMContentLoaded", () => {
  // función para elegir los tamaños de los posts
  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min) // min and max included
  }


  const params = new URLSearchParams(window.location.search)
  const receiverUserID = params.get("userID")

  async function fetchUserData() {
    // usuario loggeado
    const loggedUser = JSON.parse(sessionStorage.getItem("user"))


    try {
      if(receiverUserID == null) { //valoramos null y ponemos el loggeado
        var url = `http://localhost:9000/memeo/api/getuser/${loggedUser.userID}`

      } else if(receiverUserID === loggedUser.userID) { // si el userID recibido es el del logged
        var url = `http://localhost:9000/memeo/api/getuser/${loggedUser.userID}`

      } else{
        var url = `http://localhost:9000/memeo/api/getuser/${receiverUserID}`
        const editProfileButton = document.querySelector(".editProfileA");
        editProfileButton.style.display = "none"

        console.log("no es nuestro perfil, seguimos loggeados? : " + loggedUser.usename) //PROBLEMA!!!!!
      }

      console.log(url)

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`)
      }

      const dataUser = await response.json()
      console.log(dataUser)

      // setteo de variables
      var usernameH3 = document.getElementById("usernameHeader")
      usernameH3.textContent = dataUser.username

      var imageURL = document.getElementById("profileImage")
      imageURL.src = `http://localhost:9000/${dataUser.avatar}`

      var followerCount = document.querySelector(".followerCount")
      followerCount.textContent = `${dataUser.followers.length}`

      var followingCount = document.querySelector(".followingCount")
      followingCount.textContent = `${dataUser.following.length}`

      // settear posts
      var pinContainer = document.querySelector(".pin_container")
      var titlePin_container = document.querySelector(".titlePin_container")

      if (dataUser.posts.length == 0) {
        console.log("No hay posts.")

        var noPosts = document.createElement("p")
        noPosts.classList.add("noPostStyle")
        noPosts.innerHTML =
          "We're so sorry! There are no posts here... :( <br><br> Atte: meme-o team <3"
        titlePin_container.appendChild(noPosts)
      } else {
        console.log("Hay posts.")

        var postsArray = dataUser.posts
        console.log("Comprobación: Número de posts" + postsArray.length)

        postsArray.forEach((post) => {
          var containerPost = document.createElement("div")
          containerPost.classList.add("card")

          var aleatorio = randomIntFromInterval(1, 3)
          if (aleatorio === 1) {
            containerPost.classList.add("card_small")
          } else if (aleatorio === 2) {
            containerPost.classList.add("card_medium")
          } else {
            containerPost.classList.add("card_large")
          }
          pinContainer.appendChild(containerPost)

          var anImage = document.createElement("img")
          anImage.src = `http://localhost:9000/${post.media_file}`
          anImage.alt = "Imagen de un post"
          anImage.classList.add("cardImage")
          containerPost.appendChild(anImage)
        })
      }

      // return a consola
      return dataUser
    } catch (error) {
      console.error("ERROR REQUEST FETCH:", error)
    }
  }

  fetchUserData()
})
