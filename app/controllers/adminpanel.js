class AdminPanelController extends BaseController {
    constructor() {
        super(true)
        this.loadNavBarAdmin()
        this.loadUserAccountTable()
        this.userActu = undefined
    }

    async loadUserAccountTable(){
        let content = ""
        const searchUser = $("#searchUser").value
        let allUserAccount = []
        if(searchUser=== ""){
            allUserAccount =  await this.model.apiUserAccount.getAll()
        }else {
            allUserAccount = await this.model.apiUserAccount.getAllByLogin(searchUser)
        }
        for(const user of allUserAccount){
            if(user.id === indexController.myAccount.id){ continue; } // choix de cacher l'utilisateur avec le quel ont est connecté
            content +=
                `
                    <tr>
                        <td>${user.displayname}</td>
                        <td>${user.login}</td>
                        <td>${user.active===true ? "Active" : "Inactif" }</td>
                        <td>
                            <button class="btn" onclick="adminPanelController.changeActive(${user.id})" title="${user.active===true ? 'Désactiver compte' :'Activer compte'}">${user.active===true ? '<i class="material-icons">close</i>' : '<i class="material-icons">done</i>' }</button>
                            <button class="btn" onclick="adminPanelController.loadUpdateUserModal(${user.id})" title="modifier utilisateur: ${user.displayname}"> <i class="material-icons">edit</i></button>
                            <button class="btn" onclick="adminPanelController.resetPasswordMail('${user.login}')" title="Envoie mail réinitialisation mot de passe"><i class="material-icons">email</i></button>
                        </td>
                    </tr>
                `
        }
        $("#userAccountTableBody").innerHTML = content
    }

    async loadUpdateUserModal(userid){
        const user = await this.model.apiUserAccount.getById(userid)
        this.userActu = user
        $("#contentUpdateUserByAdmin").innerHTML = `
            <h4>Modification du compte de ${user.displayname}</h4>
            <label for="infoDisplayName">Pseudo</label>
            <input id="infoDisplayName" value="${user.displayname}"  placeholder="Entrez un pseudo" type="text" class="validate">
            <label for="infoEmail">E-mail</label>
            <input id="infoEmail" value="${user.login}" placeholder="Entrez un e-mail" type="text" class="validate">
            
            <ul id="roleCollection" class="collection"> </ul>
            <div id="addRoles" class="input-field col s12">            
            </div>
                        
        `
        const userAccountRoles = await this.model.apiUserAccount.getRolesByUserAccountId(user.id)
        let roleContent = ""
        if(userAccountRoles.length===0){
            roleContent =
                `<li class="collection-item">Il n'y a aucun role assigné à ${user.displayname}</li> `
        }else{
            for(const role of userAccountRoles){
                roleContent +=
                `<li class="collection-item">${role.name} - ${role.description} ${role.name==="Utilisateur" ? '' : `<button class="btn red darken-4 right" onclick="adminPanelController.deleteRole(${user.id}, ${role.id})"><i class="material-icons">delete</i></button>`}</li> `

            }
        }
        $("#roleCollection").innerHTML = roleContent
        const allRoles = await this.model.apiRole.getAll()
        let canTabRole = []
        for(const allRole of allRoles){
            let roleTmp = 0
            for(const userRole of userAccountRoles){
                if(allRole.id === userRole.id){
                    roleTmp++
                }
            }
            if(roleTmp===0){
                canTabRole.push(allRole)
            }
        }
        if(canTabRole.length>0){
            let contentAddRoles =
                `<select multiple id="selectRole">
                    <option value="" disabled>Choisir un ou plusieurs role</option>
                `
            canTabRole.forEach(role => {
                contentAddRoles += `<option value="${role.id}">${role.name}-${role.description}</option>`
            })

            contentAddRoles +=
                `</select>
                <label>Choix de roles à ajouter</label>
                
                <button onclick="adminPanelController.addRole(${user.id})" class="btn">Add Role</button>
                `
            document.getElementById("addRoles").innerHTML = contentAddRoles
            M.FormSelect.init(document.getElementById("selectRole"));
        }
        this.getModal('#modalUpdateUserByAdmin').open()
    }
    async updateUserAccount(){
        const displayname = $("#infoDisplayName").value
        const login = $("#infoEmail").value
        if(displayname!==""&&login!==""&&this.userActu!==undefined){
            await this.model.apiUserAccount.updateInfoByAdmin(this.userActu.id, displayname,login)
            await this.loadUpdateUserModal(this.userActu.id)
            await this.loadUserAccountTable()
        }else {
            this.displayServiceError()
        }
    }

    async deleteRole(userId, roleId){
        await this.model.apiRole.deleteUserAccountHasRole(new UserAccountHasRole(roleId, userId))
        await this.loadUpdateUserModal(userId)
        this.toast("Le role a bien été levé")
    }

    async addRole(userId){
        const options = $("#selectRole").options
        if(options.length>1){
            let selected = 0
            for(let option of options){
                if(option.selected===true){
                    selected++
                    await this.model.apiRole.insertUserAccountHasRole(new UserAccountHasRole(option.value,userId))
                }
            }
            await this.loadUpdateUserModal(userId)
            if(selected>0){
                this.toast("Le role a bien été assigné")
            }else{
                this.toast("Vous n'avez pas ajouté de role")
            }
        }
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
    async loadTest(){
        await this.loadUserAccountTable()
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
