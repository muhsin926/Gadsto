function showAddressForm(){
    const form = document.getElementById('addressForm')
    
    if (form.style.display === 'none'){
        form.style.display = 'block'
    }else{
        form.style.display = 'none'
    }
}