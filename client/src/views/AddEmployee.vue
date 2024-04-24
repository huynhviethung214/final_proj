<template>
  <div>
    <EmployeeForm :employee="employee" :account="account" @submit:employee="addEmployee"/>
    <p class="text-center">{{ message }}</p>
</div>
</template>

<script>
import EmployeeForm from "@/components/EmployeeForm.vue";
import EmployeeService from "@/services/employee.service";
import AccountService from "@/services/account.service";

export default {
  components: {
    EmployeeForm
  },
  data() {
    return {
      employee: {},
      account: {},
      message: ""
    };
  },
  methods: {
    async addEmployee(employeeData, accountData) {
      try {
        accountData.role = 1;
        const resp = await AccountService.create(accountData);
        employeeData.accountId = resp._id;

        await EmployeeService.create(employeeData);
        this.message = "Thêm nhân viên thành công";
      } catch (error) {
        this.message = "Xảy ra lỗi khi thêm nhân viên";
      }
    }
  },
};
</script>
