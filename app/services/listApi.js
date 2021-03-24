class ListAPI extends BaseApi{

    constructor() {
        super("http://localhost:3333/list");
    }

    archiveList(listId){
        return fetch(`${this.baseApiUrl}/${listId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        })
    }

    getAllNoArchived() {
        return fetchJSON(`${this.baseApiUrl}/no_archived`)
    }
    getAllArchived() {
        return fetchJSON(`${this.baseApiUrl}/archived`)
    }
}
