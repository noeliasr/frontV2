const modalAdd = document.querySelector("#modalAdd")
const closeModalBtn = document.querySelector("#closeModalBtn")
const idPost = document.getElementById("idPost")
const loader = document.querySelector(".loader")
const imagenPost = idPost.querySelector("img")
const username = document.getElementById("user")
const comments = document.getElementById("idComment")
const idLike = document.getElementsByTagName("#idLike")
const inputComment = document.getElementById("inputComment")
const btnAddComment = document.getElementById("btnAddComment")
const spaceNoPost = document.querySelector(".spacer")
const user = JSON.parse(sessionStorage.getItem("user"))

const getPosts = async () => {
  try {
    const response = await fetch(
      `http://localhost:9000/memeo/api/getposts/${user.userID}`
    )
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText)
    }
    const dataPost = await response.json()
    showPosts(dataPost)
  } catch (error) {
    console.error("Error fetching posts:", error)
  }
}

const changeImgLiked = (post) => {
  let isLike = post.memeLikes.some(
    (like) => like.memeLikePK.userID === user.userID
  )
  if (isLike) {
    return "../Assets/like-icon.png"
  } else {
    return "../Assets/no-like-icon.png"
  }
}
const isLiked = (post) => {
  return post.memeLikes.some((like) => like.memeLikePK.userID === user.userID)
}
const formatDatePost = (date) => {
  const dateFormat = new Date(date)
  const day = String(dateFormat.getDate()).padStart(2, "0")
  const month = String(dateFormat.getMonth() + 1).padStart(2, "0") // Los meses empiezan en 0
  const year = dateFormat.getFullYear()
  const hour = dateFormat.getHours().toString().padStart(2, "0")
  const minutes = dateFormat.getMinutes().toString().padStart(2, "0")

  const formattedDate = `${day}-${month}-${year}`
  const formattedTime = `${hour}:${minutes}`

  return `${formattedDate} ${formattedTime}`
}
const showPosts = (dataPost) => {
  const lista = document.getElementById("listPost")
  lista.style.display = "flex"
  loader.style.display = "none"
  removeChildNodes(lista)
  if (dataPost.length !== 0) {
    spaceNoPost.style.display = "none"
  }
  dataPost.forEach(async (elemento) => {
    const postDiv = document.createElement("article")
    postDiv.classList.add("post")

    let imgPost = `http://localhost:9000/${elemento.media_file}`

    const postContent = `
      <figure>
        <img class="img-post" id="post-${
          elemento.postID
        }" src="${imgPost}" alt="Imagen de ${
      elemento.user.username
    } con titulo ${elemento.text_content}" tabindex="0">
      </figure>
      <div>
        <div class="span-icons">
          <button class="btn-incons-post">
            <img class="icons-post" id="btnLike-${
              elemento.postID
            }" src="${changeImgLiked(elemento)}"/> <span class="count-likes">${
      elemento.memeLikes.length
    }</span>
          </button>
          <button class="btn-incons-post">
            <span class="count-comments">${elemento.comments.length}</span>
            <img class="icons-post" id="comment-post-${
              elemento.postID
            }" src="../Assets/comments.png"/>
          </button>
        </div>
        <div class="details-section">
          <span><strong>${elemento.user.username}</strong> ${
      elemento.text_content
    }</span>
          <div class="comments-section">
            ${elemento.comments
              .slice(0, 3)
              .map(
                (comentario) => `
              <span><strong>${comentario.user.username}</strong> ${comentario.text_content}</span>
            `
              )
              .join("")}
          </div>
           <div class="date-section">
          <span class="date-span">${formatDatePost(
            elemento.createdDatetime
          )}</span>
        </div>
        </div>

      </div>
    `

    postDiv.innerHTML = postContent
    lista.appendChild(postDiv)
    //Lógica darle a like/comentarios
    const btnLike = document.getElementById(`btnLike-${elemento.postID}`)
    const btnImg = document.getElementById(`post-${elemento.postID}`)
    const btnComments = document.getElementById(
      `comment-post-${elemento.postID}`
    )
    btnLike.addEventListener("click", function () {
      const newImgSrc = isLiked(elemento)
        ? "../Assets/no-like-icon.png"
        : "../Assets/like-icon.png"
      btnLike.classList.add("like")
      setTimeout(() => {
        btnLike.src = newImgSrc
        btnLike.classList.remove("like")
      }, 200)
      setTimeout(() => {
        if (!isLiked(elemento)) {
          createMemeLike(elemento)
        } else {
          deleteMemeLike(elemento.postID)
        }
      }, 200)
    })
    btnImg.addEventListener("click", () => openModal(elemento))
    btnComments.addEventListener("click", () => openModal(elemento))
  })
}
const createMemeLike = async (post) => {
  const likeData = {
    post: {
      postID: post.postID,
    },
    user: {
      userID: user.userID,
    },
  }
  try {
    const response = await fetch(
      `http://localhost:9000/memeo/api/creatememelike`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(likeData),
      }
    )
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText)
    }
    const dataMemeLike = await response.json()
    getPosts(dataMemeLike.post.postID)
  } catch (error) {
    console.error("Error fetching posts:", error)
  }
}
const deleteMemeLike = async (postID) => {
  try {
    const response = await fetch(
      `http://localhost:9000/memeo/api/deletememelike/${user.userID}/${postID}`,
      {
        method: "DELETE",
      }
    )
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText)
    }
    getPosts(postID)
  } catch (error) {
    console.error("Error fetching posts:", error)
  }
}
const removeChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}
const openModal = (post) => {
  modalAdd.style.display = "flex"
  username.textContent = post.user.username
  imagenPost.src = `http://localhost:9000/${post.media_file}`
  loadComments(post)
}

