class AlertApi extends BaseApi {
    constructor() {
        super("alert")
    }


    getMyAlertNoChecked() {
        return fetchJSON(`${this.baseApiUrl}?checked=false`, this.token)
    }
}