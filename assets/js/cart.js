$(document).ready(function () {
    let products = productsInCart();
    
    if(products==null)
        showEmptyCart();
    else
        displayCartData();

});

function displayCartData() {
    let products = productsInCart();

    $.ajax({
        url : "assets/data/figures.json",
        success : function(data) {
            let productsForDisplay = [];
            data = data.filter(p => {
                for(let prod of products)
                {
                    if(p.id == prod.id) {
                        p.quantity = prod.quantity;
                        return true;
                    }
                        
                }
                return false;
            });
            generateTable(data)
            sumTotal(data);
        }
    });
}


function generateTable(products){
    let html = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col"> </th>
                        <th scope="col">Product</th>
                        <th scope="col"></th>
                        <th scope="col" class="text-center">Quantity</th>
                        <th scope="col" class="text-right">Price</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>`;

                for(let pro of products) {
                    html += generateTr(pro);
                }

                html += `
                    <tr>
                    <td><a href="figures.html" class="btn btn-danger"><i class="fa fa-angle-left"></i> Continue Shopping</a></td>
                    <td colspan="3"></td>
                    <td class="text-center d-flex align-items-center p-3 m-0"><strong id='total'></strong></td>
                    <td><a href="#" class="btn btn-danger btn-block">Checkout <i class="fa fa-angle-right"></i></a></td>
                    </tr>
                </tbody>
                </table>
                </div>`

                    $('.emptyCart').html(html);
                    function generateTr(pro){
                        return  `<tr class='tableDataEdit'>
                        <td><img src="${pro.img.src}" alt='${pro.img.alt}' /> </td>
                        <td>${pro.model}</td>
                        <td></td>
                        <td class='d-flex justify-content-center'>                            
                            <input class="form-control text-center" type="text" value="${pro.quantity}" />
                        <td class="text-right">${pro.price.text}${pro.value}</td>
                        <td class="text-right"><button class="btn btn-sm btn-danger" onclick='removeFromCart(${pro.id})'><i class="fa fa-trash"></i> </button> </td>
                    </tr>`
                    }
                    
                }

                function sumTotal(pro){
                    let pr = 0;
                    pro.forEach(p => {
                        pr += p.price.text*p.quantity;
                    });
                    $('#total').html('Total: ' + pr + '$')
                }



function showEmptyCart() {
    $(".emptyCart").html("<h2 class='text-center'> Your cart is empty! <h2>");
}

function productsInCart() {
    return JSON.parse(localStorage.getItem("products"));
}



function removeFromCart(id) {
    let products = productsInCart();
    let filtered = products.filter(p => p.id != id);

    localStorage.setItem("products", JSON.stringify(filtered));

    displayCartData();
}

