let nameInput = document.getElementById("name")
let emailInput = document.getElementById("email")
let message = document.getElementsByTagName("textarea")[0]
let form = document.getElementsByTagName("form")[0]

let nameError = document.getElementById("name-error")
let emailError = document.getElementById("email-error")
let messageError = document.getElementById("message-error")

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    // name validation
    if(nameInput.value.length < 3){
        nameError.innerText = "Name must contain atleast 3 characters";
    }
    else if(nameInput.value.length > 100){
        nameError.innerText = "Name is too long";
    }
    else if(nameInput.value.match("^[a-zA-Z ]*$") == null){
        nameError.innerText = "Name cannot contain special characters"
    }
    else{
        nameError.innerText = "";
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        emailError.innerText = "Please enter a valid email";
    } else {
        emailError.innerText = "";
    }

    // message validation
    if(message.value.length < 3){
        messageError.innerText = "Message must be atleast 3 characters long";
    }else if(message.value.length > 500){
        messageError.innerText = "Message length must be less than 500 characters";
    }else{
        messageError.innerText = ""
    }

    if(nameError.innerText === "" && emailError.innerText === "" && messageError.innerText === ""){
        alert('Form Submitted Successfully')
        form.reset();
    }
})