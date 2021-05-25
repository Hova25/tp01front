class AlertApi extends BaseApi {
    constructor() {
        super("alert")
    }

    getMyAlertNoChecked() {
        return fetchJSON(`${this.baseApiUrl}?checked=false`, this.token)
    }

    changeCheck(alertId){
        this.headers.set("Content-Type", 'application/json')
        return fetch(`${this.baseApiUrl}/${alertId}`, {
            method: 'PATCH',
            headers: this.headers
        })
    }

    async adminInsert(object) {
        this.headers.set("Content-Type", 'application/json')
        return await fetch(`${this.baseApiUrl}/admin/insert`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(object)
        })
    }

}