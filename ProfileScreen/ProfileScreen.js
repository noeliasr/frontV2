document.addEventListener("DOMContentLoaded", () => {
  let mybutton = document.getElementById("circularBtnScroll")
  mybutton.addEventListener("click", () => scrollToTop())
  const btnDeletePost = document.querySelector(".btnDeletePost")
  const params = new URLSearchParams(window.location.search)
  const receiverUserID = params.get("userID")
  const loggedUser = JSON.parse(sessionStorage.getItem("user"))
  async function fetchUserData() {
    try {
      const editProfileButton = document.querySelector(".editProfileA")
      const followButton = document.querySelector(".followButtonA")
      const logOutButton = document.querySelector(".logOutButtonA")
      const conversationButton = document.querySelector(".conversationButtonA")
      let isNewConversation = true
      let conversationID = ""
      try {
        const response = await fetch(
          `http://localhost:9000/memeo/api/getconversations/${loggedUser.userID}`
        )
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText)
        }
        const conversationsList = await response.json()
        for (const conver of conversationsList) {
          if (
            conver.conversationPK.receiverUserID === Number(receiverUserID) ||
            conver.conversationPK.starterUserID === Number(receiverUserID)
          ) {
            conversationID = conver.conversationPK.conversationID
            isNewConversation = false
            break
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
      if (isNewConversation) {
        conversationButton.href = `../SingleConversationScreen/SingleConversationScreen.html?receivedID=${receiverUserID}&isNew=${isNewConversation}`
      } else {
        conversationButton.href = `../SingleConversationScreen/SingleConversationScreen.html?conversationID=${conversationID}`
      }
      let url = "http://localhost:9000/memeo/api/getuser/"
      if (receiverUserID == null) {
        url += `${loggedUser.userID}`
        editProfileButton.classList.remove("hidden")
        followButton.classList.add("hidden")
        logOutButton.classList.remove("hidden")
        conversationButton.classList.add("hidden")
        btnDeletePost.classList.remove("hidden")
      } else if (receiverUserID === loggedUser.userID) {
        url += `${loggedUser.userID}`
        editProfileButton.classList.remove("hidden")
        followButton.classList.add("hidden")
        conversationButton.classList.add("hidden")
        logOutButton.classList.remove("hidden")
        btnDeletePost.classList.remove("hidden")
      } else {
        url += `${receiverUserID}`
        editProfileButton.classList.add("hidden")
        btnDeletePost.classList.add("hidden")
        followButton.classList.remove("hidden")
        logOutButton.classList.add("hidden")

        let contador = 0
        let followingUserFromUser = null
        let followingUserToUser = null

        loggedUser.following.forEach((followingUser) => {
          if (followingUser.toUser.userID == receiverUserID) {
            contador++
            followingUserFromUser = followingUser.fromUser.userID
            followingUserToUser = followingUser.toUser.userID
          }
        })

        if (contador == 1) {
          // si se siguen: botón en following
          followButton.textContent = "FOLLOWING"
          followButton.classList.add("followingState")
          //followButton.tabindex = 0

          followButton.addEventListener("click", async () => {
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
                const updateFollowing = loggedUser.following.filter(
                  (fo) => fo.toUser.userID != followingUserToUser
                )
                loggedUser.following = updateFollowing
                sessionStorage.setItem("user", JSON.stringify(loggedUser))
                window.location.href = `../ProfileScreen/ProfileScreen.html?userID=${receiverUserID}`
              }
            } catch (error) {
              console.error("Last catch error:", error)
            }
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
                const userFollowed = await response.json()

                loggedUser.following.push(userFollowed)
                sessionStorage.setItem("user", JSON.stringify(loggedUser))
                window.location.href = `../ProfileScreen/ProfileScreen.html?userID=${receiverUserID}`
              }
            } catch (error) {
              console.error("Last catch error:", error)
            }
          })
        }
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`)
      }

      const dataUser = await response.json()

      // setteo de variables
      let usernameH3 = document.getElementById("usernameHeader")
      usernameH3.textContent = dataUser.username

      let imageURL = document.getElementById("profileImage")
      imageURL.src = `http://localhost:9000/${dataUser.avatar}`

      let followerCount = document.querySelector(".followerCount")
      followerCount.textContent = `${dataUser.followers.length}`

      let followingCount = document.querySelector(".followingCount")
      followingCount.textContent = `${dataUser.following.length}`

      // settear posts
      let pinContainer = document.querySelector(".pin_container")
      let titlePin_container = document.querySelector(".titlePin_container")

      if (dataUser.posts.length == 0) {
        let noPosts = document.createElement("p")
        noPosts.classList.add("noPostStyle")
        noPosts.innerHTML =
          "We're so sorry! There are no posts here... :( <br><br> Atte: meme-o team <3"
        titlePin_container.appendChild(noPosts)
      } else {
        let postsArray = dataUser.posts

        postsArray.reverse().forEach((post) => {
          let containerPost = document.createElement("div")
          containerPost.classList.add("card")
          containerPost.tabIndex = 0

          let aleatorio = randomIntFromInterval(1, 3)
          if (aleatorio === 1) {
            containerPost.classList.add("card_small")
          } else if (aleatorio === 2) {
            containerPost.classList.add("card_medium")
          } else {
            containerPost.classList.add("card_large")
          }
          pinContainer.appendChild(containerPost)

          let anImage = document.createElement("img")
          anImage.src = `http://localhost:9000/${post.media_file}`
          anImage.alt = "Imagen de un post"
          anImage.classList.add("cardImage")
          containerPost.appendChild(anImage)
          containerPost.addEventListener("click", () => openModal(post))
        })
      }
    } catch (error) {
      console.error("ERROR REQUEST FETCH:", error)
    }
  }
  // función para elegir los tamaños de los posts
  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min) // min and max included
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
    btnDeletePost.addEventListener("click", () => deletePost(post.postID))
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
  const deletePost = async (postID) => {
    try {
      const response = await fetch(
        `http://localhost:9000/memeo/api/deletepost/${postID}`,
        {
          method: "DELETE",
        }
      )
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText)
      }
      const updatePosts = loggedUser.posts.filter((fo) => fo.postID != postID)
      loggedUser.posts = updatePosts
      sessionStorage.setItem("user", JSON.stringify(loggedUser))
      window.location.reload()
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
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
