document.addEventListener('DOMContentLoaded', (event) => {

    function formateoFecha(fecha) {
        var date = new Date(fecha);
        var dia = date.getDate();
        var mes = date.getMonth() + 1;
        var año = date.getFullYear();

        dia = dia < 10 ? '0' + dia : dia;
        mes = mes < 10 ? '0' + mes : mes;

        return `${dia}-${mes}-${año}`;
    }

    async function fetchUserData() {
        const loggedUser = JSON.parse(sessionStorage.getItem("user"))
        const url = `http://localhost:9000/memeo/api/getuser/${loggedUser.userID}`;

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

    //cuando se pulse guardar se activa el submit
    const saveButtonAct = document.querySelector(".submitA");
    saveButtonAct.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        // seleccionamos las variables
        const avatar = document.getElementById("avatar");
        const avatarBase64 = "";
        const file = avatar.files[0];
        const reader = new FileReader();

        reader.onloadend = function () {
        avatarBase64 = reader.result.replace("data:", "").replace(/^.+,/, "")
        }

        reader.readAsDataURL(file);

        // mandamos la request con el nuevo avatar
        

    });

    fetchUserData();
});