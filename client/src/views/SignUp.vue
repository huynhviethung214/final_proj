<template>
  <div class="container">
    <AccountForm :account="account" @submit:account="createAccount"/>
    <p class="text-center">{{ message }}</p>
  </div>
</template>

<script>
import AccountForm from "@/components/AccountForm.vue";
import AccountService from "@/services/account.service";

export default {
  components: {
    AccountForm
  },
  data() {
    return {
      account: {},
      message: ""
    };
  },
  methods: {
    async createAccount(data) {
      try {
        data.role = 2;
        const resp = await AccountService.create(data);
        if (resp.username) {
          this.$router.push({ name: "reader.add", 
                              params: { accountId: resp._id } });
        } else {
          this.message = "Tên tài khoản đã tồn tại";
        }
      } catch (error) {
        this.message = "Xảy ra lỗi trong quá trình đăng ký";
      }
    }
  },
};
</script>
