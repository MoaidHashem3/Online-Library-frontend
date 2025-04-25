
window.onload = LoadBookData;

const bookId = document.getElementById("BookId");
const bookTitle = document.getElementById("BookTitle");
const bookCategory = document.getElementById("BookCategory");
const bookAuthor = document.getElementById("BookAuthor");
const bookDescription = document.getElementById("BookDescription");




function LoadBookData(){
    const params = new URLSearchParams(window.location.search);
    const bookId_fromParam = params.get("id"); // should make a api call that fetches book old data

    // const BookDetails = await GetBookDetails(id);
    
    let BookDetails = {
        "id" : "BookId",
        "title" : "BookTitle",
        "author" : "BookAuthor",
        "description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "category" : "Book Category"
    }

    bookId.textContent = BookDetails.id;
    bookTitle.textContent = BookDetails.title;
    bookCategory.textContent = BookDetails.author;
    bookDescription.textContent = BookDetails.description;
    bookCategory.textContent = BookDetails.category;
}



async function GetBookDetails(id){
    let request = new Request(`url/${id}`,{
        method : 'Get',
        headers:{
            'Content-Type': 'application/json'
        }
    });

    let response = await fetch(request);

    return await response.json();
}