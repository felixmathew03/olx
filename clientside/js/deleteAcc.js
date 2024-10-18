function moveToNext(current, nextId) {
    if (current.value.length >= 1) {
        document.getElementById(nextId).focus();
    }
}

async function submitOTP() {
    let otp = '';
    for (let i = 1; i <= 6; i++) {
        otp += document.getElementById('input' + i).value;
    }

    const errorMessage = document.getElementById('error-message');
    if (otp.length === 6 && /^\d+$/.test(otp)) {
        errorMessage.textContent = '';
        // You can add your form submission logic here
    } else {
        errorMessage.textContent = 'Please enter a valid 6-digit OTP.';
    }
    const _id=localStorage.getItem("id");
    fetch(`http://localhost:3000/api/accountotp`,{
        method:"DELETE",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({_id,otp})
      }).then(async(res)=>{
            const result=await res.json();
            if(res.status==201){
                localStorage.removeItem("Auth");
                localStorage.removeItem("id");
                alert(result.msg);
                window.location.href="../index.html";
            }else{
                alert("error");
            }
        }). catch ((error)=>{
            console.log(error);
            
        })
}