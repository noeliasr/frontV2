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
  // usuario loggeado
  const loggedUser = JSON.parse(sessionStorage.getItem("user"))
  async function fetchUserData() {
    try {
      const editProfileButton = document.querySelector(".editProfileA")
      const followButton = document.querySelector(".followButtonA")
      const logOutButton = document.querySelector(".logOutButtonA")
      const conversationButton = document.querySelector(".conversationButtonA")
      let isNewConversation = false
      try {
        const response = await fetch(
          `http://localhost:9000/memeo/api/getconversations/${loggedUser.userID}`
        )
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText)
        }
        const conversationsList = await response.json()
        isNewConversation = !conversationsList.some(
          (conver) =>
            conver.conversationPK.receiverUserID === Number(receiverUserID) ||
            conver.conversationPK.starterUserID === Number(receiverUserID)
        )
      } catch (error) {
        console.error("Error fetching posts:", error)
      }

      conversationButton.href = `../SingleConversationScreen/SingleConversationScreen.html?receivedID=${receiverUserID}&isNew=${isNewConversation}`
      if (receiverUserID == null) {
        //valoramos null y ponemos el loggeado

        var url = `http://localhost:9000/memeo/api/getuser/${loggedUser.userID}`
        editProfileButton.classList.remove("hidden")
        //editProfileButton.tabindex = 0

        followButton.classList.add("hidden")
        logOutButton.classList.remove("hidden")
        conversationButton.classList.add("hidden")
      } else if (receiverUserID === loggedUser.userID) {
        // si el userID recibido es el del logged

        var url = `http://localhost:9000/memeo/api/getuser/${loggedUser.userID}`
        editProfileButton.classList.remove("hidden")
        //editProfileButton.tabindex = 0

        followButton.classList.add("hidden")
        conversationButton.classList.add("hidden")
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
          }
        })

        if (contador == 1) {
          // si se siguen: botón en following
          followButton.textContent = "FOLLOWING"
          followButton.classList.add("followingState")
          //followButton.tabindex = 0

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
          containerPost.tabIndex = 0

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
          containerPost.addEventListener("click", () => openModal(post))
        })
      }

      // return a consola
      return dataUser
    } catch (error) {
      console.error("ERROR REQUEST FETCH:", error)
    }
  }

  fetchUserData()

  /** MODAL */

  const modalAdd = document.querySelector("#modalAdd")
  const closeModalBtn = document.querySelector("#closeModalBtn")
  const idPost = document.getElementById("idPost")
  const imagenPost = idPost.querySelector("img")
  const username = document.getElementById("user")
  const comments = document.getElementById("idComment")
  const inputComment = document.getElementById("inputComment")
  const btnAddComment = document.getElementById("btnAddComment")
  closeModalBtn.addEventListener("click", () => closeModal())
  const openModal = (post) => {
    modalAdd.style.display = "flex"
    username.textContent = loggedUser.username
    imagenPost.src = `http://localhost:9000/${post.media_file}`

    loadComments(post)
  }

  const addCommentHandler = (post) => () => addComment(post)

  const closeModal = () => {
    modalAdd.style.display = "none"
  }

  //para guardar el evento cuando se crea
  let currentAddCommentHandler

  const loadComments = (post) => {
    if (post.comments.length === 0) {
      comments.style.display = "none"
    } else {
      comments.style.display = "flex"
      comments.innerHTML = ""
      post.comments.forEach((comment) => {
        const commentSpan = document.createElement("span")
        const commentContent = `<strong>${comment.user.username}</strong> ${comment.text_content}`
        commentSpan.innerHTML = commentContent
        comments.appendChild(commentSpan)
      })
    }
    inputComment.value = ""
    // eliminar el event listener anterior si existe
    if (currentAddCommentHandler) {
      btnAddComment.removeEventListener("click", currentAddCommentHandler)
    }
    currentAddCommentHandler = addCommentHandler(post)
    btnAddComment.addEventListener("click", currentAddCommentHandler)
  }

  const addComment = async (post) => {
    comments.style.display = "flex"
    const comment = {
      text_content: inputComment.value,
      user: {
        userID: loggedUser.userID,
        username: loggedUser.username,
      },
      post: {
        postID: post.postID,
      },
    }
    try {
      const response = await fetch(
        `http://localhost:9000/memeo/api/createcomment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(comment),
        }
      )
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    }

    post.comments.push(comment)
    loadComments(post)
  }

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
