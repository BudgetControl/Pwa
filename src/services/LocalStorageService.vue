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
        localStorage.setItem(hash,btoa(JSON.stringify(value)))
    }
}

function hash(name) {
    return btoa(localStorage.getItem('auth-token')+name)
}

function get(name) {
    return JSON.parse(atob(localStorage.getItem(this.hash(name))))
}

function clear() {
    return localStorage.clear()
}

function deleteItem(name) {
    return localStorage.removeItem(this.hash(name))
}

export default {
  check,
  get,
  set,
  clear,
  getToken,
  setToken,
  hash,
  deleteItem
}

</script>
