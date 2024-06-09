document.addEventListener('DOMContentLoaded', () => {
    const modalAdd = document.querySelector('#modalAdd');
    const openModalBtn = document.querySelector('#openModalBtn');
    const closeModalBtn = document.querySelector('#closeModalBtn');

    const usuario = document.getElementsByTagName('#user');
    const idPost = document.getElementsByTagName('#idPost');
    const idLike = document.getElementsByTagName('#idLike');
    const comment = document.getElementsByTagName('#idComment');
    const inputComment = document.getElementsByTagName('#inputComment');


    const openModal = () => {
        modalAdd.style.display = 'flex';
    }

    const closeModal = () => {
        modalAdd.style.display = 'none';
    }

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
});