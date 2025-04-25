

const EditBookBtn = document.getElementById("EditBookButton");
const DeleteBookBtn = document.getElementById("DeleteBookButton");

const bookId_param = new URLSearchParams(window.location.search).get("id");

EditBookBtn.onclick = () =>{
    console.log("Clicked");
    window.location.href = `EditBook.html?id=${bookId_param}`;
}

DeleteBookBtn.onclick = async () =>{
    // await DeleteBook();
    // maybe make a book deleted message or idk
    window.location.href = "ViewBooks.html";
};


async function DeleteBook(){
    let request = new Request(`url/${bookId_param}`,
        {
            method: "Delete",
            headers:{
                'Content-Type': 'application/json'
            }
        });
    
    let response = await fetch(request);
    
    return await response.json();
}
