const url=window.location.href;
const urlParams=new URLSearchParams(url.split("?")[1]);
const id=urlParams.get("id");
console.log(id);

async function getOrders() {
    const res=await fetch(`http://localhost:3000/api/getorders/${id}`);
    const orders=await res.json();
    str=``;
    orders.map((order)=>{
            str+=`
            <tr>
                    <td><img src="${order.product.images[0]}" alt="${order.product.pname}" class="product-image"></td>
                    <td>${order.product.pname}</td>
                    <td>${order.buyer.username}</td>
                    <td>${order.buyer.phone}</td>
                    <td>${order.product.category}</td>
                </tr>
            `
    })
    
    document.getElementById("tbody").innerHTML=str;
}
getOrders();