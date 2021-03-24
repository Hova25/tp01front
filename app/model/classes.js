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