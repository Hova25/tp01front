class BaseApi {
    constructor(baseApiUrl) {
        this.baseApiUrl = baseApiUrl
    }

    getAll() {
        return fetchJSON(this.baseApiUrl)
    }
    getById(id) {
        return fetchJSON(`${this.baseApiUrl}/${id}`)
    }
    delete(id) {
        return fetch(`${this.baseApiUrl}/${id}`, { method: 'DELETE' })
    }
    insert(object) {
        return fetch(this.baseApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(object)
        })
    }
    update(object) {
        return fetch(this.baseApiUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(object)
        })
    }
}