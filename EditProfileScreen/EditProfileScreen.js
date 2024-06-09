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
    const url = `http://192.168.56.1:9000/memeo/api/getuser/${userID}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const dataUser = await response.json();

        // setteo de variables
        var imageURL = document.getElementById('profileImage');
        imageURL.src = dataUser.avatar;

        var inputUsername = document.getElementById('inputUsername');
        inputUsername.value = dataUser.username;

        var inputName = document.getElementById('inputName');
        inputName.value = dataUser.name;
        
        var inputSurname = document.getElementById('inputSurname');
        inputSurname.value = dataUser.surname;

        var inputBirthdate = document.getElementById('inputBirthdate');
        inputBirthdate.value = formateoFecha(dataUser.birth_date);

        var infoP = document.getElementById('signInDate');
        // infoP.textContent = "Te registraste en meme-o en" + ${dataUser.signup_date};

        // return a consola
        return dataUser;

    } catch (error) {
        console.error('ERROR REQUEST FETCH:', error);
    }
}

console.log(obtenerDatosUsuario(1));