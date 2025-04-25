import {TryParseData} from "./Utilities/Parser.js"


let oldBookData = {};
let oldImage;

const COLORS = {
    "Fail" : "#FC0005",
    "Success" : "#14D97D"
}

window.onload = LoadOldBookData;

const inputElements = document.
getElementsByClassName("EditBookForm_BookIdInput");
const resultMessage = document.getElementById("resultMessage");
const resultMessageText = document.getElementById("resultMessageText");

const saveButton = document.getElementById("EditBookForm_SaveButtonId");
const cancelButton = document.getElementsByClassName("EditBookForm_CancelButton").item(0);

const BookImage = document.getElementById("EditBookForm_bookImage");
const ChooseImageInput = document.getElementById("imageUpload");

saveButton.onclick = SaveBookNewData;


cancelButton.onclick = () => {
    for(let i = 0 ; i < inputElements.length ; i++){
        if (!inputElements[i] || typeof inputElements[i].value() !== "string")
            continue;
        inputElements[i].value = "";
    }
    
    BookImage.src = oldImage;
}

ChooseImageInput.onchange = () => {
    const file = ChooseImageInput.files[0];
    
    if (!file) return;

    BookImage.src = URL.createObjectURL(file);
}

 async function SaveBookNewData(event) {
    event.preventDefault();
    let result = TryParseData(inputElements);
    if (result === undefined) {
        console.log("Can't Pares Data check inputs");
        resultMessage.style.backgroundColor = COLORS["Fail"];
        resultMessageText.textContent = "Fail :(";
    }
    else{
        resultMessage.style.backgroundColor = COLORS["Success"];
        resultMessageText.textContent = "Success !";
    }

     resultMessage.style.top = "100px";
    
    setTimeout(() => {
        resultMessage.style.top = "-100px";
    },5000);

    // the function that will make the backend call will take the book image and new details and maybe book id
    // will un comment the following code when we make the backend 
    /*
    saveButton.disabled = true; // to prevent spamming api calls
    const response = await MakeUpdateBookCall(result);
    saveButton.disabled = false;
    
    if (response === undefined)
        console.log("couldn't fetch") // will make a animation or a window that appear tells the user now
    else
        console.log(response)
*/
}

function LoadOldBookData(){
    /* const params = new URLSearchParams(window.location.search);*/
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id"); // should make a api call that fetches book old data
    
    // const params = await GetOldBookData(id);
    
     oldImage = BookImage.src;
     
     const oldValues = {
         "id" : "",
         "title" : "",
         "author" : "",
         "description" : "",
         "category" : ""
     };
     
    for (let key in oldValues){
        let value = params.get(key);
        if (!value || typeof value !== "string")
            oldValues[key] = "Not Found";
        else
            oldValues[key] = value;
    }
    
    
    for (let i in oldValues){
        for (let j in inputElements){
            if (!inputElements[j] || typeof inputElements[j].id !== 'string') continue;
            let S = inputElements[j].id.toLowerCase();
            if (S.includes(i)){
                inputElements[j].placeholder = oldValues[i];
            }
        }
    }  
    
     oldBookData = oldValues;
}




// should take the old book id so we can do the backend call on it later 
async function MakeUpdateBookCall(Book){
    try{
        let request = new Request('url',{
            method : 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Book)
        });
        
        const response = await fetch(request);
        
        if (!response.ok) throw new Error("Can't make update request ");

        return await response.json();
    }
    catch(e){
        console.log(`Error ${e}`)
    }
    
    return undefined;
}

async function GetOldBookData(id){
    let request = new Request(`url/${id}`,{
        method : 'Get',
        headers:{
            'Content-Type': 'application/json'
        }
    });
    
    let response = await fetch(request);

    return await response.json();
}
