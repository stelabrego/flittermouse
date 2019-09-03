module.exports = {
  email: (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return (email && re.test(email))
  },
  username: (username) => {
    return (username && username.length > 2 && /^[a-zA-Z0-9_]*$/.test(username))
  },
  password: (password) => {
    return (password.length > 7)
  }
}
