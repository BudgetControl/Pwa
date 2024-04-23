<script>

function check(name) {
    const storage = localStorage.getItem(name)
    if (storage === null) {
        return false
    }

    return true
}

function getToken() {
    const token = localStorage.getItem('auth-token')
    if(token === null) {
        return null
    }
    return atob(token)
}

function setToken(value) {
    localStorage.setItem('auth-token', btoa(value))
}

function setUser(value) {
    this.set('user', value)
    this.set('settings', JSON.parse(value.workspace_settings.data))
}

function setUserToken(value) {
    localStorage.setItem('user-token', value)
}

function getUserToken() {
    return localStorage.getItem('user-token')
}

function getUser() {
    return this.get('user')
}

function set(name, value) {
    if (this.check('auth-token') === true) {
        localStorage.setItem(name, btoa(encodeURI(JSON.stringify(value))))
    }
}

function getWorkspaceId() {
    return localStorage.getItem('workspace-id')
}

function setWorkspaceId(value) {
    localStorage.setItem('workspace-id', value)
}

function get(name) {
    const storage = localStorage.getItem(name)
    if(storage === null) {
        return null
    }
    return JSON.parse(decodeURI(atob(storage)))
}

function clear() {
    return localStorage.clear()
}

function deleteItem(name) {
    return localStorage.removeItem(name)
}

export default {
    check,
    get,
    set,
    clear,
    getToken,
    setToken,
    deleteItem,
    setUser,
    getUser,
    setUserToken,
    getUserToken,
    setWorkspaceId,
    getWorkspaceId
}

</script>
