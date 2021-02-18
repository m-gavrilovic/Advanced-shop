$(document).ready(function(){
    
    bestSaleProducts();
    showCategories();
    showPrices();
    showFigures(); 
    sortOption();

});


function ajaxCategories(callback){
    $.ajax({
        url: "assets/data/categories.json",
        type: 'json',
        method: "GET",
        success: callback
    })
}

function ajaxFigures(callback){
    $.ajax({
        url: 'assets/data/figures.json',
        type: 'json',
        method: 'GET',
        success: callback
    })
}

function ajaxPrices(callback){
    $.ajax({
        url: 'assets/data/prices.json',
        type: 'json',
        method: 'get',
        success: callback
    })
}

function showPrices(){
    ajaxPrices(
        function(prices){
            printPrices(prices);
        }
    )
}

function printPrices(prices){
    let html = '';
    for(let price of prices){
        html += onePrice(price);
    }
    $('#productPrices').html(html);
    $('.filterByPrice').click(filterPrices);
}

function filterPrices(e){
    e.preventDefault();

    let priceId = $(this).data('id');
    console.log(priceId)
        ajaxFigures(function(products){
            products = filterAllByPrice(products, priceId);
            printFigures(products)
        });
}

function filterAllByPrice(products, priceId){
    return products.filter(x => x.price.id == priceId);
}

function showFigures() {
        ajaxFigures(
            function(products){
                printFigures(products);
                addToCartFigures();
            }
        )
}
function printFigures(products){
    let html = "";
    if(products.length > 0){
        for(let product of products){
            html += oneFigure(product);
        }
    } else {
        html += "<h3 class='block-4 text-center'>No products.</h3>";
    }
    $("#figures").html(html);
    
}
function listgridview(){
    ajaxFigures(function(products){
        let html = '';
        for(let product of products){
            html += listViewLayout(product);
        }
        $('#figures').html(html)
    })
}

function bestSaleProducts(){
    ajaxFigures(
        function(products){
            let html ='';
            for(let product of products){
                if(product.sales==true)
                    html += oneFigure(product);
            }
            $('.best-sales').html(html)
        }
    )
}

function addToCartFigures(){
    $('.cartupdate').click(addToCart);
}

function productsInCart() {
    return JSON.parse(localStorage.getItem("products"));
}

function addToCart() {
    let id = $(this).data("id");

    var products = productsInCart();

    if(products) {
        if(productIsAlreadyInCart()) {
            updateQuantity();
        } else {
            addToLocalStorage()
        }
    } else {
        addFirstItemToLocalStorage();
    }

    function productIsAlreadyInCart() {
        return products.filter(p => p.id == id).length;
    }

    function addToLocalStorage() {
        let products = productsInCart();
        products.push({
            id : id,
            quantity : 1
        });
        localStorage.setItem("products", JSON.stringify(products));
    }

    function updateQuantity() {
        let products = productsInCart();
        for(let i in products)
        {
            if(products[i].id == id) {
                products[i].quantity++;
                break;
            }      
        }

        localStorage.setItem("products", JSON.stringify(products));
    }

    

    function addFirstItemToLocalStorage() {
        let products = [];
        products[0] = {
            id : id,
            quantity : 1
        };
        localStorage.setItem("products", JSON.stringify(products));
    }
}

function clearCart() {
    localStorage.removeItem("products");
}

function showCategories(){
    ajaxCategories(function(categories){
        printCategories(categories);
    })
}

function printCategories(categories){
    let html = "";
    for(let category of categories){
        html += oneCategory(category);
    }
    $("#categories").html(html);
    $('.filterByCategory').click(filterCategories);
}

function filterCategories(e){
    e.preventDefault();

    let categoryId = $(this).data('id');
        ajaxFigures(function(products){
            products = filterByCategory(products, categoryId);
            printFigures(products)
        });
}

function filterByCategory(products, categoryId){
    return products.filter(x => x.category.id == categoryId);
}

function oneFigure(product){
    return `
    <div class="col-sm-6 col-md-6 col-lg-4 mb-4 aos-init aos-animate changeView" data-aos="fade-up">
    <div class="block-4 text-center karticaFigure border">
        <figure class="block-4-image m-0">
        <a href="#"><img src="${product.img.src}" alt="${product.img.alt}" class="img-fluid"></a>
        </figure>
        <div class="block-4-text ">
        
        <h2 class="text-uppercase mb-1 font-weight-bold">${product.brand}</h2>
        <h3 class='mb-1'>${product.model}</h3>
        
        <p class="stock d-inline">${printStock(product.stock)}</p><span class="mx-2">-</span><p class="delivery d-inline">${printDelivery(product.delivery)}</p>
        <p class='mb-1'><span class="text-danger font-weight-bold">${product.price.text}${product.value}</span></p>
        <button type='button' class='btn btn-outline-dark btn-sm text-center m-1 px-2 font-weight-bold cartupdate' ${disableButton(product.stock)} value='Add to Cart' data-id='${product.id}'>Add to Cart</button>
        </div>
    </div>
</div>
    `
}

