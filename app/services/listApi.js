class ListAPI extends BaseApi{

    constructor() {
        super("list");
    }

    archiveList(listId){
        this.headers.set("Content-Type", 'application/json')
        return fetch(`${this.baseApiUrl}/${listId}`, {
            method: 'PATCH',
            headers: this.headers
        })
    }
    noArchiveList(listId){
        this.headers.set("Content-Type", 'application/json')
        return fetch(`${this.baseApiUrl}/no_archive/${listId}`, {
            method: 'PATCH',
            headers: this.headers
        })
    }

    getAllNoArchived() {
        return fetchJSON(`${this.baseApiUrl}/no_archived`, this.token)
    }
    getAllArchived() {
        return fetchJSON(`${this.baseApiUrl}/archived`, this.token)
    }
    undoDelete(id) {
        return fetch(`${this.baseApiUrl}/undo/${id}`, { method: 'DELETE', headers: this.headers })
    }
}
