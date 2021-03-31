class PartageListApi extends BaseApi {

    constructor() {
        super("partagelist");
    }

    getAll(){
        return fetchJSON(`${this.baseApiUrl}`, this.token)
    }

    getByListId(listId){
        return fetchJSON(`${this.baseApiUrl}/${listId}`, this.token)
    }

    changeEdit(partageListId){
        this.headers.set("Content-Type", 'application/json')
        return fetch(`${this.baseApiUrl}/${partageListId}`, {
            method: 'PATCH',
            headers: this.headers
        })
    }

}