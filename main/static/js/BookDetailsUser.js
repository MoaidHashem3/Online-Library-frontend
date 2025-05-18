const currBookId = new URLSearchParams(window.location.search).get("id");
const userId = localStorage.getItem("userId");
const BorrowBtn = document.getElementById("BorrowButton");

async function checkBookStatus() {
    if (!userId) {
        BorrowBtn.innerHTML = `
            <i class="fas fa-sign-in-alt button-icon" style="color: white;"></i>
            Login to Borrow
        `;
        BorrowBtn.classList.add('login-required');
        BorrowBtn.onclick = () => window.location.href = '/login/';
        return;
    }

    try {
        const response = await fetch(`/CheckBookBorrowStatus/${currBookId}`, {
            method: 'GET',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });
        const data = await response.json();
        
        if (data.success && data.isBorrowed) {
            BorrowBtn.innerHTML = `
                <i class="fas fa-book button-icon" style="color: white;"></i>
                Borrow
            `;
            BorrowBtn.disabled = false;
            BorrowBtn.classList.remove('unavailable');
        } else {
            BorrowBtn.innerHTML = `
                <i class="fas fa-ban button-icon" style="color: white;"></i>
                Unavailable
            `;
            BorrowBtn.disabled = true;
            BorrowBtn.classList.add('unavailable');
        }
    } catch (error) {
        console.error('Error checking book status:', error);
    }
}

BorrowBtn.onclick = async () => {
    try {
        const response = await MakeBorrowCall();
        if (response.success) {
            const bookTitle = document.getElementById('BookTitle').textContent;
            
            const notificationWrapper = document.createElement('div');
            notificationWrapper.className = 'notification-wrapper';
            notificationWrapper.style.position = 'fixed';
            notificationWrapper.style.top = '10px';
            notificationWrapper.style.left = '50%'; 
            notificationWrapper.style.transform = 'translateX(-50%)';
            notificationWrapper.style.zIndex = '9999';
            
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = `Successfully borrowed "${bookTitle}"`;
            successMsg.style.backgroundColor = '#00CF76';
            successMsg.style.color = 'white';
            successMsg.style.padding = '1rem 2rem';
            successMsg.style.borderRadius = '8px';
            successMsg.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            successMsg.style.animation = 'slideIn 0.3s ease-out';
            
            notificationWrapper.appendChild(successMsg);
            document.body.appendChild(notificationWrapper);
            
            BorrowBtn.innerHTML = `<i class="fas fa-ban button-icon"></i> Unavailable`;
            BorrowBtn.disabled = true;
            BorrowBtn.classList.add('unavailable');
            
            setTimeout(() => notificationWrapper.remove(), 2500);
        } else {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'success-message';
            errorMsg.style.backgroundColor = '#ff4444';
            errorMsg.textContent = 'Failed to borrow book: ' + (response.error || 'Unknown error');
            document.body.appendChild(errorMsg);
            setTimeout(() => errorMsg.remove(), 2500);
        }
    } catch (error) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'success-message';
        errorMsg.style.backgroundColor = '#ff4444';
        errorMsg.textContent = 'Error borrowing book. Please try again.';
        document.body.appendChild(errorMsg);
        setTimeout(() => errorMsg.remove(), 2500);
        console.error('Borrow error:', error);
    }
};

async function MakeBorrowCall() {
    const request = new Request(`/borrow-book/${currBookId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            'Content-Type': 'application/json'
        }
    });

    try {
        const response = await fetch(request);

        try {
            return await response.json();
        } catch (jsonErr) {
            const text = await response.text();
            console.error('Failed to parse JSON:', text);
            return { success: false, error: 'Invalid JSON response from server' };
        }
    } catch (fetchErr) {
        console.error('Fetch error:', fetchErr);
        throw fetchErr;
    }
}

document.addEventListener('DOMContentLoaded', checkBookStatus);
//window.onload = LoadUserBorrowedBooks;