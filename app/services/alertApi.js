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

}