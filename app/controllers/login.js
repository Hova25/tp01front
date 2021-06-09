class LoginController extends BaseFormController {
    constructor() {
        super(false)
        this.service = new UseraccountApi()
    }
    async authenticate() {
        let login = this.validateRequiredField('#fieldLogin', 'Adresse e-mail')
        let password = this.validateRequiredField('#fieldPassword', 'Mot de passe')
        if ((login != null) && (password != null)) {
            let test = 0
            if (!this.checkEmail(login)) {
                this.toast("Attention vous n'avez pas entré un login valide (format e-mail)")
                test++
            }
            if(test===0) {
                await this.service.authenticate(login, password)
                    .then(async res => {
                        const user =  await this.service.getByEmail(login)
                        if(user === undefined){
                            this.displayServiceError()
                        }
                        if(user.active===false){
                            this.toast(`<span>Attention vous devez activer votre compte par e-mail</span><button class="btn-flat toast-action" onclick="loginController.updateConfirmationCode()">Renvoyer le mail de confirmation</button>`)
                        }else{
                            sessionStorage.setItem("token", res.token)
                            window.location.replace("index.html")
                        }
                    })
                    .catch(err => {
                        if (err === 401) {
                            this.toast("Adresse e-mail ou mot de passe incorrect")
                        } else {
                            this.displayServiceError()
                        }
                    })
            }
        }
    }

    async updateConfirmationCode(){
        const login = $("#fieldLogin").value
        await this.model.apiUserAccount.updateConfirmationCode(login)
        const user =  await this.service.getByEmail(login)
        await this.model.mailConfirmation(user)
        this.toast(`L'e-mail de confirmation a bien été renvoyé à l'adresse ${login}`)
    }

    async forgotmdp(){
        const email = $("#mdpForgotEmail").value
        let test = 0
        if (!this.checkEmail(email)) {
            this.toast("Attention vous n'avez pas entré un e-mail valide")
            test++
        }
        if(test===0){
            await this.service.checkLoginNoExist(email)
                .then(async res => {
                    if (res === 200) {
                        this.toast("Attention l'e-mail entré n'existe pas")
                    }else if (res===202){
                        await this.model.apiUserAccount.updatePasswordCode(email)
                        const user = await this.model.apiUserAccount.getByEmail(email)
                        await this.model.apiMailer.reset_password(user)
                        this.toast("Envoie de mail réinitialisation mot de passe")
                        $("#mdpForgotEmail").value = ""
                        this.getModal("#modalMDP").close()
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.displayServiceError()
                })
        }
    }

    async inscription(){
        let inscriptionDisplayName = this.validateRequiredField("#inscriptionDisplayName",'Pseudo')
        let inscriptionEmail = this.validateRequiredField("#inscriptionEmail",'Adresse e-mail')
        let inscriptionPassword = this.validateRequiredField("#inscriptionPassword",'Mot de passe')
        let inscriptionPasswordVerif = this.validateRequiredField("#inscriptionPasswordVerif",'Confirmation mot de passe')
        let test = 0
        if (!this.checkEmail(inscriptionEmail)) {
            this.toast("Attention vous n'avez pas entré un e-mail valide")
            test++
        }
        if(inscriptionPassword!==inscriptionPasswordVerif){
            this.toast("Attention vous n'avez pas entré le même mot de passe")
            test++
        }
        if(test===0) {
            await this.service.checkLoginNoExist(inscriptionEmail)
                .then(async res => {
                    if (res === 200) {
                        if (inscriptionDisplayName !== null && inscriptionEmail !== null && inscriptionPassword !== null) {
                            const account = await this.service.signup(new UserAccount(inscriptionDisplayName, inscriptionEmail, inscriptionPassword))
                            await this.model.mailConfirmation(account)
                            this.toast(`Merci d'avoir créer votre compte ${account.displayname} un email vous a été envoyé pour valider votre compte et pouvoir vous connecter`)

                            $("#inscriptionDisplayName").value = ""
                            $("#inscriptionEmail").value = ""
                            $("#inscriptionPassword").value = ""
                            $("#inscriptionPasswordVerif").value = ""
                            this.getModal("#modalInscription").close()
                        }
                    } else if (res === 202) {
                        this.toast("Création de compte impossible l'e-mail existe deja")
                    } else {
                        this.displayServiceError()
                    }
                })
                .catch(e => {
                    console.log(e)
                    this.displayServiceError()
                })
        }
    }
}

window.loginController = new LoginController()