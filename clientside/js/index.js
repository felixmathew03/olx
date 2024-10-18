const value = localStorage.getItem("Auth");
let profileImage;
let dropdownMenu;
let buyerId;
let result;
let bookings;
async function getProducts() {
    const res=await fetch("http://localhost:3000/api/getproducts",{headers:{
    "Authorization" : `Bearer ${value}`}})
    result=await res.json();
    str=``;
    if(res.status==200){
        buyerId=result.id;
        document.getElementById("navbar").innerHTML=`
        <img src="./images/OLX-Symbol.png" alt="olx">
        <div class="search">
            <input type="text" name="" id="filter" onkeyup="search(this)" placeholder="Find cars,mobile Phones and more...">
            <img src="./images/search_2.png" alt="">
        </div>
        <div  class="container">
            <img src="${result.profile}" alt="" id="profileImage" class="profile-image" onclick="popup()">
            <div class="dropdown" id="dropdownMenu">
                <img src="${result.profile}" alt="">
                <div class="dropdown-option" ><a href="./pages/profile.html?id=${result.id}"><button>View or Edit Profile</button></a></div>
                <div class="dropdown-option"><button onclick="logout()" id="hover">Logout</button></div>
            </div>
        </div>
        <button ><a href="./pages/addp.html?id=${result.id}">+ SELL</a></button>
        `
        profileImage= document.getElementById('profileImage');
        dropdownMenu = document.getElementById('dropdownMenu');
        result.products1.map((product)=>{
            str+=`
            <div class="product">
                <a href="./pages/product.html?id=${product._id}">
                    <img src="${product.images[0]}" alt="">
                    <h3>${product.pname.substring(0,16)}</h3>
                    <h1 >₹${product.price}</h1>
                    <p>${product.category.toUpperCase()}</p>
                    <p id="b${product._id}" class="booking"></p>
                </a>
                <img src="./images/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="" class="image" onclick="wish('${product._id}')" id="${product._id}">
            </div>
            `           
        })
        document.getElementById("products").innerHTML=str;  
        result.wlist.map((l)=>{
            document.getElementById(`${l.product._id}`).src="./images/favorite_24dp_EA3323_FILL1_wght400_GRAD0_opsz24.png"
        })
        const res1=await fetch(`http://localhost:3000/api/getubookings/${result.id}`);
        bookings=await res1.json();
        bookings.map((booking)=>{
            document.getElementById(`b${booking.product._id}`).innerText="BOOKED"
        })
    }
    else if(res.status==403){
        result.products.map((product)=>{
            str+=`
            <div class="product">
                <a href="./pages/product.html?id=${product._id}">
                    <img src="${product.images[0]}" alt="">
                    <h3>${product.pname.substring(0,16)}</h3>
                    <h1 >₹${product.price}</h1>
                    <p>${product.category.toUpperCase()}</p>
                </a>
            </div>
            `
        })
        document.getElementById("products").innerHTML=str;
        profileImage= document.getElementById('profileImage');
        dropdownMenu = document.getElementById('dropdownMenu');
    }
    else{
        console.log(result.msg);
    }
}
getProducts();

function logout() {
    localStorage.removeItem("Auth");
    window.location.href="./index.html"
}


function popup() {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
}

async function wish(e){
    a=document.getElementById(`${e}`).src==="http://localhost:3000/images/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.png"?"./images/favorite_24dp_EA3323_FILL1_wght400_GRAD0_opsz24.png":"./images/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.png"; 
    document.getElementById(`${e}`).src=a;
    if (a!="./images/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.png") {
        const res=await fetch(`http://localhost:3000/api/getproduct/${e}`);
        const product=await res.json();
        fetch("http://localhost:3000/api/addwish",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({buyerId,product})
        }).then((res)=>{
            if(res.status==201){
                alert("Added to wishlist")
            }
            else if (res.status==404){
                alert("error")
            }
            else{
                alert("error")
            }
            
        }).catch((error)=>{
            console.log(error);
            
        });
    }else{
        fetch(`http://localhost:3000/api/deletewlist/${e}`,{
            method:"DELETE",
            headers:{"Content-Type":"application/json"}
          }).then((res)=>{
                if(res.status==201){
                    alert("Removed from wishlist")
                }else{
                    alert("error");
                }
            }). catch ((error)=>{
                console.log(error);
                
            })
    }
}
// Close dropdown if clicked outside
window.addEventListener('click', (event) => {
    if (!profileImage.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = 'none';
    }
});

document.getElementById("filter").addEventListener('keyup',async(e)=>{
    try {
        str=``;
        result.products.filter((i)=>i.pname.toLowerCase().includes(e.target.value.toLowerCase())).map((product)=>{
            str+=`
            <div class="product">
                <a href="./pages/product.html?id=${product._id}">
                    <img src="${product.images[0]}" alt="">
                    <h3>${product.pname.substring(0,16)}</h3>
                    <h1 >₹${product.price}</h1>
                    <p>${product.category.toUpperCase()}</p>
                </a>
            </div>
        `
        })

        document.getElementById("products").innerHTML=str;
    } catch (error) {
        console.log(error);
    }
})
async function search(e) {
    try {
        str=``;
        result.products1.filter((i)=>i.pname.toLowerCase().includes(e.value.toLowerCase())).map((product)=>{
            str+=`
            <div class="product">
                <a href="./pages/product.html?id=${product._id}">
                    <img src="${product.images[0]}" alt="">
                    <h3>${product.pname.substring(0,16)}</h3>
                    <h1 >₹${product.price}</h1>
                    <p>${product.category.toUpperCase()}</p>
                    <p id="b${product._id}" class="booking"></p>
                    <img src="./images/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="" class="image" onclick="wish('${product._id}')" id="${product._id}">
                </a>
            </div>
        `
        })
        document.getElementById("products").innerHTML=str;
        result.products1.filter((i)=>i.pname.toLowerCase().includes(e.value.toLowerCase())).map((product)=>{
            result.wlist.map((l)=>{
                if(l.product._id==product._id)
                    document.getElementById(`${l.product._id}`).src="./images/favorite_24dp_EA3323_FILL1_wght400_GRAD0_opsz24.png"
            })
            bookings.map((booking)=>{
                if(booking.product._id==product._id)
                    document.getElementById(`b${booking.product._id}`).innerText="BOOKED"
            })
        });
    } catch (error) {
        console.log(error);
    }
}