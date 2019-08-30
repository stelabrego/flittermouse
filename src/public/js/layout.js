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
  const toggleLoginModal = () => { loginModal.classList.toggle('is-active') }

  if (login) {
    login.addEventListener('click', toggleLoginModal)
    loginModalBackground.addEventListener('click', toggleLoginModal)
    loginModalClose.addEventListener('click', toggleLoginModal)
    loginModalCancel.addEventListener('click', toggleLoginModal)
  }

  const loginForm = document.querySelector('#login-modal form')
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault()
      console.log(event)
      const password = event.target.elements.password.value
      const usernameEmail = event.target.elements['username-email'].value
      console.log({ usernameEmail, password })
      ajax.post('/login')
        .send({ usernameEmail, password })
        .then(res => {
          console.log(res)
          if (res.body.success) window.location.reload()
        })
    })
  }

  const signup = document.querySelector('#signup')
  const signupModal = document.querySelector('#signup-modal')
  const signupModalBackground = document.querySelector('#signup-modal .modal-background')
  const signupModalClose = document.querySelector('#signup-modal .modal-close')
  const signupModalCancel = document.querySelector('#signup-modal .cancel')
  const toggleSignupModal = () => { signupModal.classList.toggle('is-active') }

  if (signup) {
    signup.addEventListener('click', toggleSignupModal)
    signupModalBackground.addEventListener('click', toggleSignupModal)
    signupModalClose.addEventListener('click', toggleSignupModal)
    signupModalCancel.addEventListener('click', toggleSignupModal)
  }

  const signupForm = document.querySelector('#signup-modal form')
  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault()
      console.log(event)
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
