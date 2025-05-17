async function getBookDetails(bookId) {
    // will replace fot backend call in phase 3
     fetch('/view-book-details-user/'),{
         method: 'POST',
         headers: {
             'content-Type': 'application/json'
         },
         body: JSON.stringify({bookId: bookId})
     }
        .then(response => {
            if (response.status !== 200){
                throw new Error("Book doesn't exist")
            }
            return response.json();
        })
        .then(data => {
            console.log("Book details: ", data);
            document.getElementById("BookTitle").innerText = data.title;
            document.getElementById("BookCategory").innerText = data.category;
            document.getElementById("BookAuthor").innerText = data.author;
            document.getElementById("BookDescription").innerText = data.description;
            document.getElementById("image").innerText = data.imageUrl;
        })
         .catch(error => console.error('Error in retrieving book: ', error));
    
}

function updatePageContent(book) {
    if (!book) {
        console.error('Book not found');
        return;
    }

    document.querySelector('.text').textContent = book.title;
    document.querySelector('.book-description').textContent = book.description;
    document.querySelectorAll('.body-text').forEach(element => {
        if (element.previousElementSibling?.alt === 'Book ID') {
            element.textContent = book.id;
        } else if (element.previousElementSibling?.alt === 'Author') {
            element.textContent = book.author;
        } else if (element.previousElementSibling?.alt === 'Category') {
            element.textContent = book.category;
        }
    });
    
    document.querySelector('.right-image img').src = book.imageUrl;
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    
    if (bookId) {
        const book = await getBookDetails(bookId);
        updatePageContent(book);
    }

});
