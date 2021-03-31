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
                await this.service.checkLoginNoExist(login)
                    .then(async res => {
                        if (res === 200) {
                            this.toast("Attention ce login n'existe pas")
                        } else if (res===401){
                            await this.service.authenticate(login, password)
                                .then(res => {
                                    sessionStorage.setItem("token", res.token)
                                    window.location.replace("index.html")
                                })
                                .catch(err => {
                                    console.log(err)
                                    if (err === 401) {
                                        this.toast("Adresse e-mail ou mot de passe incorrect")
                                    } else {
                                        this.displayServiceError()
                                    }
                                })
                        }
                        else{
                            this.displayServiceError()
                        }
                    })
                    .catch(e => {
                        this.displayServiceError()
                    })

            }
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
                            const auth = await this.service.signup(new UserAccount(inscriptionDisplayName, inscriptionEmail, inscriptionPassword))
                            this.toast(`Merci d'avoir créer votre compte ${auth.displayname}`)
                            $("#inscriptionDisplayName").innerText = ""
                            $("#inscriptionEmail").innerText = ""
                            $("#inscriptionPassword").innerText = ""
                            $("#inscriptionPasswordVerif").innerText = ""
                            sessionStorage.setItem("token", auth.token)
                            window.location.replace("index.html")
                        }
                    } else if (res === 401) {
                        this.toast("Création de compte impossible l'e-mail existe deja")
                    } else {
                        this.displayServiceError()
                    }
                })
                .catch(e => {
                    this.displayServiceError()
                })
        }
    }
}

window.loginController = new LoginController()