<template>
  <div class="d-flex justify-content-center">
    <div class="w-25">
      <h1>Đăng Ký</h1>
      <Form @submit="submitAccount" :validation-schema="accountFormSchema">
      <div class="form-group">
        <label for="username">Tên tài khoản</label>
        <Field name="username" type="text" class="form-control"
          v-model="account.username"/>
        <ErrorMessage name="username" class="error-feedback"/>
      </div>
      <div class="form-group">
        <label for="password">Mật khẩu</label>
        <Field name="password" type="password" class="form-control"
          v-model="account.password"/>
        <ErrorMessage name="password" class="error-feedback"/>
      </div>
      <div class="form-group">
        <label for="passwordConfirmation">Nhập lại mật khẩu</label>
        <Field name="passwordConfirmation" type="password" class="form-control"/>
        <ErrorMessage name="passwordConfirmation" class="error-feedback"/>
      </div>
      <div class="form-group my-2">
        <button type="submit" class="btn btn-primary">Tạo tài khoản</button>
      </div>
    </Form>
    <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Form,
    Field,
    ErrorMessage
  },
  emits: ["submit:account"],
  props: {
    account: { type: Object, required: true }
  },
  data() {
    const accountFormSchema = yup.object().shape({
        username: yup
          .string()
          .required("Tên đăng nhập không được bỏ trống")
          .min(5, "Tên phải ít nhất 5 ký tự.")
          .max(50, "Tên có nhiều nhất 50 ký tự."),
        password: yup
          .string()
          .min(10, "Mật khẩu phải có độ dài ít nhất 10 ký tự")
          .required("Vui lòng nhập mật khẩu"),
        passwordConfirmation: yup
          .string()
          .required('Xin hãy nhập lại mật khẩu')
          .oneOf([yup.ref('password')], 'Mật khẩu vừa nhập không đồng nhất')
      });
      return {
        account: this.account,
        accountFormSchema
      };
  },
  methods: {
    async submitAccount() {
      this.$emit("submit:account", this.account);
    }
  }
};
</script>
