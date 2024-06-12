function formateoFecha(fecha) {
    var date = new Date(fecha);
    var dia = date.getDate();
    var mes = date.getMonth() + 1;
    var año = date.getFullYear();

    dia = dia < 10 ? '0' + dia : dia;
    mes = mes < 10 ? '0' + mes : mes;

    return `${dia}-${mes}-${año}`;
}

async function obtenerDatosUsuario(userID) {
    const url = `http://localhost:9000/memeo/api/getuser/${userID}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const dataUser = await response.json();

        // setteo de variables
        var imageURL = document.getElementById('profileImage');
        imageURL.src = `http://localhost:9000/${dataUser.avatar}`;        

        var inputUsername = document.getElementById('inputUsername');
        inputUsername.value = dataUser.username;

        var inputName = document.getElementById('inputName');
        inputName.value = dataUser.name;
        
        var inputSurname = document.getElementById('inputSurname');
        inputSurname.value = dataUser.surname;

        var inputBirthdate = document.getElementById('inputBirthdate');
        inputBirthdate.value = formateoFecha(dataUser.birth_date);

        var infoP = document.getElementById('signInDate');
        infoP.textContent = `Te registraste en meme-o en ${formateoFecha(dataUser.signup_date)}`;

        // return a consola
        return dataUser;

    } catch (error) {
        console.error('ERROR REQUEST FETCH:', error);
    }
}

console.log(obtenerDatosUsuario(4));

//cuando se pulse guardar se activa el submit
const saveButtonAct = document.querySelector(".submitA");
saveButtonAct.addEventListener("click",() => {

    //evento submit
    const newPicForm = document.getElementById("newProfilePicForm").files[0];
    newPicForm.addEventListener('submit', async function(event){
        event.preventDefault();
    
        const newPic = document.getElementById("newProfilePic").files[0];
        if(newPic){
            const reader = new FileReader();
            reader.onloadend = function(){
                // transformación de la imagen en base64
                const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
            
                //seleccionamos "el cambio" que vamos a enviar
                const profile = {
                    user: {
                        userID: dataUser.userid,
                        username: dataUser.username,
                        avatar: base64String,
                    }
                }

                //mandamos el fetch NO ES CREATEPOST ¿¿¿¿¿
                fetch("http://localhost:9000/memeo/api/createpost", {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "http://localhost:9000",
                    },
                    body: JSON.stringify(profile),
                })
                .then((response) => response.json())
                .then((data) => console.log("Success:", data))
                .catch((error) => console.error("Error:", error))
            }
            
            //inicia la lectura del archivo
            reader.readAsDataURL(newPic);
        }
    });

});