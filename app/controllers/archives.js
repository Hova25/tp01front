class ArchivesController extends BaseController {
    constructor() {
        super()
        this.contentAllArchivedList = $("#allShopListArchived")
        this.loadArchivedList()
    }

    async loadArchivedList(){
        let content = "";
        try{
            for(const list of await this.model.getAllListArchived()){
                const date = list.date.toLocaleDateString()
                content += `
                    <div class="col s12 m4">
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                                <span class="card-title">${list} - ${date} <button onclick="archivesController.seeArchiveList(${list.id})" class="btn">Voir</button></span>
                           </div>
                       </div>
                   </div>
                `
            }
            this.contentAllArchivedList.innerHTML = content
        }catch (err) {
            console.log(err)
            this.displayServiceError()
        }

    }

    async seeArchiveList(listId){
        const dataList = await this.model.getListById(listId)
        const itemsList = await this.model.getAllItemList(dataList.id)
        console.log(dataList)
        console.log(itemsList)
        const date = dataList.date.toLocaleDateString()
        $("#titleArchived").innerText = ` ${dataList.toString()} - ${date}`
        let archivedItemsContent = ""
         if(itemsList.length>0){
             archivedItemsContent =
                 `
                    <thead>
                        <th>Label</th>
                        <th>Quantité</th>
                    </thead>
                 `
             for(const item of itemsList){
                 let styleLine = ""
                 if(item.checked === true){
                     styleLine = "text-decoration: line-through"
                 }
                 archivedItemsContent +=
                     `
                    <tr>
                        <td style="${styleLine}">${item.label}</td>
                        <td style="${styleLine}">${item.quantity}</td>
                    </tr>
                    `
             }

         }else{
             archivedItemsContent = "Il n'y a pas d'articles enregistré pour cette liste"
         }

        $("#archivedItems").innerHTML = archivedItemsContent

        this.getModal("#modalVueArchived").open()
    }
}

window.archivesController = new ArchivesController()