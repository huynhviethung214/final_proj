<template>
  <div class="container">
    <ReaderForm :reader="reader" @submit:reader="addReader"/>
</div>
</template>

<script>
import ReaderForm from "@/components/ReaderForm.vue";
import ReaderService from "@/services/reader.service"

export default {
  components: {
    ReaderForm
  },
  props: {
    accountId: {}
  },
  data() {
    return {
      reader: {},
      message: ""
    };
  },
  methods: {
    async addReader(data) {
      try {
        data.accountId = this.accountId;
        await ReaderService.create(data);
        this.$router.push({ name: "signin" });
      } catch (error) {
        console.log(error);
      }
    }
  },
};
</script>
