<template>
  <div class="d-flex justify-content-center">
    <div class="w-25">
      <h1>Đăng Nhập</h1>
      <Form @submit="login" :validation-schema="accountFormSchema">
        <div class="form-group">
          <label for="username">Tên đăng nhập</label>
          <Field name="username" type="text" class="form-control"
            v-model="username" />
          <ErrorMessage name="username" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <Field name="password" type="password" class="form-control"
            v-model="password" />
          <ErrorMessage name="password" class="error-feedback" />
        </div>
        <div class="form-group my-2">
          <button type="submit" class="btn btn-primary">Đăng Nhập</button>
        </div>
      </Form>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import AccountService from "@/services/account.service";
import ReaderService from "@/services/reader.service";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  components: {
    Form,
    Field,
    ErrorMessage
  },
  data() {
    const accountFormSchema = yup.object().shape({
        username: yup
          .string()
          .required("Tên đăng nhập không được bỏ trống")
          .min(2, "Tên phải ít nhất 2 ký tự.")
          .max(50, "Tên có nhiều nhất 50 ký tự."),
        password: yup
          .string()
          .required("Vui lòng nhập mật khẩu"),
      });
      return {
        account: { type: Object },
        accountFormSchema,
        message: ""
      };
  },
  methods: {
    async login(data) {
      try {
        const account = await AccountService.login(data);
        if (account) {
          const reader = await ReaderService.getByAccountId(account._id);

          sessionStorage.setItem("accountRole", account.role);
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("username", account.username);
          sessionStorage.setItem("readerId", reader._id);
          this.$router.push({ name: "shelf" });
        } else {
          this.message = "Đăng nhập thất bại, vui lòng kiểm tra tên tài khoản / mật khẩu";
        };
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
