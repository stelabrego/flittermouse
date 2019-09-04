const request = require('superagent')
document.addEventListener('DOMContentLoaded', (event) => {
  const userListenButton = document.getElementById('userListenButton')
  userListenButton.onmouseover = (event) => {
    if (userListenButton.getAttribute('isListening')) {
      userListenButton.classList.remove('is-primary')
      userListenButton.classList.add('is-danger')
      userListenButton.innerText = 'Stop Listening'
    }
  }
  userListenButton.onmouseout = (event) => {
    if (userListenButton.getAttribute('isListening')) {
      userListenButton.classList.add('is-primary')
      userListenButton.classList.remove('is-danger')
      userListenButton.innerText = 'Listening'
    }
  }
  userListenButton.onclick = (event) => {
    const targetUserId = userListenButton.getAttribute('targetUserId')
    if (!userListenButton.getAttribute('isListening')) {
      request
        .post('/users/listen')
        .send({ targetUserId })
        .then(res => {
          if (res.body.success) {
            userListenButton.classList.add('is-outlined')
            userListenButton.innerText = 'Listening'
            userListenButton.setAttribute('isListening', true)
            document.activeElement.blur()
          }
          console.log(res)
        })
    } else {
      request
        .delete('/users/listen')
        .send({ targetUserId })
        .then(res => {
          if (res.body.success) {
            userListenButton.classList.add('is-primary')
            userListenButton.classList.remove('is-danger')
            userListenButton.classList.remove('is-outlined')
            userListenButton.innerText = 'Listen'
            userListenButton.removeAttribute('isListening')
            document.activeElement.blur()
          }
          console.log(res)
        })
    }
  }
})
