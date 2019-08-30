console.log('script loaded')

document.addEventListener('DOMContentLoaded', () => {
  const displayNameInput = document.querySelector('#displayNameInput')
  const displayNameHelp = document.querySelector('#displayNameHelp')
  const bioTextArea = document.querySelector('#bioTextArea')
  const bioHelp = document.querySelector('#bioHelp')
  displayNameInput.addEventListener('input', (event) => {
    const inputLength = event.target.value.length
    displayNameHelp.textContent = inputLength + '/40'
    if (inputLength > 40) {
      displayNameInput.classList.add('is-danger')
      displayNameHelp.classList.add('is-danger')
    } else {
      displayNameInput.classList.remove('is-danger')
      displayNameHelp.classList.remove('is-danger')
    }
  })
  bioTextArea.addEventListener('input', (event) => {
    const inputLength = event.target.value.length
    bioHelp.textContent = inputLength + '/160'
    if (inputLength > 160) {
      bioTextArea.classList.add('is-danger')
      bioHelp.classList.add('is-danger')
    } else {
      bioTextArea.classList.remove('is-danger')
      bioHelp.classList.remove('is-danger')
    }
  })
})
