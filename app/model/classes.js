class Item {
    constructor(id_list, label, quantity, checked) {
        this.id = null
        this.id_list = id_list
        this.label = label
        this.quantity = quantity
        this.checked = checked
    }

    toString(){
        return `label`
    }
}

class List {
    constructor(shop, date, archived) {
        this.id = null
        this.shop = shop
        this.date = date
        this.archived = archived
    }

    toString(){
        return `${this.shop}`
    }
}

class UserAccount {
    constructor(displayname, login, challenge, active, confirmation_code, password_code) {
        this.id = null
        this.displayname = displayname
        this.login = login
        this.challenge = challenge
        this.active = active
        this.confirmation_code = confirmation_code
        this.password_code = password_code
    }
}

class PartageList {
    constructor(id_list, owneruser_id,useraccount_id, edit) {
        this.id = null
        this.owneruser_id = owneruser_id
        this.id_list = id_list
        this.useraccount_id = useraccount_id
        this.edit = edit
    }
    toString(){
        return "le partage de la liste"
    }
}

class UserAccountHasRole {
    constructor(idRole,idUserAccount) {
        this.idUserAccount = idUserAccount
        this.idRole = idRole
    }
}

class Alert {
    constructor(useraccount_id,title, text, date, checked) {
        this.id = null
        this.useraccount_id = useraccount_id
        this.title = title
        this.text = text
            if(date===undefined){
                this.date = new Date().toISOString()
            }else{
                this.date = date
            }
        if(checked!==undefined && (checked === true || checked === "true")){
            this.checked = true
        }else{
            this.checked = false
        }
    }

}

class Payment {
    constructor(useraccount_id,number,expiration,cryptogram ,price,date) {
        this.id = null
        this.useraccount_id = useraccount_id
        this.number = number
        this.expiration = expiration
        this.cryptogram = cryptogram
        this.price = price
        if(date===undefined){
            this.date = new Date().toISOString()
        }else{
            this.date = date
        }

    }

}