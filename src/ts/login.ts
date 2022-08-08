const enterButton = document.querySelector('#enter') as HTMLInputElement;

enterButton.addEventListener('click', (event) => {
  event.preventDefault();
  window.open('main.html') //fake authorization
})

const authLoginButton = document.querySelector('.auth__login') as HTMLInputElement;
const authLoginForm = document.querySelector('form[name=login]') as HTMLFormElement;
authLoginButton.addEventListener('click', () => {
  authLoginForm.style.visibility = 'visible';
})