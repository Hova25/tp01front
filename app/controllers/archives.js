class IndexController extends BaseController {
    constructor() {
        super()
        this.contentAllArchivedList = $("#allShopListArchived")
        this.loadArchivedList()
    }

    async loadArchivedList(){
        let content = "";
        try{
            for(const list of await this.model.getAllListArchived()){
                const date = list.date.toLocaleDateString()
                content += `
                    <div class="col s12 m4">
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                                <span class="card-title">${list} - ${date}</span>
                           </div>
                       </div>
                   </div>
                `
            }
            this.contentAllArchivedList.innerHTML = content
        }catch (err) {
            console.log(err)
            this.displayServiceError()
        }

    }
}

window.indexController = new IndexController()