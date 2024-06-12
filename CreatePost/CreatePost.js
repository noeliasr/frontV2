document.addEventListener('DOMContentLoaded', () =>{
    const publishButton = document.getElementById("publishBtn");

    const postForm = document.getElementById("postForm");
    

    postForm.addEventListener('submit', async function (event){
        //esta deprecado
        event.preventDefault(); 

        const user = JSON.parse(sessionStorage.getItem("user"));
        if(!user){
            console.error("No se han encontrado datos de sesion de este usuario :(");
            return;
        }


        const postText = document.getElementById("postText").value;
        const postImg = document.getElementById("postImg").files[0];
        
        if(!postImg){
            console.error("Te faltó el meme...");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function () {
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
            fetch("http://192.168.56.1:9000/memeo/api/createpost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "http://192.168.56.1:9000",
                },
                body: JSON.stringify(post),
            })
                .then((response) => response.json())
                .then((data) => console.log("Success:", data))
                .catch((error) => console.error("Error:", error))
        }
        reader.readAsDataURL(postImg);
})
    
})