function listViewLayout(product){
        return `
        <div class="col-12 mb-4 aos-init aos-animate changeView" data-aos="fade-up">
        <div class="block-4 text-center karticaFigure border">
            <figure class="block-4-image m-0">
            <a href="#"><img src="${product.img.src}" alt="${product.img.alt}" class="img-fluid"></a>
            </figure>
            <div class="block-4-text ">
            
            <h2 class="text-uppercase mb-1 font-weight-bold">${product.brand}</h2>
            <h3 class='mb-1'>${product.model}</h3>
            
            <p class="stock d-inline">${printStock(product.stock)}</p><span class="mx-2">-</span><p class="delivery d-inline">${printDelivery(product.delivery)}</p>
            <p class='mb-1'><span class="text-danger font-weight-bold">${product.price.text}${product.value}</span></p>
            <button type='button' class='btn btn-outline-dark btn-sm text-center m-1 px-2 font-weight-bold cartupdate' ${disableButton(product.stock)} value='Add to Cart' data-id='${product.id}'>Add to Cart</button>
            </div>
        </div>
    </div>
        `
    }

function oneCategory(category, numOfProducts){
    return `<li class="mb-1">
                <a href="#" class="d-flex filterByCategory" data-id="${ category.id }">
                <span>${ category.title }</span>
                    <span class="text-black ml-auto">(${ category.numOfProducts })</span>
                </a>
            </li>`;
}

function onePrice(price, numOfProducts){
    return `<li class="mb-1">
                <a href="#" class="d-flex filterByPrice" data-id="${ price.id }">
                <span>${ price.text }${price.value}</span>
                    <span class="text-black ml-auto">(${ price.numOfProducts })</span>
                </a>
            </li>`
}

function printDelivery(delivery){
    if(!delivery)
        return "<del>Delivery</del>";
    return "Delivery";
}

function printStock(stock){
    if(!stock)
        return "<del>Stock</del>";
    return "Stock";
}

function disableButton(stock){
    if(!stock)
        return "disabled"
}

function listView() {
        listgridview();
      $('.listViewActive').addClass('active');
      $('.gridViewActive').removeClass('active');
}


function gridView(){
    showFigures();
    $('.listViewActive').removeClass('active');
    $('.gridViewActive').addClass('active');    
}
function imeCheck(){
    var nameReg=/^[A-ZŠŽĐĆČ]{1}[a-zšžđćč]{2,}$/;

    var ime = document.getElementById('ime').value;
    console.log(ime);
    var imeStyle = document.getElementById('ime');
    if(!nameReg.test(ime) && ime.length>0){
        imeStyle.classList.remove('form-control');
        imeStyle.classList.add('regfail');
    }
    else {
        imeStyle.classList.remove('regfail');
        imeStyle.classList.add('form-control');
    }
}

function prezCheck(){
    var nameReg=/^[A-ZŠŽĐĆČ]{1}[a-zšžđćč]{2,}$/;

    var prezime = document.getElementById("prezime").value;
    var prezimeStyle = document.getElementById("prezime");
    if(!nameReg.test(prezime) && prezime.length>0){
        prezimeStyle.classList.remove('form-control');
        prezimeStyle.classList.add('regfail');
    }
    else {
        prezimeStyle.classList.remove('regfail');
        prezimeStyle.classList.add('form-control');
    }
}

function emailCheck(){
    var emailReg= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    var email = document.getElementById("email").value;
    var emailStyle = document.getElementById("email");
    if(!emailReg.test(email) && email.length>0){
        emailStyle.classList.remove('form-control');
        emailStyle.classList.add('regfail');
    }
    else {
        emailStyle.classList.remove('regfail');
        emailStyle.classList.add('form-control');
    }
}

function treaCheck(){
    var textReg=/[A-zŠšŽžĐđĆćČč\s,0-9\.\?\\\/;\()\n\!]{0,300}/;

    var textTrea = document.getElementById("questions").value;
    var textTreaStyle = document.getElementById("questions");
    if(!textReg.test(textTrea) && textTrea.length>0){
        textTreaStyle.classList.remove('form-control');
        textTreaStyle.classList.add('regfail');
    }
    else {
        textTreaStyle.classList.remove('regfail');
        textTreaStyle.classList.add('form-control');
    }
}

function sortOption(){
if($('#ddSort')!=null){    
$('#ddSort').on('click', function(){
     Number(this.value) ? sortPrice(this.value) : printFigures();
})
}

function sortPrice(id){
    console.log(id)
    ajaxFigures(function(data){
        if(id==1){
            data.sort(function(a,b){
                if(a.model == b.model)
                    return 0;
                return a.model > b.model ? 1 : -1;
            });
        } else if(id==2){
            data.sort(function(a,b){
                if(a.price.text == b.price.text)
                    return 0;
                return a.price.text > b.price.text ? 1 : -1;
            });
        } else if (id==3){
            data.sort(function(a,b){
                if(a.price.text==b.price.text)
                    return 0;
                return a.price.text > b.price.text ? -1 : 1;
            })
            
        }
        printFigures(data);
    })
}
}




