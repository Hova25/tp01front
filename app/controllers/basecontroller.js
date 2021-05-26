class BaseController {
    constructor(secured) {
        this.model = new Model()
        if (secured) { this.checkAuthentication();  this.loadAlert() }
        M.AutoInit();
        this.setBackButtonView('index')
    }
    checkAuthentication() {
        if (sessionStorage.getItem("token") === null) {
            window.location.replace("login.html")
        }
    }
    async handleClickCheckAlert(alertId, alertTitle){
        await this.model.changeCheckAlert(alertId)
        await this.loadAlert()
        this.toast(`La notification : ${alertTitle} a bien été visualisé `)
    }
    async loadAlert(){
        let alerts = await this.model.getMyAlertNoChecked()
        $("#alertNumber").innerText = alerts.length

        let alertContent = ""
        if(alerts !== undefined && alerts.length > 0) {
            for (const alert of alerts) {
                const date = new Date(alert.date).toLocaleString()
                alertContent += `
                  <li class="collection-item">
                    <span class="title">${alert.title} <i onclick="indexController.handleClickCheckAlert(${alert.id}, '${alert.title}')" class="material-icons cursor_pointer" style="float: right;">close</i></span>
                    <p>${alert.text} <br>
                        ${date}
                    </p>
                </li>
            `
            }
        }else {
            alertContent += `
                  <li class="collection-item">
                    <span class="title">Vous n'avez pas de notification</span>
                </li>
            `
        }
        $("#alertContent").innerHTML = alertContent
    }

    displayConfirmDelete(object, onclick) {
        if (object === undefined) {
            this.displayServiceError()
            return
        }
        if (object === null) {
            this.displayNotFoundError()
            return
        }
        $('#spanDeleteObject').innerText = object.toString()
        $('#btnDelete').onclick = onclick
        this.getModal('#modalConfirmDelete').open()
    }
    displayConfirmArchive(object, onclick) {
        if (object === undefined) {
            this.displayServiceError()
            return
        }
        if (object === null) {
            this.displayNotFoundError()
            return
        }
        $('#spanArchiveObject').innerText = object.toString()
        $('#btnArchive').onclick = onclick
        this.getModal('#modalConfirmArchive').open()
    }
    toast(msg) {
        M.toast({html: msg, classes: 'rounded'})
    }
    displayDeletedMessage(onUndo) {
        this.toast( `<span>Supression effectuée</span><button class="btn-flat toast-action" onclick="${onUndo}">Annuler</button>`)
    }
    displayArchivedMessage(onUndo) {
        this.toast( `<span>Archivage effectuée</span><button class="btn-flat toast-action" onclick="${onUndo}">Annuler</button>`)
    }
    displayUndoDone() {
        this.toast('Opération annulée')
    }
    displayNotFoundError() {
        this.toast('Entité inexistante')
    }
    displayServiceError() {
        this.toast( 'Service injoignable ou problème réseau')
    }
    getModal(selector) {
        return M.Modal.getInstance($(selector))
    }
    setBackButtonView(view) {
        window.onpopstate = function() {
            navigate(view)
        }; history.pushState({}, '');
    }
}
