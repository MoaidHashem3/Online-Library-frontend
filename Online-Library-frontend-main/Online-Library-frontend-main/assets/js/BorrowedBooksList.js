

window.onload = LoadUserBorrowedBooks;


const CardsList = document.getElementsByClassName("BB_Card_List").item(0);

const MAX_CARDS_TO_DISPLAY = 4;
let NumberOfPossiblePages;
let ArrayOfCards;
let currentPageIndex = 0;

function LoadCardsWithPage(pageIndex){
    if (pageIndex >= NumberOfPossiblePages)
        throw new Error("Wrong Page Number");

    const allCards = CardsList.querySelectorAll(".BB_Card");
    allCards.forEach((E) => {
        E.remove();
    })
    
    for (let i = 0 ; i < MAX_CARDS_TO_DISPLAY ; i++){
        if (!ArrayOfCards[pageIndex][i])
            continue;
        CardsList.prepend(ArrayOfCards[pageIndex][i]);
    }
    
    currentPageIndex = pageIndex;
    updatePaginationButtons();
}

function updatePaginationButtons() {

    const paginationContainer = document.querySelector('.pagination-numbers');

    let paginationHTML = '';
    for (let i = 0; i < NumberOfPossiblePages; i++) {
        paginationHTML += `
            <div class="page-number ${i === currentPageIndex ? 'active' : ''}" 
                 onclick="LoadCardsWithPage(${i})">${i+1}</div>
        `;
    }
    paginationContainer.innerHTML = paginationHTML;
}

function GenerateDummyData(count) {
    const dummyData = [];
    for (let i = 1; i <= count; i++) {
        dummyData.push({
            id: i.toString(),
            name: `Book Title ${i}`,
            author: `Author ${i}`,
            category: `Category ${i % 5}`, // 5 categories for variety
            image: "../assets/img/testImage.jpeg"
        });
    }
    return dummyData;
}

async function LoadUserBorrowedBooks(){
    try {
        /*let userId = window.localStorage.getItem("UserId"); // or take it from the query string idk yet

        let request = new Request(`url/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let response = await fetch(request);
        
        let data = await response.json();
*/
        let data = GenerateDummyData(18);
        
        NumberOfPossiblePages = Math.ceil(data.length / MAX_CARDS_TO_DISPLAY);
        ArrayOfCards = new Array(NumberOfPossiblePages);
        
        // make array full of max pages (4 cards) except last one which might have less
        for (let i = 0 ; i < NumberOfPossiblePages - 1; i++){
            ArrayOfCards[i] = new Array(MAX_CARDS_TO_DISPLAY).fill(0);
        }
        
        let remaining = data.length % MAX_CARDS_TO_DISPLAY;
        if (remaining === 0) remaining = MAX_CARDS_TO_DISPLAY; 
        ArrayOfCards[NumberOfPossiblePages - 1] = new Array(remaining);
        
        let pagesCounter = 0;
        let cardCounter = 0;
        data.forEach((d) => {
            ArrayOfCards[pagesCounter][cardCounter] = CreateCard(d);
            cardCounter++;
            if (cardCounter >= MAX_CARDS_TO_DISPLAY){
                cardCounter = 0;
                pagesCounter++;
            }
        });

        console.log(ArrayOfCards);
        LoadCardsWithPage(0);
    }
    catch (error){
        console.log(`Error Occured ${error}`)
        console.log(`Error Stack ${error.stack}`)
    }
}

function CreateCard(bookDetails){
    let card = document.createElement("div");
    card.className = "BB_Card";
    card.onclick = () => {
        const queryString = `?id=${encodeURIComponent(bookDetails.id)}&name=${encodeURIComponent(bookDetails.name)}&author=${encodeURIComponent(bookDetails.author)}&category=${encodeURIComponent(bookDetails.category)}&image=${encodeURIComponent(bookDetails.image)}`;
        window.location.href = `ViewBookDetailsAdmin.html${queryString}`;
    }
    
    let cardDetails = document.createElement("div");
    cardDetails.className = "BB_CardDetails";

    let title = document.createElement("div");
    title.className = "BB_BookTitle";
    title.id = "Title";
    title.textContent = bookDetails["name"];

    let author = document.createElement("div");
    author.id = "Author";
    author.textContent = bookDetails["author"];

    let category = document.createElement("div");
    category.id = "Category";
    category.textContent = bookDetails["category"];

    let bookId = document.createElement("div");
    bookId.id = "BookId";
    bookId.textContent = bookDetails["id"];

    cardDetails.appendChild(title);
    cardDetails.appendChild(author);
    cardDetails.appendChild(category);
    cardDetails.appendChild(bookId);
    
    let bookImage = document.createElement("img");
    bookImage.className = "BB_Card_BookImage";
    bookImage.src = bookDetails["image"];

    card.appendChild(cardDetails);
    card.appendChild(bookImage);
    
    
    return card;
}