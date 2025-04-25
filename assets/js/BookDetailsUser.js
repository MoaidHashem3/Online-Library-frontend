


// will do huge refactor to this when make backend
// so we can decide if the book is available, already borrowed by the user, can borrow
const bookId_param = new URLSearchParams(window.location.search).get("id");
const currentUser = localStorage.getItem("currentUser");

const BorrowBtn = document.getElementById("BorrowButton");





BorrowBtn.onclick = async () => {
    // await MakeBorrowCall();
    
    
}

async function MakeBorrowCall(){
    let request = new Request('url',{
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json'
        },
        body:{
            'currentUser' : currentUser,
            'BookId' : bookId_param
        }
    });
    
    let response = await fetch(request);
    
    return await response.json();
}