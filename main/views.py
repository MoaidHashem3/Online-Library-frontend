import json

from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST

from .models import BorrowedBook
from backend import settings
from .forms import UserRegistrationForm, LoginForm, AddBookForm, EditBookForm
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import User, Book


def index(request):
    return render(request, 'main/index.html')


@ensure_csrf_cookie
def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm({
            'username': request.POST.get('username'),
            'email': request.POST.get('email'),
            'password': request.POST.get('password'),
            'is_admin': request.POST.get('is_admin') == 'true'
        })
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            return JsonResponse({'success': True})
        return JsonResponse({'errors': form.errors}, status=400)
    form = UserRegistrationForm()
    return render(request, 'main/register.html', {'form': form})


def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                auth_login(request, user)
                return JsonResponse({
                    'success': True,
                    'role': 'admin' if user.is_admin else 'user',
                    'userId': user.id,
                    'username': user.username
                })
            return JsonResponse({
                'success': False,
                'error': 'Invalid credentials'
            }, status=400)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'No account found with this email'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)

    form = LoginForm()
    return render(request, 'main/login.html', {'form': form})


def logout_view(request):
    logout(request)
    return JsonResponse({'success': True})


def view_books(request):
    return render(request, 'main/ViewBooks.html')


@login_required
def borrowed_books_list(request):
    borrowed_books = BorrowedBook.objects.filter(user=request.user).select_related('book')

    borrowed_books_Data = []

    for borrowed_book in borrowed_books:
        if borrowed_book.book.image:
            book_imageUrl = request.build_absolute_uri(borrowed_book.book.image.url)
        else:
            default_image_path = settings.STATIC_URL + 'assets/img/DefaultImage.jpeg'
            book_imageUrl = request.build_absolute_uri(default_image_path)
        borrowed_books_Data.append(
            {
                'id': borrowed_book.book.id,
                'name': borrowed_book.book.title,
                'author': borrowed_book.book.author,
                'category': borrowed_book.book.category,
                'image': book_imageUrl
            }
        )

    return render(request, 'main/BorrowedBooksList.html', {
        'borrowed_books': json.dumps(borrowed_books_Data),
        'borrowed_books_DJ_array': borrowed_books_Data
    })


def add_new_book(request):
    if not request.user.is_authenticated:
        return redirect('login')
    if not CheckUserIsAdmin(request.user):
        return redirect('view_books')
    if request.method == "POST":
        try:
            formResult = AddBookForm(request.POST, request.FILES)
            if not formResult.is_valid():
                return JsonResponse({'success': False}, status=400)

            book = formResult.save()

            return JsonResponse({'success': True}, status=200)
        except Exception as e:
            return JsonResponse({'success': False}, status=500)

    form = AddBookForm()
    context = {'form': form}
    return render(request, 'main/AddNewBook.html', context)


def deleteBook(request, book_id):
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'error': 'Not authenticated'}, status=401)
    if not CheckUserIsAdmin(request.user):
        return JsonResponse({'success': False, 'error': 'Not authorized'}, status=403)
    if request.method == "DELETE":
        try:
            book = Book.objects.get(id=book_id) 
            book.delete()
            return JsonResponse({'success': True})
        except Book.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Book not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Invalid method'}, status=405)


def view_book_details_user(request):
    if request.method == "GET":
        book_id = request.GET.get('id')
        try:
            book = Book.objects.get(id=book_id)
            if book.image:
                book_imageUrl = request.build_absolute_uri(book.image.url)
            else:
                default_image_path = settings.STATIC_URL + 'assets/img/DefaultImage.jpeg'
                book_imageUrl = request.build_absolute_uri(default_image_path)

            bookData = {
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'category': book.category,
                'imageUrl': book_imageUrl,
                'description': book.description,
            }

            context = {'book': bookData}
            return render(request, 'main/ViewBookDetailsUser.html', context)
        except Book.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Book not found'}, status=404)
        except Exception as e:
            return redirect('view_books')
    return render(request, 'main/ViewBookDetailsUser.html')


