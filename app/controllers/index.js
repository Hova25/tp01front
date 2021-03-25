class IndexController extends BaseController {
    constructor() {
        super()
        this.contentAllNoArchivedList = $("#allShopListNoArchived")
        this.loadNoArchivedList()
        this.selectedList = undefined
    }

    async archiveList(listId){
        await this.model.archiveList(listId)
        this.loadNoArchivedList()
    }
    async deleteList(listId){
        await this.model.deleteList(listId)
        this.loadNoArchivedList()
    }
    async seeList(list){
        this.selectedList = await this.model.getListById(list);
        navigate("shoplist")
    }

    async saveNewList(){
        const shop = $("#newShopListName").value
        const date = $("#newShopListDate").value
        let today = new Date();
        let dateJmoin1 = new Date();
        dateJmoin1.setDate(today.getDate()-1);
        dateJmoin1 = dateJmoin1.toISOString()
        if(shop ===""){
            this.toast("Veuillez insérer un nom de magasin")
        }
        if(date ===""){
            this.toast("Veuillez insérer une date")
        }
        if(date<dateJmoin1){
            this.toast(`Veuillez insérer une date supérieur ou égal à ${dateJmoin1}`)
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
            navigate("shoplist")
        }
    }

    async loadNoArchivedList(){
        let content = "";
        try{
            for(const list of await this.model.getAllListNoArchived()){
                const date = list.date.toLocaleDateString()
                content += `
                    <div class="col s12 m4">
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                                <span class="card-title">${list} - ${date}</span>
                                <button class="btn" onclick="indexController.seeList(${list.id})" >Voir</button>
                                <button class="btn" onclick="indexController.archiveList(${list.id})" style="background-color: darkred">Archiver</button>
                                <button class="btn" onclick="indexController.deleteList(${list.id})" style="background-color: darkred">Supprimer</button>
                           </div>
                       </div>
                   </div>
                `
            }
            this.contentAllNoArchivedList.innerHTML = content
        }catch (err) {
            console.log(err)
            this.displayServiceError()
        }

    }
}

window.indexController = new IndexController()
