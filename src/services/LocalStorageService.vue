<script>

function check(name) {
    const storage = localStorage.getItem(name)
    if(storage === null) {
        return false
    }

    return true
}

function getToken() {
    return atob(localStorage.getItem('auth-token'))
}

function setToken(value) {
    localStorage.setItem('auth-token',btoa(value))
}

function set(name, value) {
    if(this.check('auth-token') === true) {
        const hash = this.hash(name)
        localStorage.setItem(hash,btoa(value))
    }
}

function hash(name) {
    return btoa(localStorage.getItem('auth-token')+name)
}

function get(name) {
    const value = localStorage.getItem(this.hash(name))
    if(value === null) {
        return null
    }
    return atob(value)
}

function clear() {
    return localStorage.clear()
}

export default {
  check,
  get,
  set,
  clear,
  getToken,
  setToken,
  hash
}

</script>
