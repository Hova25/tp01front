class ArchivesController extends BaseController {
    constructor() {
        super(true)
        this.contentAllArchivedList = $("#allShopListArchived")
        this.loadArchivedList()
    }
    async deleteList(listId){
        return await this.model.deleteList(listId)
    }
    async undoDelete() {
        if (this.selectedListDeleted) {
            this.model.insertList(this.selectedListDeleted).then(response => {
                if (response !== undefined) {
                    this.selectedListDeleted = null
                    this.displayUndoDone()
                    this.loadArchivedList()
                }
            }).catch(_ => this.displayServiceError())
        }
    }
    async displayConfirmDelete(id, archived) {
        try {
            const list = await this.model.getListById(id)
            super.displayConfirmDelete(list, async () => {
                switch (await archivesController.deleteList(id)) {
                    case 200:
                        this.selectedListDeleted = list
                        this.displayDeletedMessage(`archivesController.undoDelete()`);
                        break
                    case 404:
                        this.displayNotFoundError();
                        break
                    default:
                        this.displayServiceError()
                }
                await archivesController.loadArchivedList()
            })
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    allowDrop(ev) {
        ev.preventDefault();
    }

    drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
    }

    async loadArchivedList(){
        let content = "";
        try{
            const allListArchived = await this.model.getAllListArchived()
            if(allListArchived.length >0) {
                for (const list of allListArchived) {
                    const date = list.date.toLocaleDateString()
                    content += `
                    <div id="archiveDiv-${list.id}" class="draggable" draggable="true" ondragstart="drag(event)" class="col s12 m4" >
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                                <span class="card-title">
                                    ${list} - ${date} 
                                    <button onclick="archivesController.seeArchiveList(${list.id})" class="btn">Voir</button>
                                    <button onclick="archivesController.displayConfirmDelete(${list.id})" class="btn" style="background-color: darkred">Supprimer</button>
                                </span>
                           </div>
                       </div>
                   </div>
                `
                }
            }else{
                content = "Il n'y a actuellement aucune liste archivée"
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