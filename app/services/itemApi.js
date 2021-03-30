class ItemAPI extends BaseApi{

    constructor() {
        super("item");
    }

    getByListId(listId) {
        return fetchJSON(`${this.baseApiUrl}/list/${listId}`, this.token)
    }

    changeCheck(itemId){
        this.headers.set("Content-Type", 'application/json')
        return fetch(`${this.baseApiUrl}/${itemId}`, {
            method: 'PATCH',
            headers: this.headers
        })
    }

}
