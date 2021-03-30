class BaseFormController extends BaseController {
    constructor(secured) {
        super(secured)
    }
    validateRequiredField(selector, name) {
        const value =  $(selector).value
        if ((value == null) || (value === "")) {
            this.toast(`Le champs '${name}' est obligatoire`)
            $(selector).style.backgroundColor = 'antiquewhite'
            return null
        }
        return value
    }
}
