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
    async getAllListNoArchived(){
        let lists = []
        for(let list of await this.apiList.getAllNoArchived()){
            list.date = new Date(list.date)
            lists.push(Object.assign(new List(), list))
        }
        return lists
    }
    async getAllListArchived(){
        let lists = []
        for(let list of await this.apiList.getAllArchived()){
            list.date = new Date(list.date)
            lists.push(Object.assign(new List(), list))
        }
        return lists
    }

    getListById(idList){
        return this.apiList.getById(idList)
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
        return this.apiList.insert(list).then(res => res.json())
    }
    updateList(list) {
        return this.apiList.update(list).then(res => res.status)
    }
    archiveList(idList){
        return this.apiList.archiveList(idList).then(res => res.status)
    }
}