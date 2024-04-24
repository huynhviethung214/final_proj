<template>
  <div class="d-flex justify-content-center">
    <div class="w-25">
      <Form @submit="submitBook" :validation-schema="bookFormSchema">
        <div class="form-group">
          <label for="name">Tên Sách</label>
          <Field name="name" type="text" class="form-control"
            v-model="book.name" />
          <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="price">Giá Sách / Quyển</label>
          <Field name="price" value="0" type="number" class="form-control"
            v-model="book.price" />
          <ErrorMessage name="price" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="quantity">Số Lượng</label>
          <Field name="quantity" value="0" type="number" class="form-control"
            v-model="book.quantity" />
          <ErrorMessage name="quantity" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="releaseDate">Năm Xuất Bản</label>
          <Field name="releaseDate" type="text" class="form-control"
          v-model="book.releaseDate" />
          <ErrorMessage name="releaseDate" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="publisherName">Nhà Xuất Bản</label>
          <Field @change="onPublisherChange($event)" as="select" name="publisherName" type="text" class="form-control" 
          v-model="book.publisherName">
            <option v-for="publisher in publishers">
              {{ publisher.name }}
            </option>
          </Field>
          <ErrorMessage name="publisherName" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="author">Tên Tác Giả</label>
          <Field name="author" type="text" class="form-control"
            v-model="book.author" />
          <ErrorMessage name="author" class="error-feedback" />
        </div>
        <div class="form-group my-2">
          <button v-if="!book.name" type="submit" class="btn btn-primary">Thêm Sách</button>
          <button v-if="book.name" type="submit" class="btn btn-primary">Cập nhật</button>
        </div>
      </Form>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import PublisherService from "@/services/publisher.service"

export default {
  components: {
    Form,
    Field,
    ErrorMessage
  },
  emits: ["submit:book"],
  props: {
    book: { type: Object, required: true },
    publishers: { type: Object, required: true }
  },
  data() {
    const bookFormSchema = yup.object().shape({
        name: yup
          .string()
          .required("Tên Sách không được bỏ trống")
          .min(5, "Tên phải ít nhất 5 ký tự.")
          .max(50, "Tên có nhiều nhất 50 ký tự."),
        price: yup
          .number()
          .min(10000, "Giá mượn phải lớn hơn hoặc bằng 10.000 VND")
          .max(800000, "Giá mượn phải bé hơn hoặc bằng 800.000 VND")
          .required(),
        quantity: yup
          .number()
          .min(0, "Số lượng phải lớn hơn hoặc bằng 0 cuốn")
          .max(50, "Số lượng không vượt quá 50 cuốn")
          .integer(),
        releaseDate: yup
          .number()
          .min(1900, "Năm xuất bản phải sau năm 1900")
          .required("Xin nhập năm xuất bản"),
        publisherName: yup
          .string()
          .required("Vui lòng chọn nhà xuất bản"),
        author: yup
          .string()
          .required("Vui lòng nhập tên tác giả")
      });

    return {
      book: this.book,
      publishers: this.publishers,
      bookFormSchema
    };
  },
  methods: {
    async submitBook() {
      this.$emit("submit:book", this.book);
    },
    async getPublishers() {
      this.publishers = await PublisherService.getAll();
    },
    async onPublisherChange(e) {
      this.book.publisherName = e.target.value;
    }
  },
  mounted() {
    this.getPublishers();
  },
};
</script>
