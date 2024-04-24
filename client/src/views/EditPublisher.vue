<template>
  <PublisherForm v-if="isPublisherAvailable" :publisher="publisher" @submit:publisher="submitUpdatedInfo" />
  <p class="text-center">{{ message }}</p>
</template>

<script>
import PublisherForm from "@/components/PublisherForm.vue";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    PublisherForm
  },
  props: {
    id: { type: Object, required: true },
    publishers: { type: Object, required: true }
  },
  data() {
    return {
      publishers: this.publisher,
      isPublisherAvailable: false
    };
  },
  methods: {
    async submitUpdatedInfo() {
      await PublisherService.update(this.book._id, this.book);
      this.message = "Cập nhật thông tin nhà xuất bản thành công";
    },
    async getPublisherInfo() {
      const publisher = await PublisherService.get(this.id);
      if (publisher._id) {
        this.isPublisherAvailable = true;
      }
      this.publisher = publisher;
    }
  },
  mounted() {
    this.getPublisherInfo();
  }
};
</script>
