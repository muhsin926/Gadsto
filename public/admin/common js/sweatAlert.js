

  
      //DELETE PRODUCT
  function deleteProduct (id){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const form = document.createElement('form');
        form.method = "delete";
        form.action = `/admin/product-manage?proId=${id}`;
        document.body.appendChild(form);
        form.submit();
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

     // DELETE BANNER
  