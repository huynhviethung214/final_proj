<template>
  <div class="container">
    <PublisherForm :publisher="publisher" @submit:publisher="addPublisher"/>
    <p class="text-center">{{ message }}</p>
</div>
</template>

<script>
import PublisherForm from "@/components/PublisherForm.vue";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    PublisherForm
  },
  data() {
    return {
      publisher: {},
      message: ""
    };
  },
  methods: {
    async addPublisher(publisher) {
      try {
        await PublisherService.create(publisher);
        this.message = "Thêm nhà xuất bản thành công";
      } catch (error) {
        this.message = "Xảy ra lỗi khi thêm nhà xuất bản";
      }
    }
  },
};
</script>
