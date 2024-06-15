document.addEventListener("DOMContentLoaded", () => {
  const publishButton = document.getElementById("publishBtn")

  const postForm = document.getElementById("postForm")

  postForm.addEventListener("submit", async function (event) {
    //esta deprecado
    event.preventDefault()

    const user = JSON.parse(sessionStorage.getItem("user"))
    if (!user) {
      console.error("No se han encontrado datos de sesion de este usuario :(")
      return
    }

    const postText = document.getElementById("postText").value
    const postImg = document.getElementById("postImg").files[0]

    if (!postImg) {
      console.error("Te faltó el meme...")
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
              // "Access-Control-Allow-Origin": "http://localhost:9000",
            },
            body: JSON.stringify(post),
          }
        )
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText)
        }
        window.location.href = "../ProfileScreen/ProfileScreen.html"
      } catch (error) {
        console.error("Error:", error)
      }
    }
    reader.readAsDataURL(postImg)
  })
})
