from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('view-books/', views.view_books, name='view_books'),
    path('borrowed-books/', views.borrowed_books_list, name='borrowed_books_list'),
    path('books/<int:book_id>/borrow/', views.borrow_book, name='borrow_book'),
    path('books/<int:book_id>/return/', views.return_book, name='return_book'),
    path('add-new-book/', views.add_new_book, name='add_new_book'),
    path('view-books/view-book-details-user/', views.view_book_details_user, name='view_book_details_user'),
    path('view-book-details-admin/', views.view_book_details_admin, name='view_book_details_admin'),
    path('edit-book/', views.edit_book, name='edit_book'),
    path('view-book-details-admin/delete-book/<int:book_id>/', views.deleteBook, name='delete-book'),
    
  
]
