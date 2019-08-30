document.addEventListener('DOMContentLoaded', () => {
  const eventCards = document.querySelectorAll('.event-card')
  eventCards.forEach(eventCard => {
    eventCard.addEventListener('click', event => {
      console.log(eventCard.attributes)
      window.location.assign(eventCard.attributes.url.value)
    })
  })
})
