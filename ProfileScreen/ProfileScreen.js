// para asegurarnos de que carga antes de tirar el evento
document.addEventListener("DOMContentLoaded", (event) => {
  //   const params = new URLSearchParams(window.location.search)
  //   const userID = params.get("userID")
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  async function fetchUserData() {
    const loggedUser = JSON.parse(sessionStorage.getItem("user"))
    const url = `http://localhost:9000/memeo/api/getuser/${loggedUser.userID}`
    // let url = "http://localhost:9000/memeo/api/getuser/"
    // if (userID === sessionStorage.getItem("user")) {
    //   url += loggedUser.userID
    // } else {
    //     url += userID
    //     button.style.display="none" --> hacerlo bien
    // }

    try {
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
        console.log("Array de post:" + postsArray)

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
