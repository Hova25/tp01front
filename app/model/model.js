class Model {
    constructor() {
        this.apiItem = new ItemAPI()
        this.apiList = new ListAPI()
        this.apiUserAccount = new UseraccountApi()
        this.apiPartageList = new PartageListApi()
    }



    async getAllItemList(idList, idUser){
        let items = []
        for(let item of await this.apiItem.getByListId(idList, idUser)){
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

    async getListById(idList){
        try {
            const list = Object.assign(new List(), await this.apiList.getById(idList))
            list.date = new Date(list.date)
            return list
        } catch (e) {
            if (e === 404) return null
            return undefined
        }
    }
    async getPartageListById(idPartageList, user_id){
        try {
            return Object.assign(new PartageList(), await this.apiPartageList.getById(idPartageList, user_id))
        } catch (e) {
            if (e === 404) return null
            return undefined
        }
    }
    async getAllListPartaged(){
        try {
            const partagedLists = await this.apiPartageList.getAllListPartaged()
            let tabFinal = []
            for(let partagedList of partagedLists){
                partagedList = Object.assign(new PartageList(), partagedList)
                partagedList.useraffilied = await this.apiUserAccount.getById(partagedList.useraccount_id)
                partagedList.list = await this.getListById(partagedList.id_list)
                if(partagedList.list.archived === true){
                    continue
                }
                tabFinal.push(partagedList)
            }
            return tabFinal
        } catch (e) {
            if (e === 404) return null
            return undefined
        }
    }

    async getPartagedListByListId(idList, userAccountId){
        try {
            const partagedLists = await this.apiPartageList.getByListId(idList,userAccountId)

            let tabFinal = []
            for(let partagedList of partagedLists){
                partagedList = Object.assign(new PartageList(), partagedList)
                partagedList.useraffilied = await this.apiUserAccount.getById(partagedList.useraccount_id)
                tabFinal.push(partagedList)
            }
            return tabFinal
        } catch (e) {
            if (e === 404) return null
            return undefined
        }
    }

    getMyAccount(){
        return this.apiUserAccount.getMyAccount().then(res=>res.json)
    }

    deleteItem(idItem) {
        return this.apiItem.delete(idItem).then(res => res.status)
    }
    deletePartageList(partageListId) {
        return this.apiPartageList.delete(partageListId).then(res => res.status)
    }
    async insertPartageList(partageList) {
        return await this.apiPartageList.insert(partageList).then(res => res.status)
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
    changeEditPartageList(partageListId) {
        return this.apiPartageList.changeEdit(partageListId).then(res => res.status)
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
    noArchiveList(idList){
        return this.apiList.noArchiveList(idList).then(res => res.status)
    }
}