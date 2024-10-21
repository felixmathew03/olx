const url=window.location.href;
const urlParams=new URLSearchParams(url.split("?")[1]);
const id=urlParams.get("id");
async function getSBookings() {
    const res=await fetch(`http://localhost:3000/api/getsbookings/${id}`);
    bookings=await res.json();
    str=``;
    bookings.map((booking)=>{
        console.log(booking);
        
        fetch(`http://localhost:3000/api/getbuyer/${booking.buyerId}`).then(async(res1)=>{
            const user=await res1.json();
            console.log(user);
            str+=`
            <div class="container">
            <h1>${booking.product.pname}</h1>
            <p class="buyer-name">Buyer: ${user.username}</p>
            <div class="button-container">
            <button class="button">Sold Out</button>
            </div>
            </div>`
        })
        console.log(str);
    })
    
    document.getElementById("bookings").innerHTML=str;
}
getSBookings();