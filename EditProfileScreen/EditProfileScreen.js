async function obtenerDatosUsuario(userID) {
    const url = `http://192.168.56.1:9000/memeo/api/getuser/${userID}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const dataUser = await response.json();

        // setteo de variables
        var inputUsername = document.getElementById('inputUsername');
        inputUsername.value = dataUser.username;

        var inputName = document.getElementById('inputName');
        inputName.value = dataUser.name;
        
        var inputSurname = document.getElementById('inputName');
        inputSurname.value = dataUser.surname;

        var imageURL = document.getElementById('profileImage');
        imageURL.src = dataUser.avatar;

        

        // return a consola
        return dataUser;

    } catch (error) {
        console.error('ERROR REQUEST FETCH:', error);
    }
}

console.log(obtenerDatosUsuario(1));