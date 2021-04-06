class PartagedListController extends BaseController {
    constructor() {
        super(true)
        this.contentAllPartagedList = $("#allShopListPartaged")
        this.loadPartagedList()
    }
    async loadPartagedList(){
        let content = "";
        try{
            const allListPartaged = await this.model.getAllListPartaged()
            console.log(allListPartaged)
            if(allListPartaged.length >0) {
                for (const listPartaged of allListPartaged) {
                    const list = listPartaged.list
                    const date = list.date.toLocaleDateString()
                    content += `
                    <div id="archiveDiv-${list.id}" class="col s12 m4" >
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                                <span class="card-title">
                                    ${list} - ${date} 
                                    ${
                                    listPartaged.edit === false ?
                                    `<button onclick="partageListController.seePartagedList(${list.id}, ${listPartaged.owneruser_id})" class="btn">Voir</button>`: 
                                        `<button onclick="indexController.seeList(${list.id}, true)" class="btn">Voir/Modifier</button>` 
                                    }
                                </span>
                           </div>
                       </div>
                   </div>
                `
                }
            }else{
                content = "Il n'y a actuellement aucune liste archivée"
            }
            this.contentAllPartagedList.innerHTML = content
        }catch (err) {
            console.log(err)
            this.displayServiceError()
        }

    }
    async updatePartagedList(listId){
        console.log("update")
    }

    async seePartagedList(listId, owner_id){
        this.getModal("#modalVuePartaged").open()
            const dataList = await this.model.getListById(listId)
            const itemsList = await this.model.getAllItemList(dataList.id, owner_id)
            const date = dataList.date.toLocaleDateString()
            $("#titlePartaged").innerText = ` ${dataList.toString()} - ${date}`
            let partagedItemsContent = ""
            if(itemsList.length>0){
                partagedItemsContent =
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
                    partagedItemsContent +=
                        `
                        <tr>
                            <td style="${styleLine}">${item.label}</td>
                            <td style="${styleLine}">${item.quantity}</td>
                        </tr>
                        `
                }

            }else{
                partagedItemsContent = "Il n'y a pas d'articles enregistré pour cette liste"
            }

            $("#partagedItems").innerHTML = partagedItemsContent

            this.getModal("#modalVuePartaged").open()
    }

    // async justSeeList(listId){
    //     const dataList = await this.model.getListById(listId)
    //     const itemsList = await this.model.getAllItemList(dataList.id)
    //     const date = dataList.date.toLocaleDateString()
    //     $("#titlePartaged").innerText = ` ${dataList.toString()} - ${date}`
    //     let archivedItemsContent = ""
    //     if(itemsList.length>0){
    //         archivedItemsContent =
    //             `
    //                 <thead>
    //                     <th>Label</th>
    //                     <th>Quantité</th>
    //                 </thead>
    //              `
    //         for(const item of itemsList){
    //             let styleLine = ""
    //             if(item.checked === true){
    //                 styleLine = "text-decoration: line-through"
    //             }
    //             archivedItemsContent +=
    //                 `
    //                 <tr>
    //                     <td style="${styleLine}">${item.label}</td>
    //                     <td style="${styleLine}">${item.quantity}</td>
    //                 </tr>
    //                 `
    //         }
    //
    //     }else{
    //         archivedItemsContent = "Il n'y a pas d'articles enregistré pour cette liste"
    //     }
    //
    //     $("#archivedItems").innerHTML = archivedItemsContent
    //
    //     this.getModal("#modalVuePartaged").open()
    // }
}

window.partageListController = new PartagedListController()