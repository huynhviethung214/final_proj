<template>
<div class="container">
  <div class="d-flex justify-content-center">
    <InputSearch class="mx-1" v-model="searchText"/>
    <button class="mx-1 btn btn-primary btn-sm" @click="refreshList">
      <i class="bi bi-arrow-counterclockwise"></i>
    </button>
    <button v-if="isWorking()" class="mx-1 btn btn-success btn-sm" @click="goToAddBook">
      <i class="bi bi-file-plus"></i>
    </button>
  </div>
  <div class="border m-1 p-4 w-auto">
    <List v-if="filteredBooksCount > 0"
      :elements="filteredBooks"
      :buttonMaps="{
        'Mượn Sách': {
          'func': rentBook, 
          'buttonClasses': 'btn btn-primary mx-1 text-center',
          'icon': 'bi bi-cart-plus',
          'condition': !isWorking()
        }, 
        'Xóa Sách': {
          'func': removeBook, 
          'buttonClasses': 'btn btn-danger mx-1 text-center',
          'icon': 'bi bi-x-circle',
          'condition': isWorking()
        },
        'Chỉnh Sửa': {
          'func': goToEditBook, 
          'buttonClasses': 'btn btn-success mx-1 text-center',
          'icon': 'bi bi-wrench',
          'condition': isWorking()
        },
      }"
      :attributesNameMaps="{
        'author': 'Tác giả',
        'price': 'Giá (VND)',
        'name': 'Tên sách',
        'quantity': 'Số lượng',
        'releaseDate': 'Năm xuất bản'
      }"
      />
    <p v-else>Kệ Sách Rỗng</p>
  </div>
</div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import List from "@/components/List.vue";
import BookService from "@/services/book.service";
import TicketService from "@/services/ticket.service";
import moment from 'moment';

export default {
  components: {
    InputSearch,
    List
  },
  data() {
    return {
      books: [],
      searchText: "",
      isLoggedIn: false,
      accountRole: 1
    };
  },
  computed: {
    bookStrings() {
      return this.books.map((book) => {
        const { name, price, quantity, releaseDate, _, author } = book;
        return [book._id, name, price, quantity, releaseDate, author].join("");
      });
    },
    filteredBooks() {
      if (!this.searchText) return this.books;
      return this.books.filter((_book, index) => { 
        return this.bookStrings[index].includes(this.searchText);
      });
    },
    filteredBooksCount() {
      return this.filteredBooks.length;
    }
  },
  methods: {
    async retrieveBooks() {
      try {
        this.books = await BookService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    async removeBook(bookId) {
      await BookService.delete(bookId);
      this.refreshList();
    },
    async rentBook(bookId) {
      const activeBook = this.activeBook(bookId);
      if (activeBook.quantity > 0) {
        const currentDate = moment().format("DD-MM-YYYY");
        const next30Days = (moment().add(1, 'M')).format("DD-MM-YYYY");

        await TicketService.create({
          readerId: sessionStorage.getItem("readerId"),
          bookId: bookId,
          rentDate: currentDate,
          returnDate: next30Days,
          quantity: 1
        });

        this.activeBook(bookId).quantity--;
        await BookService.update(activeBook._id, activeBook);
      }
    },
    refreshList() {
      this.retrieveBooks();
    },
    goToAddBook() {
      this.$router.push({ name: "book.add" });
    },
    goToEditBook(bookId) {
      this.$router.push({ name: "book.edit", params: {id: bookId} });
    },
    isWorking() {
      if (this.accountRole != 2) { return true };
      return false;
    },
    activeBook(bookId) {
      return this.books.filter((_book, index) => { 
        return this.bookStrings[index].includes(bookId);
      })[0];
    },
  },
  mounted() {
    this.isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (this.isLoggedIn == "true") {
      this.accountRole = parseInt(sessionStorage.getItem("accountRole"));
      this.refreshList();
    } else {
      this.$router.push({ name: "signin" });
    }
  }
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style>
