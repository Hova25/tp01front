class AdminPanelController extends BaseController {
    constructor() {
        super(true)
        console.log("adminPanelController")
        this.loadNavBarAdmin()
        this.loadUserAccountTable()
    }

    async loadUserAccountTable(){
        let content = ""
        await this.model.apiUserAccount.getAll()
            .then(async allUserAccount => {
                for(const user of allUserAccount){
                    content +=
                        `
                            <tr>
                                <td>${user.displayname}</td>
                                <td>${user.login}</td>
                                <td>${user.active===true ? "Active" : "Inactif" }</td>
                                <td>
                                    <button class="btn" title="${user.active===true ? 'Activer compte' :'Désactiver compte'}">${user.active===true ? '<i class="material-icons">close</i>' : '<i class="material-icons">done</i>' }</button>
                                    <button class="btn" title="modifier utilisateur: ${user.displayname}"> <i class="material-icons">edit</i></button>
                                    <button class="btn" title="Envoie mail réinitialisation mot de passe"><i class="material-icons">email</i></button>
                                </td>
                            </tr>
                        `
                }
            })



        $("#userAccountTableBody").innerHTML = content
    }


    loadNavBarAdmin(){
        $("#nav-bar").innerHTML =
            `
            <div class="nav-wrapper" style="background-color: darkred">
                <a onclick="navigate('adminpanel')" style="cursor: pointer; padding-left:10px; font-size: 1.5em" class="brand-logo">Liste de courses V2 Panel Admin</a>
                <a href="#" data-target="mobile" class="sidenav-trigger"><i class="material-icons">menu</i></a>
    
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    <li class="indigo"><a onclick="navigate('index')" style="cursor: pointer">Retour sur myShopList</a></li>
                    <li><a onclick="sessionStorage.removeItem('token'); navigate('index')" style="cursor: pointer">Deconnexion</a></li>
                </ul>
            </div>
            `
        $("#mobile").innerHTML =
            `
                <li id="adminPanelBtnMobile" ><a onclick="navigate('adminpanel')" style="cursor: pointer">Accueil Panel Admin</a></li>
                <li><a onclick="navigate('index')" style="cursor: pointer">Retour sur myShopList</a></li>
                <li><a onclick="sessionStorage.removeItem('token'); navigate('index')" style="cursor: pointer">Deconnexion</a></li>
            `

    }


}

window.adminPanelController = new AdminPanelController()
