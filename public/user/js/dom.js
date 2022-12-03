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