<template>
  <div class="d-flex justify-content-center">
    <div class="w-25">
      <Form @submit="submitReader" :validation-schema="readerFormSchema">
        <div class="form-group">
          <label for="name">Họ và tên</label>
          <Field name="name" type="text" class="form-control"
            v-model="reader.name" />
          <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="dateOfBirth">Năm sinh</label>
          <Field name="dateOfBirth" type="number" class="form-control"
          v-model="reader.dateOfBirth" />
          <ErrorMessage name="dateOfBirth" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="gender">Phái</label>
          <Field @change="onGenderChange($event)" as="select" name="gender" type="text" class="form-control" 
            v-model="reader.gender">
            <option>Nam</option>
            <option>Nữ</option>
          </Field>
          <ErrorMessage name="gender" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="address">Địa chỉ</label>
          <Field name="address" type="text" class="form-control"
          v-model="reader.address" />
          <ErrorMessage name="address" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="phone">Số điện thoại</label>
          <Field name="phone" type="text" class="form-control"
          v-model="reader.phone" />
          <ErrorMessage name="phone" class="error-feedback" />
        </div>
        <div class="form-group my-2">
          <button type="submit" class="btn btn-primary">Cập nhật</button>
        </div>
      </Form>
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
  props: {
    reader: {}
  },
  emits: [
    "submit:reader"
  ],
  data() {
    const readerFormSchema = yup.object().shape({
      name: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
      address: yup
        .string()
        .required("Vui lòng nhập địa chỉ."),
      phone: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(
          /((09|03|07|08|05)+([0-9]{8})\b)/g,
          "Số điện thoại không hợp lệ."),
      gender: yup
        .string(),
      dateOfBirth: yup
        .number()
        .min(1940)
        .required("Vui lòng năm sinh")
    });
    return {
      reader: this.reader,
      readerFormSchema
    };
  },
  methods: {
    async submitReader() {
      this.$emit("submit:reader", this.reader);
    },
    async onGenderChange(e) {
      this.reader.gender = e.target.value;
    }
  }
};
</script>

