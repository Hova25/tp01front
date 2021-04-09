class AdminPanelController extends BaseController {
    constructor() {
        super(true)
        this.loadNavBarAdmin()
        this.loadUserAccountTable()
    }

    async loadUserAccountTable(){
        let content = ""
        await this.model.apiUserAccount.getAll()
            .then(async allUserAccount => {
                for(const user of allUserAccount){
                    if(user.id === indexController.myAccount.id){ continue; } // choix de cacher l'utilisateur avec le quel ont est connecté
                    content +=
                        `
                            <tr>
                                <td>${user.displayname}</td>
                                <td>${user.login}</td>
                                <td>${user.active===true ? "Active" : "Inactif" }</td>
                                <td>
                                    <button class="btn" onclick="adminPanelController.changeActive(${user.id})" title="${user.active===true ? 'Activer compte' :'Désactiver compte'}">${user.active===true ? '<i class="material-icons">close</i>' : '<i class="material-icons">done</i>' }</button>
                                    <button class="btn" onclick="adminPanelController.loadUpdateUserModal(${user.id})" title="modifier utilisateur: ${user.displayname}"> <i class="material-icons">edit</i></button>
                                    <button class="btn" onclick="adminPanelController.resetPasswordMail('${user.login}')" title="Envoie mail réinitialisation mot de passe"><i class="material-icons">email</i></button>
                                </td>
                            </tr>
                        `
                }
            })

        $("#userAccountTableBody").innerHTML = content
    }

    async loadUpdateUserModal(userid){
        const user = await this.model.apiUserAccount.getById(userid)
        console.log(user)
        $("#contentUpdateUserByAdmin").innerHTML = `
            <h4>Modification du compte de ${user.displayname}</h4>
            <label for="infoDisplayName">Pseudo</label>
            <input id="infoDisplayName" value="${user.displayname}"  placeholder="Entrez un pseudo" type="text" class="validate">
            <label for="infoEmail">E-mail</label>
            <input id="infoEmail" value="${user.login}" placeholder="Entrez un e-mail" type="text" class="validate">
            
            <ul id="roleCollection" class="collection"> </ul>
                        
        `
        const userAccountRoles = await this.model.apiUserAccount.getRolesByUserAccountId(user.id)
        console.log(userAccountRoles)
        let roleContent = ""
        if(userAccountRoles.length===0){
            roleContent =
                `<li class="collection-item">Il n'y a aucun role assigné à ${user.displayname}</li> `
        }else{
            for(const role of userAccountRoles){
                roleContent +=
                `<li class="collection-item">${role.name} - ${role.description}</li> `

            }
        }
        $("#roleCollection").innerHTML = roleContent
        this.getModal('#modalUpdateUserByAdmin').open()
    }


    async resetPasswordMail(email){
        await this.model.apiUserAccount.updatePasswordCode(email)
        const user = await this.model.apiUserAccount.getByEmail(email)
        await this.model.apiMailer.reset_password(user)
        this.toast("Envoie de mail réinitialisation mot de passe")
    }


    async changeActive(userId){
        await this.model.apiUserAccount.changeActive(userId)
        await this.loadUserAccountTable()
    }
    loadTest(){
        console.log('yolo')
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
