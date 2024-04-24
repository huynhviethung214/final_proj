<template>
  <nav class="navbar navbar-expand p-3 navbar-dark bg-dark">
    <a href="/" class="navbar-brand mx-auto order-0 fs-2">Shelf</a>
    <div v-if="!isLoggedIn" class="nav-item mx-2 text-light">
      <router-link v-if="!isLoggedIn" :to="{ name: 'signin' }" class="nav-link">
        Đăng nhập
      </router-link>
    </div>
    <div v-if="!isLoggedIn" class="nav-item mx-2 text-light">
      <router-link v-if="!isLoggedIn" :to="{ name: 'signup' }" class="nav-link">
        Đăng ký
      </router-link>
    </div>
    <div v-if="isLoggedIn" class="dropdown px-5">
      <button class="btn bg-light btn-default dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {{ username }}
      </button>
      <ul class="dropdown-menu p-3">
        <li v-if="isLoggedIn" class="nav-item">
          <router-link :to="{ name: 'tickets' }" class="btn nav-link">
            Thẻ mượn
          </router-link>
        </li>
        <li v-if="isLoggedIn" class="nav-item">
          <router-link :to="{ name: 'publishers' }" class="btn nav-link">
            Nhà xuất bản
          </router-link>
        </li>
        <li v-if="isLoggedIn && isWorking()" class="nav-item">
          <router-link :to="{ name: 'readers' }" class="btn nav-link">
            Người đọc
          </router-link>
        </li>
        <li v-if="isLoggedIn && accountRole == 0" class="nav-item">
          <router-link :to="{ name: 'employees' }" class="btn nav-link">
            Nhân viên
          </router-link>
        </li>
        <li v-if="isLoggedIn" class="nav-item">
          <a @click="logout" class="btn nav-link">Đăng xuất</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      accountRole: 1,
      username: ""
    };
  },
  methods: {
    logout() {
      this.isLoggedIn = false;
      sessionStorage.setItem("isLoggedIn", "false");
      sessionStorage.removeItem("readerId");
      sessionStorage.removeItem("accountRole");
      sessionStorage.removeItem("username");
      this.$router.push({ name: "signin" });
    },
    isWorking() {
      if (this.accountRole == 0 || this.accountRole == 1) { return true };
      return false;
    },
  },
  mounted() {
    if (sessionStorage.getItem("isLoggedIn") == "true") {
      this.isLoggedIn = true;
    }
    this.accountRole = parseInt(sessionStorage.getItem("accountRole"));
    this.username = sessionStorage.getItem("username");
  }
};
</script>
