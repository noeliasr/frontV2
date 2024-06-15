// para asegurarnos de que carga antes de tirar el evento
document.addEventListener("DOMContentLoaded", () => {
  let mybutton = document.getElementById("circularBtnScroll")
  mybutton.addEventListener("click", () => scrollToTop())
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
      const editProfileButton = document.querySelector(".editProfileA")
      const followButton = document.querySelector(".followButtonA")
      const logOutButton = document.querySelector(".logOutButtonA")

      if (receiverUserID == null) {
        //valoramos null y ponemos el loggeado

        var url = `http://localhost:9000/memeo/api/getuser/${loggedUser.userID}`
        editProfileButton.classList.remove("hidden")
        followButton.classList.add("hidden")
        logOutButton.classList.remove("hidden")
      } else if (receiverUserID === loggedUser.userID) {
        // si el userID recibido es el del logged

        var url = `http://localhost:9000/memeo/api/getuser/${loggedUser.userID}`
        editProfileButton.classList.remove("hidden")
        followButton.classList.add("hidden")
        logOutButton.classList.remove("hidden")
      } else {
        var url = `http://localhost:9000/memeo/api/getuser/${receiverUserID}`
        editProfileButton.classList.add("hidden")
        followButton.classList.remove("hidden")
        logOutButton.classList.add("hidden")

        console.log(loggedUser)

        var contador = 0
        var followingUserFromUser = null
        var followingUserToUser = null

        console.log(loggedUser.following)

        loggedUser.following.forEach((followingUser) => {
          if (followingUser.toUser == receiverUserID) {
            contador++
            followingUserFromUser = followingUser.fromUser
            followingUserToUser = followingUser.toUser

            // console.log("SÍ followingUser.toUser = " + followingUser.toUser  + " -- receiverUserID = " + receiverUserID)
          } else {
            // console.log("NO followingUser.toUser = " + followingUser.toUser  + " -- receiverUserID = " + receiverUserID)
          }
        })

        if (contador == 1) {
          // si se siguen: botón en following
          followButton.textContent = "FOLLOWING"
          followButton.classList.add("followingState")

          followButton.addEventListener("click", async () => {
            // DELETE FOLLOWING RELATION -> /deletefollower/{fromUserID}/{toUserID}
            try {
              const response = await fetch(
                `http://localhost:9000/memeo/api/deletefollower/${followingUserFromUser}/${followingUserToUser}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              )

              if (!response.ok) {
                throw new Error(
                  "Network response was not ok " + response.statusText
                )
              } else {
                window.location.href = "../ProfileScreen/ProfileScreen.html"
              }
            } catch (error) {
              console.error("Last catch error:", error)
            }

            // updateamos en session eliminado
            const updateFollowing = loggedUser.following.filter(
              (fo) => fo.toUser != followingUserToUser
            )
            loggedUser.following = updateFollowing
            sessionStorage.setItem("user", JSON.stringify(loggedUser))

            followButton.textContent = "FOLLOW"
            followButton.classList.add("followState")
          })
        } else {
          //si no se siguen: botón en follow
          followButton.textContent = "FOLLOW"
          followButton.classList.add("followState")

          followButton.addEventListener("click", async () => {
            // CREATE FOLLOWING RELATION -> POST
            const follower = {
              fromUser: {
                userID: loggedUser.userID,
              },
              toUser: {
                userID: receiverUserID,
              },
            }

            try {
              const response = await fetch(
                `http://localhost:9000/memeo/api/createfollower`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(follower),
                }
              )

              if (!response.ok) {
                throw new Error(
                  "Network response was not ok " + response.statusText
                )
              } else {
                window.location.href = "../ProfileScreen/ProfileScreen.html"
              }
            } catch (error) {
              console.error("Last catch error:", error)
            }

            // updateamos en session añadido
            const userFollowed = await response.json()

            const updateFollowing = loggedUser.following.push(userFollowed)
            loggedUser.following = updateFollowing
            sessionStorage.setItem("user", JSON.stringify(loggedUser))

            followButton.textContent = "FOLLOWING"
            followButton.classList.add("followingState")
          })
        }
      }

      // funcionalidad al botón de logout
      // logOutButton.addEventListener("click", async function () {
      //   //
      // })

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
        console.log("Comprobación: Nº de posts " + postsArray.length)

        postsArray.reverse().forEach((post) => {
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

  /*BTN SCROLL TO TOP */

  window.onscroll = function () {
    scrollFunction()
  }

  const scrollFunction = () => {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      mybutton.style.display = "block"
    } else {
      mybutton.style.display = "none"
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
})
