class UseraccountApi extends BaseApi {
    constructor() {
        super("useraccount")
    }
    authenticate(login, password) {
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.baseApiUrl}/authenticate`, {
            method: "POST",
            headers: this.headers,
            body: `login=${login}&password=${password}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    getMyAccount() {
        return fetchJSON(`${this.baseApiUrl}/myaccount`, this.token)
    }

    getById(id) {
        return fetchJSON(`${this.baseApiUrl}/get/${id}`,this.token)
    }
    getByEmail(email){
        try {
            return fetchJSON(`${this.baseApiUrl}/get/email/${email}`, this.token)
                .then(result => result)
                .catch(_ => undefined)
        }catch (e) {
            return undefined
        }
    }

    signup(userAccount){
        let headers = new Headers()
        headers.set("Content-Type", 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.baseApiUrl}/signup`, {
            method: "POST",
            headers: headers,
            body: `displayname=${userAccount.displayname}&login=${userAccount.login}&challenge=${userAccount.challenge}`
        }).then(async res => {
            if (res.status === 200) {
                const auth = await this.authenticate(userAccount.login, userAccount.challenge)
                resolve({"displayname": userAccount.displayname, "token": auth.token})
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    async checkLoginNoExist(login) {
        // return new Promise((resolve, reject) => fetch(`${this.baseApiUrl}/checklogin?login=${login}`, {
        return new Promise((resolve, reject) => fetch(`${this.baseApiUrl}/checklogin?login=${login}`, {
            method: "GET",
        }).then(res => {
            if (res.status === 200) {
                resolve(res.status)
            } else if(res.status === 401) {
                resolve(res.status)
            }else{
                reject(res.status)
            }
        }).catch(err => {
           console.log(err)
            reject(err)
        }))

    }

}
