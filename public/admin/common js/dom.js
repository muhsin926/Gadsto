

function showNewBannerForm(){
    const form = document.getElementById('newBanner')
    
    if (form.style.display === 'none'){
        form.style.display = 'block'
    }else{
        form.style.display = 'none'
    }
}