class RoleApi extends BaseApi {
    constructor() {
        super("role")
    }

    async insertUserAccountHasRole(object){
        this.headers.set("Content-Type", 'application/json')
        return await fetch(`${this.baseApiUrl}/useraccount_role`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(object)
        })
    }
    async deleteUserAccountHasRole(object){
        this.headers.set("Content-Type", 'application/json')
        return await fetch(`${this.baseApiUrl}/useraccount_role`, {
            method: 'DELETE',
            headers: this.headers,
            body: JSON.stringify(object)
        })
    }

}