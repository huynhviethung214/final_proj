<template>
<div class="container">
  <div class="d-flex justify-content-center">
    <InputSearch class="mx-1" v-model="searchText"/>
    <button class="mx-1 btn btn-primary btn-sm" @click="refreshList">
      <i class="bi bi-arrow-counterclockwise"></i>
    </button>
    <button v-if="isWorking()" class="mx-1 btn btn-success btn-sm" @click="goToAddEmployee">
      <i class="bi bi-file-plus"></i>
    </button>
  </div>
  <div class="border m-1 p-4 w-auto">
    <List v-if="filteredEmployeesCount > 0"
      :elements="filteredEmployees"
      :buttonMaps="{
        'Xóa': {
          'func': removeEmployee, 
          'buttonClasses': 'btn btn-danger mx-1 text-center',
          'icon': 'bi bi-x-circle',
          'condition': isWorking()
        },
        'Chỉnh Sửa': {
          'func': goToEditEmployee, 
          'buttonClasses': 'btn btn-success mx-1 text-center',
          'icon': 'bi bi-wrench',
          'condition': isWorking()
        },
      }"
      :attributesNameMaps="{
        'name': 'Tên nhân viên',
        'role': 'Chức vụ',
        'address': 'Địa chỉ',
        'phone': 'Số điện thoại'
      }"/>
    <p v-else>Chưa có nhân viên</p>
  </div>
</div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import List from "@/components/List.vue";
import EmployeeService from "@/services/employee.service";
import AccountService from "@/services/account.service";

export default {
  components: {
    InputSearch,
    List
  },
  data() {
    return {
      employees: [],
      searchText: "",
      isLoggedIn: false,
      accountRole: 1
    };
  },
  computed: {
    employeeStrings() {
      return this.employees.map((employee) => {
        const { name, role, address, phone, accountId } = employee;
        return [employee._id, name, role, address, phone, accountId].join("");
      });
    },
    filteredEmployees() {
      if (!this.searchText) return this.employees;
      return this.employees.filter((_, index) => { 
        return this.employeeStrings[index].includes(this.searchText);
      });
    },
    filteredEmployeesCount() {
      return this.filteredEmployees.length;
    }
  },
  methods: {
    async retrieveEmployees() {
      try {
        this.employees = await EmployeeService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    async removeEmployee(employeeId) {
      const employee = this.activeEmployee(employeeId);
      await EmployeeService.delete(employee._id);
      await AccountService.delete(employee.accountId);
      this.refreshList();
    },
    refreshList() {
      this.retrieveEmployees();
    },
    goToAddEmployee() {
      this.$router.push({ name: "employee.add" });
    },
    goToEditEmployee(employeeId) {
      this.$router.push({ name: "employee.edit", params: { id: this.activeEmployee(employeeId)._id } });
    },
    isWorking() {
      if (this.accountRole != 2) { return true };
      return false;
    },
    activeEmployee(publisherId) {
      return this.employees.filter((_, index) => { 
        return this.employeeStrings[index].includes(publisherId);
      })[0];
    },
  },
  mounted() {
    this.accountRole = parseInt(sessionStorage.getItem("accountRole"));
    this.refreshList();
  }
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style>

<!-- <template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>
    <div class="mt-3 col-md-6">
      <h4>
        Nhân viên
        <i class="fas fa-address-book"></i>
      </h4>
      <List
        v-if="filteredEmployeeCount > 0"
        :elements="filteredEmployees"
        v-model:activeIndex="activeIndex"
      />
      <p v-else>Không có nhân viên</p>
    </div>
  </div>
  <div class="mt-3 row justify-content-around align-items-center">
    <button class="btn btn-sm btn-primary" @click="refreshList">
      <i class="fas fa-redo"></i> Làm mới
    </button>
    <button class="btn btn-sm btn-success" @click="goToAddEmployee">
      <i class="fas fa-plus"></i> Thêm nhân viên
    </button>
  </div>
  <div class="mt-3 col-md-6">
    <div v-if="activeEmployee">
      <h4>
        Chi tiết Liên hệ
        <i class="fas fa-address-card"></i>
      </h4>
      <EmployeeCard :employee="activeEmployee" />
      <router-link
        :to="{
          name: 'employee.edit',
          params: { id: activeEmployee._id },
        }">
        <span class="mt-2 badge badge-warning">
          <i class="fas fa-edit"></i> Hiệu chỉnh </span>
      </router-link>
      <button class="btn btn-sm btn-danger" @click="removeEmployee">
        <i class="fas fa-trash"></i> Xóa
      </button>
    </div>
  </div>
</template>

<script>
import EmployeeCard from "@/components/EmployeeCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import List from "@/components/List.vue";
import EmployeeService from "@/services/employee.service";
import AccountService from "@/services/account.service";

export default {
  components: {
    EmployeeCard,
    InputSearch,
    List,
  },
  data() {
    return {
      employees: [],
      activeIndex: -1,
      searchText: "",
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    employeeStrings() {
      return this.employees.map((employee) => {
        const { name, dateOfBirth, gender, address, phone } = employee;
        return [name, dateOfBirth, gender, address, phone].join("");
      });
    },
    filteredEmployees() {
      if (!this.searchText) return this.employees;
      return this.employees.filter((_, index) => { 
        return this.employeeStrings[index].includes(this.searchText);
      });
    },
    activeEmployee() {
      if (this.activeIndex < 0) return null;
      return this.filteredEmployees[this.activeIndex];
    },
    filteredEmployeeCount() {
      return this.filteredEmployees.length;
    },
  },
  methods: {
    async retrieveEmployees() {
      try {
        this.employees = await EmployeeService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    async removeEmployee() {
      await EmployeeService.delete(this.activeEmployee._id);
      await AccountService.delete(this.activeEmployee.accountId);
      this.activeIndex--;
      this.refreshList();
    },
    refreshList() {
      this.retrieveEmployees();
      this.activeIndex = -1;
    },
    goToAddEmployee() {
      this.$router.push({ name: "employee.add" });
    }
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style> -->
