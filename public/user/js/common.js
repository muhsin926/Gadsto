function showAddressForm(){
    const form = document.getElementById('addressForm')
    
    if (form.style.display === 'none'){
        form.style.display = 'block'
    }else{
        form.style.display = 'none'
    }

}

function showAllAddress(){
    const form = document.getElementById('allAddress')
    
    if (form.style.display === 'none'){
        form.style.display = 'block'
    }else{
        form.style.display = 'none'
    }
}

// LANDING PAGE WISHLIST MANAGE
function addWish(proId,proName){
    axios.patch(`/?proId=${proId}`)
    .then(e =>{
        Swal.fire(proName, "is added to wishlist", "success");
    })
}

function deleteWish(productId,proName){
        Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!",
            }).then((result) => {
              if (result.isConfirmed) {
                axios.delete(`/wishlist?productId=${productId}`)
                  .then((result) => {
                    if (result.data) {
                      Swal.fire(
                        "Deleted!",
                        "Your wishlist has been deleted.",
                        "success"
                      );
                      location.reload()
                    } else {
                      alert("something went wrong");
                    }
                  });
              }
            });

}

// ORDER VIEW 
function cancel(proId,orderId){
  alert('dfasd')
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, cancel it!",
  }).then((result) => {
    if (result.isConfirmed) {
      axios.patch(`order-view?proId=${proId}&orderId=${orderId}`)
        .then((result) => {
          if (result.data) {
            Swal.fire(
              "Deleted!",
              "Your wishlist has been deleted.",
              "success"
            );
            location.reload()
          } else {
            alert("something went wrong");
          }
        });
    }
  });
}

// ADDRESS
function deleteAddress(id){

  Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then((result) => {
            if (result.isConfirmed) {
              axios.delete(`/address-manage?address = ${id}`)
                .then((result) => {
                  if (result.data) {
                    Swal.fire(
                      "Deleted!",
                      "Your file has been deleted.",
                      "success"
                    );
                    location.reload()
                  } else {
                    alert("something went wrong");
                  }
                });
            }
          });
}

function submitForm() {
  const change = document.querySelector('#changeAddress').submit()
  axios.patch('/checkout')
    .then(() => {
      location.reload()
    })
}

// COUPON VERIFICATION
function getcoupon(cartTotal, cartId) {
  const code = document.querySelector("#codeInput").value;
  axios
    .post("/check-coupen", { code, cartTotal, cartId })
    .then((response) => {
      if (response.data.apply) {
        Swal.fire("Success", "applyed coupen offer!", "success");
        location.reload();
      } else if (response.data.exist) {
        Swal.fire({
          icon: "error",
          title: "Already applied",
          text: "only one offer can be applied!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid",
          text: "coupen code is wrong !",
        });
      }

      const codeInput = document.querySelector("#discountInput");
      codeInput.value = response.data;
    });
}

// CHECKOUT AND PAYMENT
function placeOrder(indexof) {
  let index = indexof;
  let paymentMethod = document.querySelector("#cod").checked
    ? "COD"
    : "Razorpay";

  axios.get(`/payment-verify?index=${index}&paymentMethod=${paymentMethod}`).then((response) => {
    if (response.data.payment) {
      alert("success cash on delivery");
      location.assign("/order-success");
    } else {
      razorpayPayment(response);
    }
  });
  function razorpayPayment(order) {
    console.log(order)
    var options = {
      key: "rzp_test_ot382G21y8f1J7",
      amount: order.data.amount,
      currency: "INR",
      name: "Gadsto",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.data.id,
      handler: function (response) {
        verifyPayment(response, order);
      },

      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    function verifyPayment(payment, order) {
      axios.post("/payment-verify", { payment, order, index }).then((response) => {
        location.assign("/order-success");
      });
    }
    var rzp1 = new Razorpay(options);
    rzp1.open();
  }
}

// PRODUCT VIEW
const addToCart = document.querySelector("#btn");
        addToCart.onclick = () => {
            axios.post("http://localhost:4000/product-view?proId=<%= product._id %>");
        };

// SHOPING CART
function changeQuantity(cartId, proId, count) {
  let qty = document.querySelector('#qty')
  axios.patch(`/shoping-cart?cartId=${cartId}&productId=${proId}&count=${count}`)
      .then(() => {
         location.reload()
      })
}

function deleteProduct(proId) {
  axios.delete(`/shoping-cart?productId=${proId}`)
      .then(() => {
          location.reload()
      })
}


//WISHLIST 
function addToCart(productId) {
  axios.post(`/wishlist?productId=${productId}`).then((proName) => {
    Swal.fire(proName.data, "is add to cart!", "success");
  });
}

function removeWish(productId, proName) {
  axios.delete(`/wishlist?porductId=${productId}`).then(() => {
    Swal.fire({
      icon: "success",
      title: proName,
      text: "is remove to wishList!",
      showConfirmButton: false,
      timer: 1900,
    });
    location.reload();
  });
}