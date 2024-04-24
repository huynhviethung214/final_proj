<template>
  <ReaderForm v-if="isReaderAvailable" :reader="reader" @submit:reader="submitUpdatedInfo" />
  <p class="text-center">{{ message }}</p>
</template>

<script>
import ReaderService from "@/services/reader.service";
import ReaderForm from "@/components/ReaderForm.vue";

export default {
  components: {
    ReaderForm
  },
  props: {
    id: { type: Object, required: true }
  },
  data() {
    return {
      reader: {},
      isReaderAvailable: false,
      message: ""
    }
  },
  methods: {
    async submitUpdatedInfo() {
      await ReaderService.update(this.reader._id, this.reader);
      this.message = "Cập nhật thông tin người đọc thành công";
    },
    async getReaderInfo() {
      const reader = await ReaderService.get(this.id);
      if (reader.name) {
        this.isReaderAvailable = true;
      }
      this.reader = reader;
    }
  },
  mounted() {
    this.getReaderInfo();
  }
};
</script>
