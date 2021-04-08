class MyProfileController extends BaseFormController {
    constructor() {
        super(true)
        this.load()
    }

    load(){
        $("#titleProfile").innerText = `Bienvenu sur votre profil ${indexController.myAccount.displayname}`

        $("#myprofile").innerHTML = `
            <label for="infoDisplayName">Votre pseudo</label>
            <input id="infoDisplayName" value="${indexController.myAccount.displayname}"  placeholder="Entrez votre pseudo" type="text" class="validate">
            <label for="infoEmail">Votre e-mail (attention si vous modifiez votre e-mail vous allez être deconnecter)</label>
            <input id="infoEmail" value="${indexController.myAccount.login}" placeholder="Entrez votre e-mail" type="text" class="validate">
            <button class="btn" onclick="myprofileController.updateInfos()">Modifiez vos informations</button>
            <button class="btn" onclick="myprofileController.getModal('#modalUpdateMdp').open()">Modifiez votre mot de passe</button>
        
        `
    }

    async updateInfos(){
        let compteur = 0
        const displayname = this.validateRequiredField("#infoDisplayName", "pseudo")
        const login = this.validateRequiredField("#infoEmail", "login")
        if(displayname===null || login===null){
            compteur++
        }
        if(!this.checkEmail(login)&&compteur===0){
            this.toast("Attention votre email est incorect")
            compteur++
        }
        if(compteur===0){
            if(displayname!== indexController.myAccount.displayname || login!==indexController.myAccount.login) {
                await this.model.apiUserAccount.updateInfo(indexController.myAccount.id, displayname, login)
                if (indexController.myAccount.login !== login) {
                    sessionStorage.removeItem('token');
                    navigate('index');
                }
                this.modifDisplayName(displayname)
                this.toast("Vos informations ont bien été modifié")
            }else{
                this.toast("Vos données sont resté identique")
            }
        }
    }
    modifDisplayName(displayname){
        $("#profileNav").innerHTML = displayname
        $("#profileNavMobile").innerHTML = displayname
        $("#titleProfile").innerText = `Bienvenu sur votre profil ${displayname}`
    }
    updatemdp(){

    }
}
window.myprofileController = new MyProfileController()