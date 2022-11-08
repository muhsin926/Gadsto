
    // DELETE CATEGORY
function deleteCategory (id){
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
        form.method = "post";
        form.action = `/admin/deleteCategory/${id}`;
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
        form.method = "post";
        form.action = `/admin/deleteProduct/${id}`;
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
  function deleteBanner (id){
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
        form.method = "post";
        form.action = `/admin/deleteBanner/${id}`;
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