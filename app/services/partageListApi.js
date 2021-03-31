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

}