const BASEURL = "data/";

var url = window.location.pathname;
console.log(url)
let buttonCloseModal = document.getElementById("closeModal");
let modalCart = document.getElementById("modalCart");
let buttonCart = document.getElementById("cart");
buttonCart.addEventListener("click",function(){
    if(modalCart.hasAttribute("class")){
        modalCart.classList.remove("block");
        modalCart.removeAttribute("class");
    }
    else {
        modalCart.classList.add("block");
        $("#modalContent").html( showProducts)
    }
});
buttonCloseModal.addEventListener("click",function(){
    modalCart.classList.remove("block");
    modalCart.removeAttribute("class");
});
//callback funkcija
function ajaxCallBack(url,method,result){
    $.ajax({
        url: url,
        method: method,
        dataTyte: "json",
        success: result,
        error: function(jqXHR,exception){
            var err = '';
            if (jqXHR.status === 0) {
                err = 'Not connect.\n Verify your Network.';
            } else if (jqXHR.status == 404) {
                err = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                err = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                err = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                err = 'Time out error.';
            } else if (exception === 'abort') {
                err = 'Ajax request aborted.';
            } else {
                err = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            
            
            let buttonCloseModalError = document.getElementById("closeModal4");
            let modalError = document.getElementById("modalError");
            if(err.length>0){
                $("#cont").html(err)
                modalError.classList.add("block")
            }

            buttonCloseModalError.addEventListener("click", function(){
                modalError.classList.remove("block")
            })
        }
    });
}
//local storage
function saveToLocalStorage(naziv, vrednost){
    localStorage.setItem(naziv, JSON.stringify(vrednost));
}
function getFromLocalStorage(naziv){
    return JSON.parse(localStorage.getItem(naziv));
}
ajaxCallBack(BASEURL+"navigation.json","get",function(result){
    printNavigation(result, "#navigation");
    printNavigation(result, "#list");
});
ajaxCallBack(BASEURL+"social.json","get",function(result){
    printSocialNetwork(result);
});
let productsCart = getFromLocalStorage("cart")
if(productsCart!=null){
    let number = productsCart.length
    $("#broj").html(`${number}`)
}
else{
    $("#broj").html(`0`)
}
//funkcija za ispis navigacije
function printNavigation(x, id){
    let ispis = "";
    for(let el of x){
        ispis+=`<li class=""><a class="d-flex justify-content-center" href="${el.href}">${el.text}</a></li>`;
    }
    $(id).html(ispis);
}
//funkcija za ispis socijalnih mreza u futeru
function printSocialNetwork(x){
    let ispis = "";
    for(el of x){
        ispis+=`<li><a href="${el.href}"><span class="${el.className}"></span> ${el.name}</a></li>`
    }
    $("#social").html(ispis);
}
//single stranica
if(url.indexOf("single.html")!=-1 ||  url=="/single.html"){
    let urlParametar = new URLSearchParams(window.location.search)
    let productId = urlParametar.get("id")
    var brands = []
    var products= []
    var colors = []
    var types = []
    window.onload = function(){
        ajaxCallBack(BASEURL+"products.json","get",function(result){
            products = result
            nadji(result) 
            
        })
        ajaxCallBack(BASEURL+"brands.json","get",function(result){
            marka(result)
        })
        ajaxCallBack(BASEURL+"types.json","get",function(result){
            tip(result)
        })
        ajaxCallBack(BASEURL+"colors.json","get",function(result){
            boja(result)
        })
        ajaxCallBack(BASEURL+"categories.json","get",function(result){
            namena(result)
        })        
    }
    function productDetails(data, category, id){
        var product = products.find(function(p) {
            return p.id == productId;
        });
        cat = category
        let array = data
        let name =""
        for(let x of array){
            if(product.cat == x.id){
                name = x.name
            }
        }
    }
    function namena(data){
        var trazeniProizvod = products.find(function(p) {
            return p.id == productId;
        });

        let namena = data
        let brend =""
        for(let n of namena){
            if(trazeniProizvod.categoryId == n.id){
                brend = n.name
            }
        }
        $("#za").html(brend)
    }
    function marka(data){
        var trazeniProizvod = products.find(function(p) {
            return p.id == productId;
        });

        let brendovi = data
        let brend =""
        for(let b of brendovi){
            if(trazeniProizvod.brandId == b.id){
                brend = b.name
            }
        }
        $("#brand").html(brend)
    }
    function tip(data){
        var trazeniProizvod = products.find(function(p) {
            return p.id == productId;
        });

        var tipovi = data
        let tip =""
        for(let t of tipovi){
            if(trazeniProizvod.typeId == t.id){
                tip = t.name
            }
        }
        $("#tip").html(tip)
    }
    function boja(data){
        var trazeniProizvod = products.find(function(p) {
            return p.id == productId;
        });
        var boje = data
        let boja =""
        for(let c of boje){
            if(trazeniProizvod.colorId == c.id){
                boja = c.name
            }
        }
        $("#color").html(boja)
    }
    function nadji(data){
        let products = data;
       
        var trazeniProizvod = products.find(function(p) {
            return p.id == productId;
        });
        $("#slika").attr("src", trazeniProizvod.image.src)
        $("#naziv").html(trazeniProizvod.name)
        $("#opis").html(trazeniProizvod.description)
        $("#nova").html(trazeniProizvod.price.current+" &euro;")
        $("#stara").html(trazeniProizvod.price.old!=null?trazeniProizvod.price.old+" &euro;":"") 
        $("#add-to-cart-button").attr("data-id",trazeniProizvod.id);
    }
    let dugme = document.getElementById("add-to-cart-button");
    dugme.addEventListener("click",addToCart)
    dugme.addEventListener("click",addToCartAnimation)
    dugme.addEventListener("click",showProducts)
}
if(url.indexOf("index.html")!=-1 || url=="/index.html" || url=="/baggage/" || url=="/"){
    window.onload = function(){
        ajaxCallBack(BASEURL+"products.json","get",function(result){
            top6Products(result, "#trend")
        })
    }
    function top6Products(x, id){
        let ispis =""
        let sortiran = []
        sortiran = x.sort(function(a,b){
            return b.stars - a.stars
        })
        let prvih6 = sortiran.slice(0,6)

        for(let e of prvih6){
            ispis+=`
                    <div class="col-md-4 col-sm-6 gal-img"> 
                    <a class="link" href="single.html?id=${e.id}">
                        <img src="${e.image.src}" alt="${e.image.alt}" class="img-fluid mt-4"><br/>
                        <ul class="stars d-flex justify-content-center">
                                    ${countOfStars(e.stars)}
                        </ul>
                    </a>
                    </div>
                   `
        }
        $(id).html(ispis)
    }
    function countOfStars(x){
        let ispis=""
        for(let i=1 ; i<=5;i++){
            if(i<=x){
                ispis+=`<li><span class="fa fa-star" aria-hidden="true"></span></li>`
            }
            else if(i>x && parseInt(x)==i-1 && x%(i-1)!=0){
                ispis+=`<li><span class="fa fa-star-half-o" aria-hidden="true"></span></li>`
            }
            else{
                ispis+=`<li><span class="fa fa-star-o" aria-hidden="true"></span></li>`
            } 
        }
        return ispis
       }
}
//stranica za shop
if(url.indexOf("shop.html")!=-1 ||  url=="/shop.html"){
    var trendovi = [];
    var products =[];
    window.onload = function(){
        ajaxCallBack(BASEURL+"trends.json","get",function(result){
            trendovi = result
        })
        ajaxCallBack(BASEURL+"products.json","get",function(result){
            saveToLocalStorage("sviProizvodi", result);
            printProducts(result);  
            products = result 
            $("#range").attr("max",findMaxPrice(result))
            $("#range").attr("min",findMinPrice(result))
            $("#rangeValue").html(findMaxPrice(result))
            var slider = document.getElementById("range"); 
            slider.value = slider.max;
        });

        ajaxCallBack(BASEURL+"categories.json","get",function(result){
            print(result,"#cat", "category","brojac");
        });
        ajaxCallBack(BASEURL+"brands.json","get",function(result){
            printModel(result, "#brend");
        });
        ajaxCallBack(BASEURL+"types.json","get",function(result){
            print(result,"#model", "type");
        });
        ajaxCallBack(BASEURL+"colors.json","get",function(result){
            print(result, "#color", "color");
        });
        $(document).on("keyup", "#trazi", search);
        $(document).on("change", "#cat", change);
        $(document).on("change", "#brand", change);
        $(document).on("change", "#model", change);
        $(document).on("change", "#color", change);
        $(document).on("change", "#range", change);
        $(document).on("change", "#sor", change);
        let cenaMax = document.getElementById("rangeValue");
        cenaMax.innerHTML = "1000";     
    }
     // funkcija za promenu filtera
     function change(){
         let proizvodi = getFromLocalStorage("sviProizvodi")
         let categoryId = $("#cat").val();
         let colorId = $("#color").val();
         let modelId = $("#model").val();
         let brandId = $("#brand").val();
     
         proizvodi = filterProducts(proizvodi, categoryId, "category");
         proizvodi = filterProducts(proizvodi, colorId, "color");
         proizvodi = filterProducts(proizvodi, modelId, "model");
         proizvodi = filterProducts(proizvodi, brandId, "brand");
         proizvodi = filterPrice(proizvodi);
         proizvodi = sort(proizvodi)
         
         printProducts(proizvodi);
    } 
    //funkcija za pronalazenje minimalne cene
    function findMinPrice(products) {
        var maxPrice = 99999;
        for (var i = 0; i < products.length; i++) {
        if (products[i].price.current < maxPrice) {
            maxPrice = products[i].price.current;
        }
        }
        return maxPrice;
    }
    //funkcija za pronalazenje maksimalne cene
    function findMaxPrice(products) {
        var maxPrice = 0;
        for (var i = 0; i < products.length; i++) {
          if (products[i].price.current > maxPrice) {
            maxPrice = products[i].price.current;
          }
        }
        return maxPrice;
    }
    //funkcija za pretragu proizvoda
    function search(){
        let products = getFromLocalStorage("sviProizvodi")
        var filtriraniProizvodi = products.filter(e=>{
            if(e.name.toLowerCase().indexOf(document.getElementById("trazi").value.toLowerCase().trim())
            !=-1)
            {
                return true;
            }
        })
        printProducts(filtriraniProizvodi)
    }  
    //funkcija za filtriranje
    function filterProducts(products, id, type) {
        if(id==0){
            return products
        }
        if(type=="color"){
            return products.filter(product => product.colorId == id);
        }
        if(type=="category"){
            return products.filter(product => product.categoryId == id);
        }
        if(type=="brand"){
            let radioLista = document.getElementsByClassName("chc")
            cekirani = Array.from(radioLista).filter(e=>e.checked).map(x=>parseInt(x.value))
            if(radioLista[0].checked){
                return products
            }
            if(!cekirani.length){
                return products
            }
            return products.filter(x=> {
                if(cekirani.includes(x.brandId)){
                    return true
                }
            });
        }
        if(type=="model"){
            return products.filter(product => product.typeId == id);
        }
        return products
    }
    //funkcija za filtriranje do zadate cene
     function filterPrice(data){
        let value=$("#range").val();
        let max = findMaxPrice(products);
        if(value== max) 
            return data
        return data.filter(x=>x.price.current<=value);
    } 
    //funkcija za sortiranje
    function sort(x){
        let sortirani = []
        let selectObj = document.getElementById("sor")
        let selectedIndex = selectObj.options[selectObj.selectedIndex].value
    
        if(selectedIndex == "0"){
            sortirani = x
        }
        else{
            sortirani = x.sort(function(a, b){
                if(selectedIndex == "1"){
                    if(a.name < b.name){
                        return -1
                    }
                    else if(a.name > b.name){
                        return 1
                    }
                    else{
                        return 0
                    }
                }
                if(selectedIndex == "2"){
                    if(a.name > b.name){
                        return -1
                    }
                    else if(a.name < b.name){
                        return 1
                    }
                    else{
                        return 0
                    }
                }
                if(selectedIndex == "3"){
                    return b.price.current - a.price.current
                }
                if(selectedIndex == "4"){
                    return a.price.current - b.price.current
                }  
                if(selectedIndex == "5"){
                    return b.stars - a.stars
                }
                if(selectedIndex == "6"){
                    return a.stars - b.stars
                }
            })
        }
        return sortirani
    }
    //funkcija za ispis padajucih lista
    function print(x,y,z,tip){
        let ispis = ""
        if(tip=="brojac"){
            ispis += `<option value="0" hidden>Select ${z}</option>`;
            for(let element of x){
                ispis += `<option value="${element.id}">${element.name}</option>`
            }
        }
        else{
            ispis += `<option value="0" hidden>Select ${z}</option>`;
            for(let element of x){
                ispis += `<option value="${element.id}">${element.name}</option>`
            }
        }
        $(y).html(ispis);
    }
    //funkcija za ispis modela
    function printModel(x, id){
        let ispis = ""
        for(let e of x){
            ispis += `<input class="ml-2 chc" type="checkbox" value="${e.id}" name="${e.name}"/> ${e.name}<br/>`
        }
        $(id).html(ispis)
        $(".chc").change(change)
    }
    //funkcija za stampanje proizvoda
    function printProducts(x){
        let redObj = document.getElementById("baner");
        if(x.length==0){
            redObj.innerHTML = `<div class="row">
                                    <div class="col-12">
                                         <p class="alert alert-danger">
                                         There is currently no product for the selected category</p>
                                    </div>
                                </div>`
        }
        else{
        let ispis=`
                   <h3 class="title-wthree mb-lg-2 mb-2 text-center">Shop Now</h3>
                   <div class="row shop-wthree-info text-center">
                   `;
        let b=0
        for(let element of x){
            ispis += `<div class="col-lg-3 col-sm-6 shop-info-grid text-center mt-4 art" > 
                        <div class="col product-shoe-info shoe"><div class="aki">
                        <a class="link" href="single.html?id=${element.id}">
                            <div class="men-thumb-item blk">
                            ${badge(element.trendId)}
                                <img src="${element.image.src}" class="img-fluid" alt="${element.image.alt}">
                            </div>
                            <div class="item-info-product gore">
                                <div class="nas">
                                    <h4>
                                       ${element.name}
                                    </h4>
                                </div>

                                <div class="product_price">
                                    <div class="grid-price">
                                        ${getPrice(element.price)}
                                    </div>
                                </div>
                                <ul class="stars">
                                    ${countOfStars(element.stars)}
                                </ul>
                                <h6 class="mt-4">${isFreeShipping(element.price.current)}</h6>
                            </div>
                            </a>
                            </div>
                            <button class="add-to-cart-button" data-id="${element.id}">Add to cart</button>
                        </div>
                        
                        
                    </div>`
                    if(!(++b%4 && b!=0)) {ispis += `</div><div class="row shop-wthree-info text-center">`}
        }
            redObj.innerHTML=ispis+="</div>";
            $(".add-to-cart-button").click(addToCart);
            $(".add-to-cart-button").click(addToCartAnimation);
            $(".add-to-cart-button").click(showProducts);
        }}
   //funkcija za vracanje trendinga, sta je novo, poslednji model
   function badge(x){
        let ispis=""
        let proizvodi = getFromLocalStorage("sviProizvodi")
        for(let e of proizvodi){
            if(x==e.trendId){
                ispis = `<div class="new ${classFind(x)}">${nameFind(x)}</div>`
            }
        }
        //vracanje naziva
        function nameFind(x){
            let ispis=""
            for(let e of trendovi){
                if(x == e.id){
                    ispis=e.text
                }
            }
            return ispis
       }
       //vracanje klase
        function classFind(x){      
        let ispis =""
        for(let e of trendovi){
            if(x == e.id){
                ispis = e.class
            }
        }
        return ispis
        }
        return ispis
    } 
   //funkcija koja vraca cene
   function getPrice(x){
        let cena =""
        if(x.old!=null){
            cena+=`<span class="money"><span class="line">${x.old}&euro;</span>&nbsp;&nbsp;${x.current}&euro;</span><br/>
                   <span class="save">Save ${x.old-x.current}&euro;</span>`
        }
        else{
            cena+=`<span class="money">${x.current}&euro;</span>`
        }
        return cena
   }
   //funkcija koja prebrojava cele i polovicne zvezdice
   function countOfStars(x){
    let ispis=""
    for(let i=1 ; i<=5;i++){
        if(i<=x){
            ispis+=`<li><span class="fa fa-star" aria-hidden="true"></span></li>`
        }
        else if(i>x && parseInt(x)==i-1 && x%(i-1)!=0){
            ispis+=`<li><span class="fa fa-star-half-o" aria-hidden="true"></span></li>`
        }
        else{
            ispis+=`<li><span class="fa fa-star-o" aria-hidden="true"></span></li>`
        }     
    }
    return ispis
   }
   //funkcija za proveru da li je dostava besplatna
   function isFreeShipping(x){
        let ispis="";
            if(x>500){
                ispis = `Free shipping`
            }
        return ispis
   }
    //funkcija za ispis liste za sort
    function sortPrint(array, id){
        let ispis =""
        for(let i=0; i<array.length;i++){
            if(i==0){
                ispis+=`<option value="${i}" hidden>${array[i]}</option>`
            }
            else{
                ispis+=`<option value="${i}">${array[i]}</option>`
            }
        }
        $(id).html(ispis);
    }
    let nizSort = ["Select sort type","Sort by name A-Z","Sort by name Z-A","Sort by price - descending","Sort by price - ascending","Sort by rating - descending","Sort by rating - ascending"]
    sortPrint(nizSort,"#sor");
    let resetFilterObj = document.getElementById("reset")
    resetFilterObj.addEventListener("click", resetFilters)
    function resetFilters(){
        let proizvodi = getFromLocalStorage("sviProizvodi");
        let ddlObj = document.getElementsByClassName("ddl")
        for(let d of ddlObj){
            d.selectedIndex=0
        }
        let chcObj = document.getElementsByClassName("chc")
        for(let c of chcObj){
            c.checked=false
        }
        let rangeValue = document.getElementById("rangeValue"); 
        rangeValue.value = findMaxPrice(getFromLocalStorage("sviProizvodi"))
        var slider = document.getElementById("range"); 
        slider.value = slider.max;       
        printProducts(proizvodi)
    } 
}
if(url.indexOf("contact.html")!=-1 || url=="/contact.html"){
    window.onload=function(){
        ajaxCallBack(BASEURL+"cities.json","get",function(result){
            printCities(result,"#sel5");
        });
        let dugme = document.getElementById("dugme")
        dugme.addEventListener("click", obradaForme)
    }
    function printCities(x, id){
        let ispis=`<option value="0">Select your city</option>`
        for(let e of x){
            ispis+=`<option value="${e.id}">${e.name}</option>`
        }
        $(id).html(ispis)
    } 
    let greskaTA = false
    let objTA = document.getElementById("ta")
    let brojSlova = document.getElementById("slova").textContent
    let brojObj = document.getElementById("slova")
    let broj = Number(brojSlova)
    let konacno = 0
    let brojac = 20  
    objTA.addEventListener("keydown", function(){    
        let taValue = document.getElementById("ta").value.length
        let taNum = Number(taValue)
        if(taNum==0){taNum+=1}
        konacno = brojac - (taNum)
        brojObj.innerHTML=konacno
        if(taValue>20){
            brojObj.innerHTML=0
            greskaTA = true
            objTA.parentElement.parentElement.classList.add("okvirTA")
        }
        else{
            objTA.parentElement.parentElement.classList.remove("okvirTA")
            greskaTA = false
        }
    })
    function obradaForme(){       
        //elementi forme koji se proveravaju
        let objImePrezime = document.getElementById("text1");
        let objMail = document.getElementById("text2");
        let objRadio = document.getElementsByName("rbtn");
        let objSelect = document.getElementById("sel5");
        let objTel = document.getElementById("text3");
        let objAdresa = document.getElementById("text5")
        //regularni izrazi za sve elemente forme
        let regIzrazImePrezime = /^[A-ZŠĐŽČĆ][a-zšđčćž]{2,19}(\s[A-ZŠĐŽČĆ][a-zšđčćž]{2,19}){1,3}$/;
        let regBrojTelefona = /^(\+381|0)(6[0-9])([0-9]{6,8})$/;                 
        let regAdresa = /^[A-Z][a-z]+(\s[A-Z][a-z]+)*(\s[a-z]+)*(\s\d+[A-Za-z]?)?$/;
        let greskaImePrez = false;
        let greskaBroj = false;
        let greskaRadio = false;
        let greskaSelect = false;
        let greskaMejl = false;
        let greskaAdresa = false;   
        function modalInformation(){
            buttonCloseModal2 = document.getElementById("closeModal2")
            buttonCloseModal2.addEventListener("click",function(){
                 modal.classList.remove("block");
            });
            let modal = document.getElementById("modalKontakt")
            modal.classList.add("block")
        }
        if(getFromLocalStorage("cart")==null){
            $("#ispis").html("Your cart is empty, you must make a purchase first to order a product")
            modalInformation()
        }else{
            //provera imena i prezimena
            if(!regIzrazImePrezime.test(objImePrezime.value)){
                objImePrezime.nextElementSibling.classList.add("display-block");
                objImePrezime.nextElementSibling.innerHTML = "The first and last name must start with a capital letter and contain at least three characters, example:<br/>Aleksandar Kandic";
                objImePrezime.classList.add("okvir-greska");
                greskaImePrez=true;
            }
            else{
                objImePrezime.nextElementSibling.classList.remove("display-block");
                objImePrezime.nextElementSibling.innerHTML = "";
                objImePrezime.classList.remove("okvir-greska");
                greskaImePrez=false;
            }
            //provera broja telefona
            if(!regBrojTelefona.test(objTel.value)){
                objTel.nextElementSibling.classList.add("display-block");
                objTel.nextElementSibling.innerHTML = "The phone number must be in the format::<br/> +381658255131 or 0658255131";
                objTel.classList.add("okvir-greska");
                greskaBroj=true;
            }
            else{
                objTel.nextElementSibling.classList.remove("display-block");
                objTel.nextElementSibling.innerHTML = "";
                objTel.classList.remove("okvir-greska");
                greskaBroj=false;
            }
            //prevera adrese
            if(!regAdresa.test(objAdresa.value)){
                objAdresa.nextElementSibling.classList.add("display-block");
                objAdresa.nextElementSibling.innerHTML = "The address must be in the format:<br/>Oxford Street 32B";
                objAdresa.classList.add("okvir-greska");
                greskaAdresa=true;
            }
            else{
                objAdresa.nextElementSibling.classList.remove("display-block");
                objAdresa.nextElementSibling.innerHTML = "";
                objAdresa.classList.remove("okvir-greska");
                greskaAdresa=false;
            }
            //provera mejla
            if(!regMail.test(objMail.value)){
                objMail.nextElementSibling.classList.add("display-block");
                objMail.nextElementSibling.innerHTML = "Email must be in the format: user@gmail.com";
                objMail.classList.add("okvir-greska");
                greskaMejl=true;
            }
            else{
                objMail.nextElementSibling.classList.remove("display-block");
                objMail.nextElementSibling.innerHTML = "";
                objMail.classList.remove("okvir-greska");
                greskaMejl=false;
            }
            //radio kupljenje vrednosti
            let radioValue = "";
            for(let i=0;i<objRadio.length;i++){
                if(objRadio[i].checked){
                    radioValue = objRadio[i].val;
                    break;
                }
            }
            //provera radio buttona
            if(radioValue == ""){
                objRadio[0].parentElement.nextElementSibling.classList.add("display-block");
                objRadio[0].parentElement.classList.add("okvir");
                objRadio[0].parentElement.nextElementSibling.innerHTML = "Select a status"
                greskaRadio = true;
            }
            else{
                objRadio[0].parentElement.nextElementSibling.classList.remove("display-block");
                objRadio[0].parentElement.nextElementSibling.innerHTML = "";
                objRadio[0].parentElement.classList.remove("okvir");
                greskaRadio=false;
            }
            //provera select liste
            let selectListaValue = objSelect.options[objSelect.selectedIndex].value;
            if(selectListaValue==0){
                objSelect.classList.add("okvir");
                greskaSelect = true;
            }
            else{
                objSelect.classList.remove("okvir");
                greskaSelect = false;
            }
            if(!greskaImePrez && !greskaBroj && !greskaMejl && !greskaSelect && !greskaRadio && !greskaTA && !greskaAdresa && getFromLocalStorage("cart").length){
                let brojSlova = document.getElementById("slova")
                brojSlova.innerHTML=20
                document.getElementById("forma").reset();
                let modal = document.getElementById("modalKontakt")
                modal.classList.add("block")
                $("#ispis").html("You have successfully ordered the product, you will receive an email when the order is forwarded to the courier service")
                modalInformation()
                localStorage.removeItem("cart")
                $("#broj").html("0")
            }
        }
}}
if(url.indexOf("author.html")!=-1 || url=="/author.html"){
    console.log("aa")
    window.onload = function(){
        let listaObj = document.getElementById("mrz")
        let nizMreza = ["instagram mreze","facebook-box mreze ml-3","twitter-box mreze ml-3","linkedin mreze ml-3"]
        let ispis = ""
        for(let x of nizMreza){
            ispis+=`<li><a href="#"><i class="zmdi zmdi-${x}"></i></a></li>`
        }
        listaObj.innerHTML=ispis
    } 
}
let regMail = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
let mailobj = document.getElementById("email");

let buttonCloseModal3 = document.getElementById("closeModal3");
let modalCart2 = document.getElementById("modalMail");
let upis = document.getElementById("suc")
buttonCloseModal3.addEventListener("click",function(){
    modalCart2.classList.remove("block");
    $("#suc").removeClass("err");
});
$("#su").click(function(){
    if(regMail.test(mailobj.value)){
        modalCart2.classList.add("block")
        upis.innerHTML="You have successfully logged in"
        
    }
    else{
        $("#suc").addClass("err");
        modalCart2.classList.add("block")
        upis.innerHTML="You made a mistake when entering your email address, the address must be in the following format: user@gmail.com"
    }
})
function cartEmpty(){
    return modalContent.innerHTML = `<p id="em">Your cart is empty</p>`
}
function showProducts(){
    let products = getFromLocalStorage("cart");
    let modalContent = document.getElementById("modalContent")
    if(products==null){
        $("#total").html("0 &euro;")
        return cartEmpty()      
    }
    else{
        ispis=""
        let allProduct = getFromLocalStorage("sviProizvodi")
        let filtrirani=[]
        for(let pa of allProduct){
            for(let pc of products){
                if(pa.id ==pc.id){
                    filtrirani.push(pa)
                }
            }
        }
        function quantity(id){
            for(let p of products){
                if(p.id == id){
                    return p.quantity
                }
            }
        }
        let suma=0
        for(p of filtrirani){
            ispis+=`<div class="kup">
                        <div class="cartSlika">
                            <img src="${p.image.src}"/>
                        </div>
                        <p class="naziv">${p.name}</p>
                        <div class="cene">
                            <p>
                                Price per piece: ${p.price.current} &euro;
                            </p><br/>
                            <p>
                                Total price for quantity: ${p.price.current * quantity(p.id)} &euro;
                            </p>
                        </div>

                        <div class="brojac">
                            <button class="minus kol" data-id="${p.id}">-</button>
                            <div class="broj">${quantity(p.id)}</div>
                            <button class="pluss kol" data-id="${p.id}">+</button>
                        </div>

                        <button class="obrisi" data-id="${p.id}">
                            Remove item from cart
                        </button>
                       
                    </div>`
                    suma +=p.price.current * quantity(p.id)
                    $("#total").html(suma+" &euro;")
                    
                    enableCheckout()
        }
        function enableCheckout(){
            if(getFromLocalStorage("cart").length>0){
                $("#preusmeri").attr("href", "contact.html")
            }
            if(getFromLocalStorage("cart")==0){
                $("#preusmeri").attr("href", "shop.html")
            }
        }      
        modalContent.innerHTML = ispis     
        let buttonsObrisi = document.getElementsByClassName('obrisi');
        let obrisi = Array.from(buttonsObrisi)
        obrisi.forEach(function(button) {
        button.addEventListener('click', removeItemFromCart);
        });
        let buttonsPlus = document.getElementsByClassName('pluss');
        let niz1 = Array.from(buttonsPlus)
        niz1.forEach(function(button) {
        button.addEventListener('click', plus);
        });
        let buttonsMinus = document.getElementsByClassName('minus');
        let niz2 = Array.from(buttonsMinus)
        niz2.forEach(function(button) {
        button.addEventListener('click', minus);
        });   
    }
    function removeItemFromCart(){
        let id = $(this).data("id")
        let svi = getFromLocalStorage("cart")
        let fil = svi.filter(x=> x.id != id)
        saveToLocalStorage("cart",fil)
        $("#broj").html(fil.length)
        if(fil.length==0){
            $("#total").html("0 &euro;")
            localStorage.removeItem("cart")
            return cartEmpty()
        }
         showProducts()
    }
    function plus(){
        let id = $(this).data("id")
        let svi = getFromLocalStorage("cart")
        let fil = svi.filter(x=>x.id == id)
        fil[0] = {
            id:id,
            quantity: fil[0].quantity++
        }
        saveToLocalStorage("cart", svi)
         showProducts()
    }
    function minus(){
        let id = $(this).data("id")
        let svi = getFromLocalStorage("cart")
        let fil = svi.filter(x=>x.id == id)         
        if(fil[0].quantity>1){
            fil[0] = {
                id:id,
                quantity: fil[0].quantity--
            }
        }
        if(fil[0].quantity<2){
            let fil2 = svi.filter(x=>x.id != id)
            saveToLocalStorage("cart", fil2)
             showProducts()
            if(fil2.length==0){
                $("#total").html("0 &euro;")
                localStorage.removeItem("cart")
                cartEmpty()
            }
            $("#broj").html(fil2.length)
        }
        else{
            saveToLocalStorage("cart", svi)
             showProducts()
        }       
    }
}
$("#obrisi").click(function(){
    localStorage.removeItem("cart")
     showProducts()
    $("#total").html("0 &euro;")
    $("#broj").html("0")
})
function addToCart(){
    let prouctId = $(this).data("id");
    let cart = getFromLocalStorage("cart");

    if(cart == null){
        firstItem();
        numberOfProducts();
    }
    else{
        if(productIsInCart()){
            update();
        }
        else{
            addItemToCart();
            numberOfProducts();
        }
    }
    function firstItem(){
        let products = [
            {
                id: prouctId,
                quantity: 1
            }
        ];

        saveToLocalStorage("cart", products);
    }
    function productIsInCart(){
        return cart.filter(el => el.id == prouctId).length;
    }
    function update(){
        let productsLS = getFromLocalStorage("cart");

        for(let p of productsLS){
            if(p.id == prouctId){
                p.quantity++;
                break;
            }
        }
        saveToLocalStorage("cart", productsLS);
    }
    function addItemToCart(){
        let productLS = getFromLocalStorage("cart");
        productLS.push({
            id: prouctId,
            quantity: 1
        });
        saveToLocalStorage("cart", productLS);
    }
}
function numberOfProducts(){
    let productsCart = getFromLocalStorage("cart");
    console.log(productsCart)
    if(productsCart == null){
        $("#broj").html(`0`);
    }
    else{
        let numberOfProducts = productsCart.length;
        $("#broj").html(`${numberOfProducts}`)
        console.log(numberOfProducts)
    }
}
var dodato = document.getElementById("dodato");
function addToCartAnimation(){
    let id = $(this).data("id")
    let cart = getFromLocalStorage("cart")

    postoji = cart.filter(x=>x.id==id)
    console.log(postoji)

    if(postoji[0].quantity==1){
       dodato.classList.add("block"); 
       dodato.innerHTML = ("The product has been added to the cart")
    }
    else{
        dodato.innerHTML = (`The quantity has been increased to ${postoji[0].quantity} pieces`)
        dodato.classList.add("block"); 
    }
    
    setTimeout(function() {
        dodato.classList.remove("block");
    }, 2000);
}
let buttonCloseModalError = document.getElementById("closeModal4");
let modalError = document.getElementById("modalError");
buttonCloseModalError.addEventListener("click", function(){
    modalError.classList.remove("block")
})
setTimeout(function() {
    var loader = document.querySelector('.preloader');
    loader.style.display = 'none';
  }, 1000);