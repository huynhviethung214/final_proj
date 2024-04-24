<template>
  <EmployeeForm v-if="isEmployeeAvailable" :employee="employee" @submit:employee="submitUpdatedInfo" />
  <p class="text-center">{{ message }}</p>
</template>

<script>
import EmployeeService from "@/services/employee.service";
import EmployeeForm from "@/components/EmployeeForm.vue";

export default {
  components: {
    EmployeeForm
  },
  props: {
    id: { type: Object, required: true }
  },
  data() {
    return {
      employee: {},
      isEmployeeAvailable: false,
      message: ""
    }
  },
  methods: {
    async submitUpdatedInfo() {
      await EmployeeService.update(this.employee._id, this.employee);
      this.message = "Cập nhật thông tin nhân viên thành công";
    },
    async getEmployeeInfo() {
      const employee = await EmployeeService.get(this.id);
      if (employee.name) {
        this.isEmployeeAvailable = true;
      }
      this.employee = employee;
    }
  },
  mounted() {
    this.getEmployeeInfo();
  }
};
</script>
