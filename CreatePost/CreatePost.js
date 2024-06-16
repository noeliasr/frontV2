document.addEventListener("DOMContentLoaded", () => {
  const postForm = document.getElementById("postForm")

  postForm.addEventListener("submit", async function (event) {
    event.preventDefault()

    const user = JSON.parse(sessionStorage.getItem("user"))
    if (!user) {
      console.error("No se han encontrado datos de sesion de este usuario :(")
      return
    }

    const postText = document.getElementById("postText").value
    const postImg = document.getElementById("postImg").files[0]

    if (!postImg) {
      return
    }

    const reader = new FileReader()
    reader.onloadend = async function () {
      const base64String = reader.result
        .replace("data:", "")
        .replace(/^.+,/, "")

      const post = {
        text_content: postText,
        user: {
          userID: user.userID,
          username: user.username,
        },
        media_file: base64String,
      }
      try {
        const response = await fetch(
          "http://localhost:9000/memeo/api/createpost",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
          }
        )
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText)
        }
        const userPosts = await response.json()
        user.posts.push(userPosts)
        sessionStorage.setItem("user", JSON.stringify(user))
        window.location.href = "../ProfileScreen/ProfileScreen.html"
      } catch (error) {
        console.error("Error:", error)
      }
    }
    reader.readAsDataURL(postImg)
  })
})