def view_book_details_admin(request):
    if not request.user.is_authenticated:
        return redirect('login')
    if not CheckUserIsAdmin(request.user):
        return redirect('view_books')
    if request.method == "GET":
        book_id = request.GET.get('id')
        try:
            book = Book.objects.get(id=book_id)
            if book.image:
                book_imageUrl = request.build_absolute_uri(book.image.url)
            else:
                default_image_path = settings.STATIC_URL + 'assets/img/DefaultImage.jpeg'
                book_imageUrl = request.build_absolute_uri(default_image_path)

            bookData = {
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'category': book.category,
                'imageUrl': book_imageUrl,
                'description': book.description,
            }

            context = {'book': bookData}
            return render(request, 'main/ViewBookDetailsAdmin.html', context)
        except Book.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Book not found'}, status=404)
        except Exception as e:
            return redirect('view_books')
    return render(request, 'main/ViewBookDetailsAdmin.html')


def edit_book(request):
    if not request.user.is_authenticated:
        return redirect('login')
    if not CheckUserIsAdmin(request.user):
        return redirect('view_books')
    if request.method == "POST":
        try:
            bookId = request.POST.get("id")
            book = Book.objects.get(pk=bookId)
            form = EditBookForm(request.POST, request.FILES, instance=book)

            if not form.is_valid():
                return JsonResponse({'success': False}, status=400)

            for field in form.cleaned_data:
                value = form.cleaned_data[field]
                if value not in [None, '', []]:
                    setattr(book, field, value)

            book.save()
            return JsonResponse({'success': True}, status=200)
        except Book.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Book not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False}, status=500)

    try:
        bookId = request.GET.get("id")
        book = Book.objects.get(pk=bookId)
        form = EditBookForm(instance=book)
        image_url = book.image.url if book.image else '/static/img/testImage.jpeg'
        context = {'form': form, 'image_url': image_url, 'book': book}
        return render(request, 'main/EditBook.html', context)
    except Book.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Book not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False}, status=500)


@require_POST
def borrow_book(request, book_id):
    if not request.user.is_authenticated:
        return redirect('login')
    try:
        book = Book.objects.get(pk=book_id)
        if not book.is_available:
            return JsonResponse({'success': False, 'error': 'Book is already borrowed'}, status=400)

        BorrowedBook.objects.create(user=request.user, book=book)
        book.is_available = False
        book.save()

        return JsonResponse({'success': True})
    except Book.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Book not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@require_POST
def return_book(request, book_id):
    if not request.user.is_authenticated:
        return redirect('login')
    try:
        borrowed = BorrowedBook.objects.get(book_id=book_id, user=request.user)

        book = borrowed.book
        book.is_available = True
        book.save()

        borrowed.delete()

        return JsonResponse({'success': True})
    except BorrowedBook.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'You haven’t borrowed this book'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


def CheckBookStatus(request, book_id):
    if not request.user.is_authenticated:
        return redirect('login')

    try:
        book = Book.objects.get(pk=book_id)
        return JsonResponse({'success': True, 'isBorrowed': book.is_available})
    except Book.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Book Does Not Exist'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


def handler404(request, exception=None):
    context = {}
    response = render(request, 'main/404.html', context)
    response.status_code = 404
    return response


def fetch_books(request):
    try:
        books = Book.objects.all()
        books_data = []
        for book in books:
            book_imageUrl = book.image.url if book.image else settings.STATIC_URL + 'assets/img/DefaultImage.jpeg'
            books_data.append({
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'description': book.description,
                'category': book.category,
                'imageUrl': request.build_absolute_uri(book_imageUrl),
                'is_available': book.is_available
            })
        return JsonResponse({'success': True, 'books': books_data})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


def CheckUserIsAdmin(user):
    return User.objects.get(pk=user.pk).is_admin
