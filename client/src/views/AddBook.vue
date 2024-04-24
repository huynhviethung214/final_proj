<template>
  <div class="container">
    <BookForm :book="book" @submit:book="addBook"/>
    <p class="text-center">{{ message }}</p>
  </div>
</template>

<script>
import BookForm from "@/components/BookForm.vue";
import BookService from "@/services/book.service";
import PublisherService from "@/services/publisher.service"

export default {
  components: {
    BookForm
  },
  data() {
    return {
      book: {},
      message: ""
    };
  },
  methods: {
    async addBook(data) {
      try {
        const publisher = await PublisherService.getByName(data.publisherName);
        const { name, price, quantity, releaseDate, _, author } = data;

        const matches = await BookService.getByName(name);
        if (matches.length == 0) {
          await BookService.create({
            name: name,
            price: price,
            quantity: quantity,
            releaseDate: releaseDate,
            publisherId: publisher._id,
            author: author
          });
          this.message = "Thêm sách thành công.";
        } else {
          this.message = "Sách đã tồn tại.";
        };
      } catch (error) {
        console.log(error);
      }
    }
  },
};
</script>
