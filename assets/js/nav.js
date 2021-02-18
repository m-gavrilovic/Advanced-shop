$(document).ready(function(){
    
    showNav();
});

function showNav(){
    $.ajax({
        url: 'assets/data/nav.json',
        type: 'json',
        method: 'get',
        success: function(items){
            printNavItems(items);
        }
    })
}

function printNavItems(items){
    let html = '';
    for(let item of items){
        html += oneLink(item)
    }
    $('#nav').html(html);
}

function oneLink(item){
    let location = window.location.pathname.split('/')[window.location.pathname.split('/').length-1];
    console.log(location)
        if(location==item.link || location == ''){
            return `<li class="nav-item ml-1 text-uppercase">
            <a class="nav-link active" href="${item.link}">${item.text}</a>
        </li>`
        }
        else {
            return `<li class="nav-item ml-1 text-uppercase">
            <a class="nav-link" href="${item.link}">${item.text}</a>
        </li>`
        }
    };