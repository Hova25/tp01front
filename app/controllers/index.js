class IndexController extends BaseController {
    constructor() {
        super()
        this.contentAllNoArchivedList = $("#allShopListNoArchived")
        this.loadNoArchivedList()
        this.selectedList = undefined
    }

    async archiveList(listId){
        const response = await this.model.archiveList(listId)
        await indexController.loadNoArchivedList()
        return response
    }
    async deleteList(listId){
        return await this.model.deleteList(listId)
    }
    async seeList(list){
        this.selectedList = await this.model.getListById(list);
        navigate("shoplist")
    }

    async undoDelete() {
        if (this.selectedListDeleted) {
            this.model.insertList(this.selectedListDeleted).then(response => {
                console.log(response)
                if (response !== undefined) {
                    this.selectedListDeleted = null
                    this.displayUndoDone()
                    this.loadNoArchivedList()
                }
            }).catch(_ => this.displayServiceError())
        }
    }
    async displayConfirmDelete(id, archived) {
        try {
            const list = await this.model.getListById(id)
            super.displayConfirmDelete(list, async () => {
                switch (await indexController.deleteList(id)) {
                    case 200:
                        this.selectedListDeleted = list
                        this.displayDeletedMessage(`indexController.undoDelete()`);
                        break
                    case 404:
                        this.displayNotFoundError();
                        break
                    default:
                        this.displayServiceError()
                }
                await indexController.loadNoArchivedList()
            })
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async undoArchive() {
        if (this.currentArchivedList) {
            this.model.noArchiveList(this.currentArchivedList.id).then(response => {
                console.log(response)
                if (response !== undefined) {
                    this.selectedListDeleted = null
                    this.displayUndoDone()
                    this.loadNoArchivedList()
                }
            }).catch(_ => this.displayServiceError())
        }
    }

    async displayConfirmArchive(id) {
        try {
            const list = await this.model.getListById(id)
            super.displayConfirmArchive(list, async () => {
                switch (await indexController.archiveList(id)) {
                    case 200:
                        this.currentArchivedList = list
                        this.displayArchivedMessage("indexController.undoArchive()");
                        break
                    case 404:
                        this.displayNotFoundError();
                        break
                    default:
                        this.displayServiceError()
                }
            })
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async saveNewList(){
        const shop = $("#newShopListName").value
        const date = $("#newShopListDate").value
        let today = new Date();
        let dateJmoin1 = new Date();
        dateJmoin1.setDate(today.getDate()-1);

        const dateJmoin1Compare = dateJmoin1.toISOString()
        if(shop ===""){
            this.toast("Veuillez insérer un nom de magasin")
        }
        if(date ===""){
            this.toast("Veuillez insérer une date")
        }
        if(date<dateJmoin1Compare){
            this.toast(`Veuillez insérer une date après le ${dateJmoin1.toLocaleDateString()}`)
            return
        }
        if(shop !=="" && date!==""){
            const newListProps = {
                "shop": shop,
                "date": date,
                "archived":false
            }
            this.getModal("#modalNewShopList").close()
            const idList = await this.model.insertList(newListProps)
            this.selectedList = await this.model.getListById(idList)
            $("#newShopListName").value = ""
            $("#newShopListDate").value = ""
            navigate("shoplist")
        }
    }

    async loadNoArchivedList(){
        let content = "";
        try{
            const allListNoArchived = await this.model.getAllListNoArchived()
            if(allListNoArchived.length>0) {
                for (const list of allListNoArchived) {
                    const date = list.date.toLocaleDateString()
                    content += `
                    <div class="col s12 m4">
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                                <span class="card-title">${list} - ${date}</span>
                                <button class="btn" onclick="indexController.seeList(${list.id})" >Voir</button>
                                <button class="btn" onclick="indexController.displayConfirmArchive(${list.id})" style="background-color: darkred">Archiver</button>
                                <button class="btn" onclick="indexController.displayConfirmDelete(${list.id})" style="background-color: darkred">Supprimer</button>
                           </div>
                       </div>
                   </div>
                `
                }
            }else{
                content = "Il n'y a actuellement aucune liste en cour"
            }
            this.contentAllNoArchivedList.innerHTML = content
        }catch (err) {
            console.log(err)
            this.displayServiceError()
        }

    }
}

window.indexController = new IndexController()
