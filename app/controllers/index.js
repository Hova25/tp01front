class IndexController extends BaseController {
    constructor() {
        super(true)
        this.loadNavBar()
        this.loadUserPanel()
        this.contentAllNoArchivedList = $("#allShopListNoArchived")
        this.loadNoArchivedList()
        this.selectedList = undefined
        this.partagedList = false
        this.allListNoArchived = []
    }

    async saveSubscription(){
        let paymentNumber = $("#paymentNumber").value
        let paymentCvs = $("#paymentCvs").value
        let paymentExpiration = $("#paymentExpiration").value
        let errorCount = 0
        if(paymentNumber === ''){
            this.toast("Le numéro de votre carte bleu est obligatoire pour s'abonner")
            errorCount++
        }
        if(paymentCvs === ''){
            this.toast("Le cryptogram de votre carte bleu est obligatoire pour s'abonner")
            errorCount++
        }
        if(paymentExpiration === ''){
            this.toast("Le numéro de votre carte bleu est obligatoire pour s'abonner")
            errorCount++
        }
        if(errorCount===0){
            await this.model.apiPayment.insert(new Payment(this.myAccount.id, paymentNumber, paymentCvs, paymentExpiration, '4.9'))
                .then(async res => {
                    if (res.status === 200) {
                        $("#paymentNumber").value = ""
                        $("#paymentCvs").value = ""
                        $("#paymentExpiration").value = ""
                        this.getModal("#modalSubscription").close()
                        this.toast("Votre abonnement a bien été pris en compte !")
                        await this.model.apiMailer.subscription(this.myAccount)
                        $("#bannierToVip").style.display = "none"
                        await this.loadAlert()
                        await this.loadUserPanel()
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.displayServiceError()
                })

        }

    }


    async loadUserPanel(){
        this.myAccount = await this.model.apiUserAccount.getMyAccount()
        this.vipRole = await this.model.apiUserAccount.getRolesByUserAccountId(this.myAccount.id, 3)
        if(this.vipRole.length>0){
            $('#bannierToVip').style.display = 'none'
            this.myAccount.subscriber = 1
        }else {
            $('#bannierToVip').style.display = 'block'
            this.myAccount.subscriber = 0
        }
        $("#profileNav").innerHTML = this.myAccount.displayname
        $("#profileNavMobile").innerHTML = this.myAccount.displayname
        await this.loadAdminPanel()

    }
    async loadAdminPanel(){
        const userAccess = await this.model.apiUserAccount.checkUserAccessRole(2,this.myAccount.id)
        if(userAccess.status===200){
            $("#adminPanelBtn").style.display = "block"
            $("#adminPanelBtnMobile").style.display = "block"
        }
    }

    async archiveList(listId){
        const response = await this.model.archiveList(listId)
        await indexController.loadNoArchivedList()
        return response
    }
    async deleteList(listId){
        return await this.model.deleteList(listId)
    }
    async seeList(list, partagedList){
        if(partagedList===true){
            this.partagedList = true
        }
        this.selectedList = await this.model.getListById(list);
        navigate("shoplist")
    }

    async undoDelete() {
        if (this.selectedListDeleted) {
            this.model.undoDeleteList(this.selectedListDeleted.id).then(response => {
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
        if(this.myAccount.subscriber === 0 && this.allListNoArchived.length >= 1 ) {
            this.toast("Abonnez vous pour avoir plus d'une liste active sinon archivez ou supprimez la")
        }else{
            const shop = $("#newShopListName").value
            const date = $("#newShopListDate").value
            let today = new Date();
            let dateJmoin1 = new Date();
            dateJmoin1.setDate(today.getDate() - 1);

            const dateJmoin1Compare = dateJmoin1.toISOString()
            if (shop === "") {
                this.toast("Veuillez insérer un nom de magasin")
            }
            if (date === "") {
                this.toast("Veuillez insérer une date")
            }
            if (date < dateJmoin1Compare) {
                this.toast(`Veuillez insérer une date après le ${dateJmoin1.toLocaleDateString()}`)
                return
            }
            if (shop !== "" && date !== "") {
                const newListProps = {
                    "shop": shop,
                    "date": date,
                    "archived": false
                }
                this.getModal("#modalNewShopList").close()
                const idList = await this.model.insertList(newListProps)
                this.selectedList = await this.model.getListById(idList)
                $("#newShopListName").value = ""
                $("#newShopListDate").value = ""
                this.loadNoArchivedList()
                navigate("shoplist")
            }
        }
    }

    async loadNoArchivedList(){
        await this.model.apiUserAccount.refreshToken()
        //refreshtoken

        let content = "";
        try{
            this.allListNoArchived = await this.model.getAllListNoArchived()
            await this.loadAlert()
            if(this.allListNoArchived.length>0) {
                for (const list of this.allListNoArchived) {
                    let today = new Date();
                    let dateJmoin7 = new Date();
                    dateJmoin7.setDate(today.getDate()-7)
                    const date = list.date.toLocaleDateString()

                    let cardColor = "blue darken-2"
                    if(date < dateJmoin7.toLocaleDateString()){
                        cardColor = "indigo darken-2"
                    }
                    content += `
                    <div class="col s12 m4">
                        <div class="card ${cardColor} darken-1">
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

    loadNavBar(){
        $("#nav-bar").innerHTML =
            `
                <div class="nav-wrapper light-green accent-4">
                    <a onclick="navigate('index')" style="cursor: pointer; padding-left:10px; font-size: 1.5em" class="brand-logo">Liste de courses V2</a>
                    <a href="#" data-target="mobile" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        
                    <ul id="nav-mobile" class="right hide-on-med-and-down">
                        <li><a onclick="navigate('index')" style="cursor: pointer">Accueil</a></li>
                        <li><a class="modal-trigger" href="#modalNewShopList" style="cursor: pointer">Nouvelle Liste</a></li>
                        <li ><a onclick="navigate('partagedlist')">Partagé avec moi</a></li>
                        <li><a onclick="navigate('archives')" style="cursor: pointer">Archives</a></li>
                        <li class="light-blue accent-2" ><a id="profileNav" onclick="navigate('myprofile')">Mon profile</a></li>
                        <li id="adminPanelBtn" style="display: none ;"><a onclick="navigate('adminpanel')" style="cursor: pointer">Panel Admin</a></li>
                        <li><a onclick="sessionStorage.removeItem('token'); navigate('index')" style="cursor: pointer">Deconnexion</a></li>
                    </ul>
        
                    <ul id='userProfileDropDown' class='dropdown-content'>
                        <li><a onclick="navigate('myprofile')">Mon profile</a></li>
                        <li><a onclick="navigate('partagedlist')">Partagé avec moi</a></li>
                    </ul>
                </div>
            `

        $("#mobile").innerHTML =
            `
                <li><a onclick="navigate('index')" style="cursor: pointer">Accueil</a></li>
                <li><a href="#modalNewShopList" class="modal-trigger" style="cursor: pointer">Nouvelle Liste</a></li>
                <li><a onclick="navigate('archives')" style="cursor: pointer">Archives</a></li>
                <li><a id="profileNavMobile" onclick="$('#sousMenuProfile').style.display ==='none' ? $('#sousMenuProfile').style.display = 'block' : $('#sousMenuProfile').style.display = 'none'" style="cursor: pointer"></a></li>
                <ul id="sousMenuProfile" style="padding: 0 20px; display:none" >
                    <li><a onclick="navigate('myprofile')">Mon profile</a></li>
                    <li><a onclick="navigate('partagedlist')">Partagé avec moi</a></li>
                </ul>
                <li id="adminPanelBtnMobile" style="display: none ;"><a onclick="navigate('adminpanel')" style="cursor: pointer">Panel Admin</a></li>
                <li><a onclick="sessionStorage.removeItem('token'); navigate('index')" style="cursor: pointer">Deconnexion</a></li>
            `
    }

}

window.indexController = new IndexController()
