class ItemAPI extends BaseApi{

    constructor() {
        super("http://localhost:3333/item");
    }

    getByListId(listId) {
        return fetchJSON(`${this.baseApiUrl}/list/${listId}`)
    }

    changeCheck(itemId){
        return fetch(`${this.baseApiUrl}/${itemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        })
    }

}
