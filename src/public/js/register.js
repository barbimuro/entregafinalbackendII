/*registerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = new FormData(registerForm);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    
    try {
        const response = await fetch('/api/sessions/register', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            const result = await response.json();
            console.error('Registration failed:', result.error);
       
        }
    } catch (error) {
        console.error('Error during registration:', error);
    
    }
});*/
const registerForm = document.getElementById('registerForm');


registerForm.addEventListener('submit',evt=>{
    evt.preventDefault();
    const data = new FormData(registerForm);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/sessions/register',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    })
})