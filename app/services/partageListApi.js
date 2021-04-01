class PartageListApi extends BaseApi {

    constructor() {
        super("partagelist");
    }

    getAll(){
        return fetchJSON(`${this.baseApiUrl}`, this.token)
    }

   async getByListId(listId, userAccountId){
        if(userAccountId!==undefined){
            return new Promise((resolve, reject) => fetch(`${this.baseApiUrl}/${listId}?useraccount_id=${userAccountId}`, {
                method: "GET",
                headers: this.headers,
            }).then(res => {
                if (res.status === 200) {
                    resolve(res.json())
                } else {
                    reject(res.status)
                }
            }).catch(err => reject(err)))
        }else{
            return fetchJSON(`${this.baseApiUrl}/${listId}`, this.token)
        }
    }


    changeEdit(partageListId){
        this.headers.set("Content-Type", 'application/json')
        return fetch(`${this.baseApiUrl}/${partageListId}`, {
            method: 'PATCH',
            headers: this.headers
        })
    }

}