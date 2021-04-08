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
    getByConfirmationCode(confirmation_code){
        try {
            return fetchJSON(`${this.baseApiUrl}/get/confirmation_code/${confirmation_code}`)
                .then(result => result)
                .catch(_ => undefined)
        }catch (e) {
            return undefined
        }
    }
    getByPasswordCode(password_code){
        try {
            return fetchJSON(`${this.baseApiUrl}/get/password_code/${password_code}`)
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
                const account = await this.getByEmail(userAccount.login)
                resolve(Object.assign(new UserAccount(), account))
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
            } else if(res.status === 202) {
                resolve(res.status)
            }else{
                reject(res.status)
            }
        }).catch(err => {
           console.log(err)
            reject(err)
        }))

    }

    updateValidation(confirmation_code){
        this.headers.set("Content-Type", 'application/json')
        return fetch(`${this.baseApiUrl}/update_validation/${confirmation_code}`, {
            method: 'PATCH',
            headers: this.headers
        })
    }
    async updateConfirmationCode(login){
        this.headers.set("Content-Type", 'application/json')
        return await fetch(`${this.baseApiUrl}/update_confirmation_code/${login}`, {
            method: 'PATCH',
            headers: this.headers
        })
    }
    async updatePasswordCode(login){
        this.headers.set("Content-Type", 'application/json')
        return await fetch(`${this.baseApiUrl}/update_password_code/${login}`, {
            method: 'PATCH',
            headers: this.headers
        })
    }
    async updatePassword(password_code, password){
        this.headers.set("Content-Type", 'application/json')
        return await fetch(`${this.baseApiUrl}/update_password_with_password_code/${password_code}`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({"challenge": password})
        })
    }
    async updateInfo(id, displayname, login){
        this.headers.set("Content-Type", 'application/json')
        return await fetch(`${this.baseApiUrl}/update_info`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({"id": id, "displayname":displayname, "login":login})
        })
    }

}
