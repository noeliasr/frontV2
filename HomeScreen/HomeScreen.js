//creo las variables del dom
const modals = document.querySelectorAll(".modal")
const toggleBtns = document.querySelectorAll(".toggle-btn")
const closeBtns = document.querySelectorAll(".close-btn")

//función para añadir la clase open al modal
const openModal = (index) => {
  modals[index].classList.add("open")
}

//función para quitar la clase open al modal (cerrar el modal)
const closeModal = (index) => {
  modals[index].classList.remove("open")
}

//para cada botón, le asigno un evento para abrir el modal del index de ese botón
//ya que habrá la misma cantidad de botones que de modales
toggleBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    openModal(index)
  })
})

//lo mismo para cerrar
// closeBtns.forEach((closeBtn, index) => {
//   closeBtn.addEventListener("click", () => {
//     closeModal(index)
//   })
// })

//para cerrar el modal pulsando fuera
window.addEventListener("click", (e) => {
  if (e.target.className === "modal-wrapper") {
    modals.forEach((modal) => {
      modal.classList.remove("open")
    })
  }
})
