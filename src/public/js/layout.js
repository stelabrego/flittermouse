const ajax = require('superagent')
// const baseUrl = 'http:localhost:3000'

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.navbar-burger')
  const menu = document.querySelector('.navbar-menu')
  burger.addEventListener('click', () => {
    menu.classList.toggle('is-active')
    burger.classList.toggle('is-active')
  })

  const login = document.querySelector('#login')
  const loginModal = document.querySelector('#login-modal')
  const loginModalBackground = document.querySelector('#login-modal .modal-background')
  const loginModalClose = document.querySelector('#login-modal .modal-close')
  const loginModalCancel = document.querySelector('#login-modal .cancel')
  const toggleLoginModal = () => {
    loginModal.classList.toggle('is-active')
    loginUsernameEmailInput.value = ''
    loginPasswordInput.value = ''
    loginPasswordInput.classList.remove('is-danger')
    loginUsernameEmailInput.classList.remove('is-danger')
    loginHelp.innerText = ''
  }

  if (login) {
    login.addEventListener('click', toggleLoginModal)
    loginModalBackground.addEventListener('click', toggleLoginModal)
    loginModalClose.addEventListener('click', toggleLoginModal)
    loginModalCancel.addEventListener('click', toggleLoginModal)
  }

  const loginForm = document.querySelector('#login-modal form')
  const loginPasswordInput = document.getElementById('loginPasswordInput')
  const loginUsernameEmailInput = document.getElementById('loginUsernameEmailInput')
  const loginHelp = document.getElementById('loginHelp')
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault()
      console.log(event)
      const password = event.target.elements.password.value
      const usernameEmail = event.target.elements.usernameEmail.value
      console.log({ usernameEmail, password })
      ajax.post('/login')
        .send({ usernameEmail, password })
        .then(res => {
          console.log(res)
          if (res.body.success) window.location.reload()
          else {
            loginPasswordInput.classList.add('is-danger')
            loginUsernameEmailInput.classList.add('is-danger')
            loginHelp.innerText = 'No accounts found with that username/email and password combination'
          }
        })
    })

    loginForm.addEventListener('input', (event) => {
      loginPasswordInput.classList.remove('is-danger')
      loginUsernameEmailInput.classList.remove('is-danger')
      loginHelp.innerText = ''
    })
  }

  const navSignupButton = document.getElementById('navSignupButton')
  const signupModal = document.getElementById('signupModal')
  const signupModalBackground = document.querySelector('#signupModal .modal-background')
  const signupModalClose = document.querySelector('#signupModal .modal-close')
  const signupModalCancel = document.querySelector('#signupModal .cancel')
  const signupPasswordInput = document.getElementById('signupPasswordInput')
  const signupEmailInput = document.getElementById('signupEmailInput')
  const signupUsernameInput = document.getElementById('signupUsernameInput')
  const signupSubmit = document.getElementById('signupSubmit')
  const toggleSignupModal = () => {
    signupModal.classList.toggle('is-active')
    signupPasswordInput.value = ''
    signupEmailInput.value = ''
    signupUsernameInput.value = ''
  }

  if (navSignupButton) {
    navSignupButton.addEventListener('click', toggleSignupModal)
    signupModalBackground.addEventListener('click', toggleSignupModal)
    signupModalClose.addEventListener('click', toggleSignupModal)
    signupModalCancel.addEventListener('click', toggleSignupModal)
  }

  const signupForm = document.querySelector('#signupModal form')
  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault()
      signupSubmit.classList.add('is-loading')
      console.log(event)
      const formElems = event.target.elements
      const requestBody = {
        username: formElems.username.value,
        email: formElems.email.value,
        password: formElems.password.value
      }
      ajax
        .post('/signup')
        .send(requestBody)
        .then(res => {
          console.log(res)
          if (res.body.success) {
            signupModal.classList.remove('is-active')
            window.location.assign('/home')
          }
          signupSubmit.classList.remove('is-loading')
        })
      console.log(requestBody)
    })
  }

  const logout = document.querySelector('nav .logout')
  if (logout) {
    logout.addEventListener('click', (event) => {
      ajax.post('/logout')
        .send({ })
        .then(res => {
          console.log(res)
          if (res.body.success) window.location.replace('/')
        })
    })
  }

  const updateAttendanceButton = document.querySelector('button.update-attendance')
  if (updateAttendanceButton) {
    const urlKey = updateAttendanceButton.getAttribute('urlKey')
    updateAttendanceButton.addEventListener('click', event => {
      updateAttendanceButton.classList.toggle('is-loading')
      if (updateAttendanceButton.classList.contains('is-link')) {
        ajax.post('/users/attend')
          .send({ urlKey })
          .then(res => {
            console.log(res)
            if (res.body.success) {
              updateAttendanceButton.innerHTML = 'Remove RSVP'
              updateAttendanceButton.classList.remove('is-link')
              updateAttendanceButton.classList.add('is-warning')
            } else if (res.body.needToLogin) {
              toggleLoginModal()
            }
            updateAttendanceButton.classList.toggle('is-loading')
          })
      }
      if (updateAttendanceButton.classList.contains('is-warning')) {
        ajax.delete('/users/attend')
          .send({ urlKey })
          .then(res => {
            console.log(res)
            if (res.body.success) {
              updateAttendanceButton.innerHTML = 'RSVP'
              updateAttendanceButton.classList.add('is-link')
              updateAttendanceButton.classList.remove('is-warning')
            } else if (res.body.needToLogin) {
              toggleLoginModal()
            }
            updateAttendanceButton.classList.toggle('is-loading')
          })
      }
    })
  }



})
