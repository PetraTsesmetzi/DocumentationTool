
const button=document.querySelector('#fadebutton');
button.addEventListener('click',function(){
    document.getElementsByClassName('errorMessage')[0].classList.add('show');
})