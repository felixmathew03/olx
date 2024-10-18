const url=window.location.href;
const urlParams=new URLSearchParams(url.split("?")[1]);
const id=urlParams.get("id");
const value = localStorage.getItem("Auth");
let product;
images=[];
async function getProduct() {
    const res=await fetch(`http://localhost:3000/api/getproduct/${id}`);
    product=await res.json();
    const res2=await fetch(`http://localhost:3000/api/getuser/${product.sellerId}`);
    const seller=await res2.json();
    images=product.images;
    document.getElementById("pname").innerText=product.pname;
    document.getElementById("category").innerText=product.category.toUpperCase();
    document.getElementById("price").textContent=`₹${product.price}/-`;
    document.getElementById("image").src=product.images[0];
    let i=0;
    product.images.map((image)=>{
        const data=document.createElement("img");
        data.src=image;
        data.setAttribute("onmouseover", `change("${image}")`);
        document.getElementById("prodimg").appendChild(data);
        i++;
    })
    document.getElementById("description").innerText=product.description;
    document.getElementById("sellerName").innerText=seller.username.toUpperCase();
    document.getElementById("phone").textContent=seller.phone;
    document.getElementById("place").textContent=seller.place;
    document.getElementById("address").textContent=seller.address;
    document.getElementById("pincode").textContent=seller.pincode;

}
getProduct();
function change(a) {
    document.getElementById("image").src=a;
}
async function book() {
        fetch("http://localhost:3000/api/setBooking",{
            method:"POST",
            headers:{"Content-Type":"application/json","Authorization" : `Bearer ${value}`},
            body:JSON.stringify({product})
        }).then(async (res)=>{
            const result= await res.json();
            if(res.status==201){
                alert(result.msg)
            }
            else if (res.status==403){
                alert(result.msg)
            }
            else{
                alert(result.msg)
            }
            
        }).catch((error)=>{
            console.log(error);
            
        });
}