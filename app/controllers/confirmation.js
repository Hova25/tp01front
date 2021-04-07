class ConfirmationController extends BaseController {
    constructor() {
        super(false)
        this.user=undefined
        this.load()
    }
    load(){
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