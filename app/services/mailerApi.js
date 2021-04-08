class MailerAPI extends BaseApi {

    constructor() {
        super("mailer");
    }

    validation_account(account){
        this.headers.set("Content-Type", 'application/json')
        fetch(`${this.baseApiUrl}/validation_account`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(account)
        })
            .catch(e => {
            console.log("erreur envoie mail")
            console.log(e)
        })
    }
    reset_password(account){
        this.headers.set("Content-Type", 'application/json')
        fetch(`${this.baseApiUrl}/reset_password`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(account)
        })
            .catch(e => {
            console.log("erreur envoie mail")
            console.log(e)
        })
    }

}