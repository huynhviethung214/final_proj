<template>
  <BookForm v-if="isBookAvailable" :book="book" @submit:book="submitUpdatedInfo" />
  <p class="text-center">{{ message }}</p>
</template>

<script>
import BookForm from "@/components/BookForm.vue";
import BookService from "@/services/book.service";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    BookForm
  },
  props: {
    id: { type: Object, required: true },
    publishers: { type: Object, required: true }
  },
  data() {
    return {
      book: {},
      publishers: this.publisher,
      isBookAvailable: false
    };
  },
  methods: {
    async submitUpdatedInfo() {
      await BookService.update(this.book._id, this.book);
      this.message = "Cập nhật thông tin sách thành công";
    },
    async getBookInfo() {
      this.book = await BookService.get(this.id);

      if (this.book) {
        this.isBookAvailable = true
      }

      this.publishers = await PublisherService.getAll();
      this.book.publisherName = await PublisherService.get(this.book.publisherId).name;
    },
    async onPublisherChange(e) {
      this.book.publisherName = e.target.value;
    }
  },
  mounted() {
    this.getBookInfo();
  }
};
</script>
