function $(selector, f) {
    if (f == undefined)
        return document.querySelector(selector)
    else 
        document.querySelectorAll(selector).forEach(f)
}

function fetchJSON(url, token) {
    const headers = new Headers();
    if (token !== undefined) {
        headers.append("Authorization", `Bearer ${token}`)
    }
    return new Promise((resolve, reject) => fetch(url, {cache: "no-cache", headers: headers})
        .then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        })
        .catch(err => reject(err)))
}

function include(selector, url, urlcontroller) {
    fetch(url, {cache: "no-cache"})
        .then(res => res.text())
        .then(html => {
            $(`#${selector}`).innerHTML = html
            fetch (urlcontroller, {cache: "no-cache"})
                .then(res => res.text())
                .then(js => {
                    eval(js)
                })
        })
        .catch(function(err) {
            console.log('Failed to fetch page: ', err)
        });
}

function navigate(view) {
    include('content',  `views/${view}.html`, `app/controllers/${view}.js`)
}

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
function reviver(key, value) {
    if (typeof value === "string" && dateFormat.test(value)) {
        return new Date(value);
    }
    return value;
}

function getParameterByName(name) {
    let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function $_GET(param) {
    var vars = {};
    window.location.href.replace( location.hash, '' ).replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if ( param ) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
}