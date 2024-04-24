<template>
  <div class="d-flex justify-content-center">
    <div class="w-25">
      <Form @submit="submitEmployee" :validation-schema="employeeFormSchema">
        <div class="form-group">
          <label for="name">Họ tên nhân viên</label>
          <Field name="name" type="text" class="form-control"
            v-model="employee.name" />
          <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="address">Địa chỉ</label>
          <Field name="address" type="text" class="form-control"
            v-model="employee.address" />
          <ErrorMessage name="address" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="phone">Số điện thoại</label>
          <Field name="phone" type="text" class="form-control"
          v-model="employee.phone" />
          <ErrorMessage name="phone" class="error-feedback" />
        </div>
        <div v-if="!employee._id">
          <div class="form-group">
            <label for="username">Tên tài khoản</label>
            <Field name="username" type="text" class="form-control"
              v-model="account.username" />
            <ErrorMessage name="username" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="password">Mật khẩu</label>
            <Field name="password" type="password" class="form-control"
              v-model="account.password" />
            <ErrorMessage name="password" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="passwordConfirmation">Nhập lại mật khẩu</label>
            <Field name="passwordConfirmation" type="password" class="form-control"/>
            <ErrorMessage name="passwordConfirmation" class="error-feedback" />
          </div>
        </div>
        <div class="form-group my-2">
          <button v-if="!employee.name" type="submit" class="btn btn-primary">Thêm nhân viên</button>
          <button v-if="employee.name" type="submit" class="btn btn-primary">Cập nhật</button>
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
  emits: ["submit:employee"],
  props: {
    employee: { type: Object, required: true },
    account: { type: Object }
  },
  data() {
    const employeeFormSchema = yup.object().shape({
        name: yup
          .string()
          .required("Tên Nhân viên không được bỏ trống")
          .min(5, "Tên phải ít nhất 5 ký tự.")
          .max(50, "Tên có nhiều nhất 50 ký tự."),
        address: yup
          .string()
          .required("Vui lòng nhập địa chỉ"),
        phone: yup
          .string()
          .required("Vui lòng nhập số điện thoại")
          .matches(
          /((09|03|07|08|05)+([0-9]{8})\b)/g,
          "Số điện thoại không hợp lệ."),
        username: yup
          .string()
          .required("Tên tài khoản không được bỏ trống")
          .min(2, "Tên phải ít nhất 2 ký tự.")
          .max(50, "Tên có nhiều nhất 50 ký tự."),
        password: yup
          .string()
          .min(10, "Mật khẩu phải có độ dài ít nhất 10 kí tự")
          .required("Vui lòng nhập mật khẩu"),
        passwordConfirmation: yup
          .string()
          .required()
          .oneOf([yup.ref('password')], 'Mật khẩu không trùng')
      });

    return {
      employee: this.employee,
      account: this.account,
      employeeFormSchema
    };
  },
  methods: {
    async submitEmployee() {
      this.employee.role = "Nhân viên";
      this.$emit("submit:employee", this.employee, this.account);
    }
  }
};
</script>
