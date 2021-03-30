const serviceBaseUrl = "http://localhost:3333"
class BaseApi {
    constructor(baseApiUrl) {
        this.baseApiUrl = `${serviceBaseUrl}/${baseApiUrl}`
        this.token = localStorage.getItem("token")
        this.headers = new Headers()
        if (this.token !== undefined) {
            this.headers.append("Authorization", `Bearer ${this.token}`)
        }
    }

    getAll() {
        return fetchJSON(this.baseApiUrl, this.token)
    }
    getById(id) {
        return fetchJSON(`${this.baseApiUrl}/${id}`,this.token)
    }
    delete(id) {
        return fetch(`${this.baseApiUrl}/${id}`, { method: 'DELETE', headers: this.headers })
    }
    insert(object) {
        this.headers.set("Content-Type", 'application/json')
        return fetch(this.baseApiUrl, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(object)
        })
    }
    update(object) {
        this.headers.set("Content-Type", 'application/json')
        return fetch(this.baseApiUrl, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(object)
        })
    }
}