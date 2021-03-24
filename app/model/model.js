class Model {
    constructor() {
        this.apiItem = new ItemAPI()
        this.apiList = new ListAPI()
    }

    async getAllItemList(idList){
        let items = []
        for(let item of await this.apiItem.getByListId(idList)){
            items.push(Object.assign(new Item(), item))
        }
        return items
    }
    async getAllListNoArchived(idList){
        let items = []
        for(let item of await this.apiList.getByListId(idList)){
            items.push(Object.assign(new Item(), item))
        }
        return items
    }



    deleteItem(idItem) {
        return this.apiItem.delete(idItem).then(res => res.status)
    }
    insertItem(item) {
        return this.apiItem.insert(item).then(res => res.status)
    }
    updateItem(item) {
        return this.apiItem.update(item).then(res => res.status)
    }
    changeCheckId(idItem) {
        return this.apiItem.changeCheck(idItem).then(res => res.status)
    }
    deleteList(idList) {
        return this.apiList.delete(idList).then(res => res.status)
    }
    insertList(list) {
        return this.apiList.insert(list).then(res => res.status)
    }
    updateList(list) {
        return this.apiList.update(list).then(res => res.status)
    }
    archiveList(idList){
        return this.apiList.archiveList(idList).then(res => res.status)
    }
}