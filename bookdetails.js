document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".view-details-btn").forEach(button => {
      button.addEventListener("click", function () {
        const bookItem = this.closest(".book-item");
        const bookId = bookItem.dataset.bookId;
  
        // Example fetch (replace with your actual API if available)
        fetch(`../api/books/${bookId}`)  // Adjust this path as needed
          .then(response => {
            if (!response.ok) throw new Error("Book not found");
            return response.json();
          })
          .then(data => {
            alert(`📚 Title: ${data.title}\n✍️ Author: ${data.author}\n📖 Description: ${data.description}`);
          })
          .catch(error => {
            alert("Error loading book details.");
            console.error(error);
          });
      });
    });
  });
  