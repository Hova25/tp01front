class ItemAPI extends BaseApi{

    constructor() {
        super("item");
    }

    getByListId(listId, idUser) {
        let filterIdUser = ""
        if(idUser!==undefined){
            filterIdUser = `?useraccount_id=${idUser}`
        }
        return fetchJSON(`${this.baseApiUrl}/list/${listId}${filterIdUser}`, this.token)
    }

    changeCheck(itemId){
        this.headers.set("Content-Type", 'application/json')
        return fetch(`${this.baseApiUrl}/${itemId}`, {
            method: 'PATCH',
            headers: this.headers
        })
    }

}
