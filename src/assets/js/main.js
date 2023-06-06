//Меню
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});

//Галерея
const photoContainer = document.querySelector('.photo-container');
const textOverlay = document.querySelector('.text-overlay');

photoContainer.addEventListener('click', () => {
    photoContainer.classList.toggle('clicked');
});



