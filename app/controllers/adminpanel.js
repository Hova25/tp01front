class AdminPanelController extends BaseController {
    constructor() {
        super(true)
        console.log("adminPanelController")
        this.loadNavBarAdmin()
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