const addCommentHandler = (post) => () => addComment(post)

const closeModal = () => {
  modalAdd.style.display = "none"
  getPosts()
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
      userID: user.userID,
      username: user.username,
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

/* FIND USER*/
const input = document.getElementById("autoComplete")
const findUser = async (event) => {
  try {
    const response = await fetch(
      `http://localhost:9000/memeo/api/searchusers/${event.key}`
    )
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText)
    }
    const userList = await response.json()
    showUserList(userList)
  } catch (error) {
    console.error("Error fetching posts:", error)
  }
}
const showUserList = (userList) => {
  const dataList = document.getElementById("dataList")
  dataList.innerHTML = ""
  userList.forEach((item) => {
    const option = document.createElement("option")
    option.setAttribute("data-userid", item.userID)
    option.textContent = item.username
    dataList.appendChild(option)
  })

  dataList.querySelectorAll("option").forEach((el) => {
    el.addEventListener("click", (e) => {
      input.value = el.value
    })
  })

  input.addEventListener("focus", showList)

  input.addEventListener("blur", () => {
    setTimeout(() => {
      dataList.classList.remove("show")
    }, 300)
  })

  input.addEventListener("keyup", showList)

  function showList() {
    if (!!input.value) {
      input.setAttribute("list", "dataList")
    } else {
      input.removeAttribute("list")
    }
  }
  const autoCompleteInput = document.getElementById("autoComplete")
  autoCompleteInput.addEventListener("input", function (event) {
    const inputValue = event.target.value
    const selectedOption = Array.from(
      document.querySelectorAll("#dataList option")
    ).find((option) => option.value === inputValue)
    if (selectedOption) {
      window.location.href = `../ProfileScreen/ProfileScreen.html?userID=${selectedOption.getAttribute(
        "data-userid"
      )}`
    }
  })
}

/*PERFIL DETAILS */
const imgProfile = document.getElementById("img-perfil-details")
const usernameProfile = document.getElementById("username-perfil-details")
const countFollowers = document.getElementById("followers-perfil-details")
const countFollowing = document.getElementById("following-perfil-details")
const countPosts = document.getElementById("number-post-perfil-details")
const countMemeLike = document.getElementById("number-like-perfil-details")
imgProfile.src = `http://localhost:9000/${user.avatar}`
imgProfile.alt = "Avatar de mi usuario"
usernameProfile.textContent = user.username
countFollowers.textContent = `Follower: ${user.followers.length}`
countFollowing.textContent = `Following: ${user.following.length}`
countPosts.textContent = `Posts: ${user.posts.length}`

let totalMemeLikes = 0
user.posts.forEach((post) => {
  totalMemeLikes += post.memeLikes.length
})
countMemeLike.textContent = `Likes: ${totalMemeLikes}`

/*BTN SCROLL TO TOP */
let mybutton = document.getElementById("circularBtnScroll")
window.onscroll = function () {
  scrollFunction()
}

const scrollFunction = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
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
/*HOOK DOM LOADED*/
document.addEventListener("DOMContentLoaded", () => {
  closeModalBtn.addEventListener("click", () => closeModal())
  input.addEventListener("keydown", (event) => findUser(event))
  mybutton.addEventListener("click", () => scrollToTop())
  getPosts()
})
