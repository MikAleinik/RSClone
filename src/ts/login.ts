import { createNewsItemsList } from './news'

const authLoginButton = document.querySelector('.auth__login') as HTMLInputElement;
authLoginButton.addEventListener('click', () => {
  authForm('main', 'enter')
})

const authRegistrationButton = document.querySelector('.auth__registration') as HTMLInputElement;
authRegistrationButton.addEventListener('click', () => {
  authForm('main', 'registration')
})

function authForm(place: string, type: string){
  const auth = document.querySelector(place) as HTMLElement;
  const prevForm = document.querySelector('form[name=login]');
  if (!prevForm){
    const form = document.createElement('form');
    form.name = 'login';
    form.action = 'post';
    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email';
    emailLabel.setAttribute('for', 'email');
    const emailInput = document.createElement('input');
    emailInput.setAttribute('name', 'email');
    emailInput.setAttribute('type', 'email');
    emailInput.setAttribute('required', 'true');
    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'password');
    passwordLabel.textContent = 'Password';
    const passwordInput = document.createElement('input');
    passwordInput.id = 'password';
    passwordInput.setAttribute('name', 'password');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('required', 'true');
    const authButton = document.createElement('button');
    authButton.type = 'submit';
    authButton.id = 'enter';
    authButton.className = 'big__button';
    type === 'enter' ? authButton.textContent = 'Enter' : authButton.textContent = 'Registration';
    authButton.addEventListener('click', (event) => {
      event.preventDefault();
      if (type === 'enter'){
        window.open('main.html') // fake authorization
      }
      if (type === 'registration'){
        window.open('registration.html') // fake registration
      }
    })
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    form.appendChild(authButton);
    auth.appendChild(form);
  } else {
    auth.removeChild(prevForm)
  }
}

createNewsItemsList('.news')