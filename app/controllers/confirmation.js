class ConfirmationController extends BaseController {
    constructor() {
        super(false)
        this.user=undefined
        if(($_GET('code')===null&&$_GET('password_reset')===null) ||
            ($_GET('code')!==null&&$_GET('password_reset')!==null)
        ){
            window.location.replace("login.html")
        }else if($_GET('code')!==null){
            this.loadValidationAccount()
        }else if($_GET('password_reset')!==null){
            this.loadNewPassword()
        }else{
            window.location.replace("login.html")
        }
    }
    loadNewPassword(){
        console.log("newPassword")
        $("#confirmationContainer").innerHTML = `
            <h2>Reinitialisatrion de votre mot de passse MyShopList !</h2>

            <label for="newPassword">Entre votre nouveau mot de passe</label>
            <input id="newPassword" placeholder="Entrez votre mot de passe" type="password" class="validate">
            <label for="newPasswordVerif">Entrez la confirmation de votre mot de passe</label>
            <input id="newPasswordVerif" placeholder="Entrez de nouveau votre mot de passe" type="password" class="validate">
            <button class="btn" onclick="confirmationController.reinitialisationMdp()">Re-initialiser le mot de passe</button>
            <button class="btn" onclick="window.location.replace('login.html')">Retourner à l'espace de connexion</button>
            `


        // const user  = await this.model.apiUserAccount.getByPasswordCode($_GET("password_reset"))
        // console.log(user)

    }
    reinitialisationMdp(){
        const newPassword = $("#newPassword").value
        const newPasswordVerif = $("#newPasswordVerif").value
        let compteur = 0
        if(newPassword===""){
            this.toast("Attention vous n'avez pas entré de mot de passe")
            compteur++
        }
        if(newPasswordVerif===""){
            this.toast("Attention vous n'avez pas entré  la confirmation de mot de passe")
            compteur++
        }
        if(newPassword!==newPasswordVerif && compteur===0){
            this.toast("Attention vous n'avez pas entré le même mot de passe")
            compteur++
        }
        if(newPassword===newPasswordVerif && compteur===0){
            this.model.apiUserAccount.getByPasswordCode($_GET("password_reset"))
                .then(async res =>{
                    if(res===undefined){
                        this.toast("Attention il semblerai que vous n'avez pas le bon lien de modification de mot de passe")
                    }else{
                        this.user = res
                        const status = await this.model.apiUserAccount.updatePassword($_GET('password_reset'), newPassword)
                        switch (status.status){
                            case 401:
                                this.toast(`<span>Le delais a été expiré</span><button class="btn-flat toast-action" onclick="confirmationController.mailNewPassword()">Renvoyer une demande de mot de passe par mail</button>`)
                                break
                            case 200:
                                this.toast("Votre mot de passe a bien été modifié")
                                break
                            case 404:
                                this.toast("Votre lien semble ne pas être correct")
                                break
                            default:
                                this.displayServiceError()
                        }

                    }
                })
                .catch(err => {
                  this.displayServiceError()
                })
        }

    }

    mailNewPassword(){
        this.model.apiUserAccount.updatePasswordCode(this.user.login)
        this.model.apiMailer.reset_password(this.user)
    }

    loadValidationAccount() {
        this.model.apiUserAccount.updateValidation($_GET('code'))
            .then(async res => {
                this.user =  await this.model.apiUserAccount.getByConfirmationCode($_GET('code'))
                switch (res.status){
                    case 200:
                        $("#confirmationContainer").innerHTML =
                            `
                                <h4>Votre e-mail ${this.user.login} a bien été confirmé  </h4>
                                <button class="btn" onclick="window.location.replace('login.html')">Retour à la page de connexion</button>
                            `
                        break;
                    case 401:
                        $("#confirmationContainer").innerHTML =
                            `
                                <h4>Le délais de 24h pour réactiver votre compte a été dépasser </h4>
                                <button class="btn" onclick="confirmationController.updateConfirmationCode()">Re-envoyer un e-mail de confirmation sur ${this.user.login} </button>
                                <button class="btn" onclick="window.location.replace('login.html')">Retour à la page de connexion</button>
                            `
                        // reproser mail d'activation
                    case 404:
                        // rediriger login non existant
                        break
                }
            })
            .catch(err => {
                console.log(err)
                this.displayServiceError()
            })
    }

    async updateConfirmationCode(){
        await this.model.apiUserAccount.updateConfirmationCode(this.user.login)
        const user =  await this.model.apiUserAccount.getByEmail(this.user.login)
        await this.model.mailConfirmation(user)
        this.toast(`L'e-mail de confirmation a bien été renvoyé à l'adresse ${this.user.login}`)
    }

}

window.confirmationController = new ConfirmationController()