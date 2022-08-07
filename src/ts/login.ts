const enterButton = document.querySelector('#enter') as HTMLInputElement;

enterButton.addEventListener('click', (event) => {
  event.preventDefault();
  window.open('main.html') //fake authorization
})