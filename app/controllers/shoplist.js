class ShoplistController extends BaseController {

    constructor() {
        super(true);
        this.loadProps()
        this.loadData()
        this.loadPartagedListModal()
    }
    loadProps(){
        if(indexController.selectedList!==undefined){
            this.selectedList = indexController.selectedList
            indexController.selectedList = undefined
        }else{
            this.selectedList = undefined
        }
    }
    async checkItem(idItem){
        await this.model.changeCheckId(idItem)
        await this.loadData()
    }

    async loadPartagedListModal(){
        if(this.selectedList!==undefined){
            let partagedLists = await this.model.getPartagedListByListId(this.selectedList.id)
            let content = ""
            if(partagedLists!==null) {
                if (partagedLists.length > 0) {
                    for (const partagedList of partagedLists) {
                        let beenhereColor = "grey darken-2"
                        let visibilityAlt = "Peux seulement voir"
                        if(partagedList.edit === true){
                            beenhereColor = "light-green accent-4"
                            visibilityAlt = "Peut voir et modifier"
                        }
                        content +=
                        `
                            <li class="collection-item">
                                Pseudo : ${partagedList.useraffilied.displayname} - E-mail : ${partagedList.useraffilied.login} 
                                <span class="right">
                                    <a class="btn ${beenhereColor} " onclick="shopListController.updateEditPartageList(${partagedList.id})" title="${visibilityAlt}"><i class="material-icons">beenhere</i></a>
                                    <a class="btn red darken-4"><i class="material-icons">delete</i></a>
                                </span>
                            </li>
                        `
                    }
                } else {
                    content += `<li class="collection-item">Cette liste est partagé avec personne</li>`
                }
            }else {
                content += `<li class="collection-item">Cette liste est partagé avec personne</li>`
            }

            $("#partagedList").innerHTML = content

        }
    }

    async updateEditPartageList(idPartageList){
        await this.model.changeEditPartageList(idPartageList)
        await this.loadPartagedListModal()
    }

    async loadData(){
        if(this.selectedList!==undefined){
            $("#titleShopList").innerText = "Modification d'une liste"
            $("#shopName").innerHTML = this.selectedList.shop
            let items = await this.model.getAllItemList(this.selectedList.id)
            let content = ""
            for(const item of items){
                let styleLine = ""
                if(item.checked === true){
                    styleLine = "text-decoration: line-through"
                }
                content +=
                    `
                <tr>
                    <td style="${styleLine}">${item.label}</td>
                    <td style="${styleLine}">${item.quantity}</td>
                    <td>
                        <button class="btn" onclick="shopListController.checkItem(${item.id})" >
                            ${item.checked === false ? '<i class="material-icons">check_box_outline_blank</i>' : '<i class="material-icons">check_box</i>' } 
                        </button>
                        <a class="waves-effect waves-light btn  modal-trigger" onclick="shopListController.selectedItem = ${item.id}" style="background-color: darkred;color: whitesmoke" href="#modal1">
                            <i class="material-icons">delete</i>
                         </a>
                    </td>
                </tr>
                `
            }
            $("#listBody").innerHTML = content
        }
    }
    async addArticle(){
        const label = $("#shopListLabel").value
        const quantity = $("#shopListQuantity").value
        if(label === '' || label===null){
            this.toast("Veuillez remplir le nom de l'article")
            return
        }
        if(quantity === '' || quantity < 0 || quantity===null){
            this.toast("Veuillez une quantité positive")
            return
        }
        const newItem = {
            "checked":false,
            "id_list":this.selectedList.id,
            "label":label,
            "quantity":quantity
        }
        $("#shopListLabel").value = ""
        $("#shopListQuantity").value = ""

        await this.model.insertItem(newItem)
        await this.loadData()

    }

    async deleteItem(){
        await this.model.deleteItem(shopListController.selectedItem)
        await this.loadData()
        this.toast("L'article a bien été supprimé")
    }

}
window.shopListController = new ShoplistController()
