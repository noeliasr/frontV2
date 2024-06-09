const modalAdd = document.querySelector("#modalAdd")
const closeModalBtn = document.querySelector("#closeModalBtn")
const idPost = document.getElementById("idPost")
const imagenPost = idPost.querySelector("img")
const username = document.getElementById("user")
const comments = document.getElementById("idComment")
const idLike = document.getElementsByTagName("#idLike")
const inputComment = document.getElementById("inputComment")
const btnAddComment = document.getElementById("btnAddComment")
const getPosts = async () => {
  try {
    const response = await fetch(
      "http://192.168.1.86:9000/memeo/api/getposts/4"
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
  let isLike = post.memeLikes.some((like) => like.memeLikePK.userID === 4)
  if (isLike) {
    return "../Assets/like-icon.png"
  } else {
    return "../Assets/no-like-icon.png"
  }
}
const isLiked = (post) => {
  return post.memeLikes.some((like) => like.memeLikePK.userID === 4)
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
  removeChildNodes(lista)
  dataPost.forEach(async (elemento) => {
    const postDiv = document.createElement("article")
    postDiv.classList.add("post")

    let imgPost = `http://192.168.1.86:9000/${elemento.media_file}`

    const postContent = `
      <figure>
        <img class="img-post" id="post-${
          elemento.postID
        }" src="${imgPost}" alt="Imagen de ${elemento.user.username}">
      </figure>
      <div>
        <div class="span-icons">
          <span>
            <img class="heart-icon" id="btnLike-${
              elemento.postID
            }" src="${changeImgLiked(elemento)}"/> ${elemento.memeLikes.length}
          </span>
          <span>
            ${elemento.comments.length}
            <img class="heart-icon" id="comment-post-${
              elemento.postID
            }" src="../Assets/comments-icon.svg"/>
          </span>
        </div>
        <div class="details-section">
          <span><strong>${elemento.user.username}</strong>: ${
      elemento.text_content
    }</span>
          <div class="comments-section">
            ${elemento.comments
              .map(
                (comentario) => `
              <span>${comentario.user.username}: ${comentario.text_content}</span>
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
  })
  //Lógica darle a like
  dataPost.forEach((elemento) => {
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
      userID: 4,
    },
  }
  try {
    const response = await fetch(
      `http://192.168.1.86:9000/memeo/api/creatememelike`,
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
      `http://192.168.1.86:9000/memeo/api/deletememelike/${4}/${postID}`,
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
  imagenPost.src = `http://192.168.1.86:9000/${post.media_file}`
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
  comments.innerHTML = ""
  post.comments.forEach((comment) => {
    const commentSpan = document.createElement("span")
    const commentContent = `<strong>${comment.user.username}</strong> ${comment.text_content}`
    commentSpan.innerHTML = commentContent
    comments.appendChild(commentSpan)
  })
  inputComment.value = ""
  // eliminar el event listener anterior si existe
  if (currentAddCommentHandler) {
    btnAddComment.removeEventListener("click", currentAddCommentHandler)
  }
  currentAddCommentHandler = addCommentHandler(post)
  btnAddComment.addEventListener("click", currentAddCommentHandler)
}

const addComment = async (post) => {
  const comment = {
    text_content: inputComment.value,
    user: {
      userID: 4,
      username: "theking",
    },
    post: {
      postID: post.postID,
    },
  }
  try {
    const response = await fetch(
      `http://192.168.1.86:9000/memeo/api/createcomment`,
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

document.addEventListener("DOMContentLoaded", () => {
  closeModalBtn.addEventListener("click", () => closeModal())
  getPosts()
})
