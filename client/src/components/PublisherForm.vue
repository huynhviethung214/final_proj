<template>
  <div class="d-flex justify-content-center">
    <div class="w-25">
      <Form @submit="submitPubliser" :validation-schema="publisherFormSchema">
        <div class="form-group">
          <label for="name">Tên Nhà Xuất Bản</label>
          <Field name="name" type="text" class="form-control"
            v-model="publisher.name" />
          <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="address">Địa chỉ nhà xuất bản</label>
          <Field name="address" type="text" class="form-control"
            v-model="publisher.address" />
          <ErrorMessage name="address" class="error-feedback" />
        </div>
        <div class="form-group my-2">
          <button v-if="!publisher.name" type="submit" class="btn btn-primary">Thêm Nhà Xuất Bản</button>
          <button v-if="publisher.name" type="submit" class="btn btn-primary">Cập nhật</button>
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
  emits: ["submit:publisher"],
  props: {
    publisher: { type: Object, required: true }
  },
  data() {
    const publisherFormSchema = yup.object().shape({
        name: yup
          .string()
          .required("Tên nhà xuất bản không được bỏ trống")
          .min(10, "Tên phải ít nhất 10 ký tự.")
          .max(50, "Tên có nhiều nhất 50 ký tự."),
        address: yup
          .string()
          .required("Xin nhập địa chỉ nhà xuất bản")
      });

    return {
      publishers: this.publisher,
      publisherFormSchema
    };
  },
  methods: {
    async submitPubliser() {
      this.$emit("submit:publisher", this.publisher);
    }
  }
};
</script>
