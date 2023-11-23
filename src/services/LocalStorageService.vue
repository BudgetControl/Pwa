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

function setToken() {
    localStorage.setItem('auth-token',btoa(value))
}

function set(name, value) {
    if(this.check('auth-token') === true) {
        const hash = btoa(localStorage.getItem('auth-token')+name)
        localStorage.setItem(hash,btoa(value))
    }
}

function get(name) {
    return atob(localStorage.getItem(name))
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
  setToken
}

</script>
