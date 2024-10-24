const url=window.location.href;
const urlParams=new URLSearchParams(url.split("?")[1]);
const id=urlParams.get("id");
async function getUser() {
    const res=await fetch(`http://localhost:3000/api/getuser/${id}`);
    const result=await res.json();
    console.log(result);
    
    if(result.user.profile)
        document.getElementById("profile").src=result.user.profile;
    document.getElementById("username").textContent=result.user.username;
    document.getElementById("email").textContent=result.user.email;
    document.getElementById("place").textContent=result.user.place;
    document.getElementById("address").textContent=result.user.address;
    document.getElementById("pincode").textContent=result.user.pincode;
    document.getElementById("phone").textContent=result.user.phone;
    document.getElementById("edit").innerHTML=`<a href="../pages/edit.html?id=${result.user._id}"><img src="../images/edit.png" alt=""></a>`;
    document.getElementById("bookings").innerHTML=`<a href="../pages/sellerbookings.html?id=${result.user._id}">BOOKINGS <span id=count>(${result.count})<span></a>`;
    document.getElementById("orders").innerHTML=`<a href="../pages/orders.html?id=${result.user._id}">MY ORDERS </a>`;
}
getUser();

async function getSProducts() {
    const res=await fetch(`http://localhost:3000/api/getsproducts/${id}`);
    const products=await res.json();
    str=``;
    console.log(products);
    products.map((product)=>{
        str+=`
            <div class="product">
                <a href="./products.html?id=${product._id}">
                    <img src="${product.images[0]}" alt="">
                    <h3>${product.pname.substring(0,18)}</h3>
                    <h1 >Rs. ${product.price}</h1>
                    <p>${product.category.toUpperCase()}</p>
                </a>
            </div>
        `
    })
    document.getElementById("products").innerHTML=str
}
getSProducts();
function logout() {
    localStorage.removeItem("Auth");
    window.location.href="../index.html"
}

async function deleteAccount() {
    const res=await fetch(`http://localhost:3000/api/deleteaccount/${id}`,{
        method:"POST",
        headers:{"Content-Type":"application/json"}
    });
    const result=await res.json();
    if(res.status==201){
        localStorage.setItem("id",`${result._id}`);
        window.location.href="../pages/deleteAcc.html";
    }else{
        alert(result.msg)
    }
}
document.getElementById("search").addEventListener('keyup',async(e)=>{
    try {
        const res=await fetch(`http://localhost:3000/api/getsproducts/${id}`);
        const products=await res.json();
        str=``;
        products.filter((i)=>i.pname.toLowerCase().includes(e.target.value.toLowerCase())).map((product)=>{
            str+=`
            <div class="product">
                <a href="./pages/product.html">
                    <img src="${product.images[0]}" alt="">
                    <h3>${product.pname}</h3>
                    <h1 >Rs. ${product.price}</h1>
                    <p>${product.description}</p>
                </a>
            </div>
        `
        })

        document.getElementById("products").innerHTML=str;
    } catch (error) {
        console.log(error);
    }
})

document.getElementById("filter").addEventListener('change',async(e)=>{
    try {
        const res=await fetch(`http://localhost:3000/api/getsproducts/${id}`);
        const products=await res.json();
        str=``;
        products.filter((i)=>i.category.toLowerCase().includes(e.target.value.toLowerCase())).map((product)=>{
            str+=`
            <div class="product">
                <a href="./pages/product.html">
                    <img src="${product.images[0]}" alt="">
                    <h3>${product.pname}</h3>
                    <h1 >Rs. ${product.price}</h1>
                    <p>${product.description}</p>
                </a>
            </div>
        `
        })
        document.getElementById("products").innerHTML=str;
    } catch (error) {
        console.log(error);
    }
})