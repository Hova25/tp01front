class ShoplistController extends BaseFormController {

    constructor() {
        super(true);
        this.loadProps()
        this.loadData()
        if(indexController.partagedList===true){
            $("#partagedBtn").innerHTML = " - Liste partagé  "
        }
        this.loadPartagedListModal()

        this.userAccountService = new UseraccountApi()
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
    async undoDelete() {
        if (this.selectedPartageListDeleted) {
            this.model.insertPartageList(this.selectedPartageListDeleted).then(async response => {
                if (response !== undefined) {
                    this.selectedPartageListDeleted = null
                    this.displayUndoDone()
                    await shopListController.loadPartagedListModal()
                }
            }).catch(_ => this.displayServiceError())
        }
    }

    async displayConfirmDeletePartagedList(id, user_id) {
        try {
            const partagedList = await this.model.getPartageListById(id, user_id)
            super.displayConfirmDelete(partagedList, async () => {
                switch (await shopListController.deleteEditPartageList(id)) {
                    case 200:
                        this.selectedPartageListDeleted = partagedList
                        this.displayDeletedMessage(`shopListController.undoDelete()`);
                        break
                    case 404:
                        this.displayNotFoundError();
                        break
                    default:
                        this.displayServiceError()
                }
                await shopListController.loadPartagedListModal()
            })
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }


    async loadPartagedListModal(){
        if(this.selectedList!==undefined){
            let partagedLists = await this.model.getPartagedListByListId(this.selectedList.id, undefined)
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
                                    <a class="btn red darken-4" onclick="shopListController.displayConfirmDeletePartagedList(${partagedList.id}, ${partagedList.owneruser_id})"><i class="material-icons">delete</i></a>
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
    async addPartageBtn(){
        if(this.selectedList!==undefined) {
            const email = $("#addPartageEmail").value
            if(!this.checkEmail(email)){
                this.toast("Attention l'email entré n'est pas au bon format")
            }else{
                const userPartaged = await this.userAccountService.getByEmail(email)
                if(userPartaged!==undefined){
                    const verifPartagedList = await this.model.getPartagedListByListId(this.selectedList.id, userPartaged.id)
                    if(verifPartagedList.length > 0){
                        this.toast(`La list est déjà partagé avec ${userPartaged.displayname}`)
                    }else{
                        let newPartageList = new PartageList(this.selectedList.id,indexController.myAccount.id ,userPartaged.id,false)
                        await this.model.insertPartageList(newPartageList)
                        await this.loadPartagedListModal()
                        $("#addPartageEmail").value = ""
                    }
                }
                else{
                    this.toast(`Aucun compte avec l'email : ${email} existe, demandez à la personne de s'inscrire`)
                }
            }
        }
    }

    async updateEditPartageList(idPartageList){
        await this.model.changeEditPartageList(idPartageList)
        await this.loadPartagedListModal()
    }

    async deleteEditPartageList(idPartageList){
        return await this.model.deletePartageList(idPartageList)
    }

    displayModalPartagedList() {
        if (indexController.myAccount.subscriber === 1) {
            this.getModal("#modalPartagedList").open()
        }else{
            this.toast("Abonnez vous pour pouvoir partager votre liste")
        }
    }
    async loadData(){
        if(this.selectedList!==undefined){
            $("#titleShopList").innerText = "Modification d'une liste"
            $("#shopName").innerHTML = this.selectedList.shop
            let items = []
            if(indexController.partagedList===true){
                items = await this.model.getAllItemList(this.selectedList.id, this.selectedList.useraccount_id)
            }else {
                items = await this.model.getAllItemList(this.selectedList.id)
            }
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
