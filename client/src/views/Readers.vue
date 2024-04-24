<template>
<div class="container">
  <div class="d-flex justify-content-center">
    <InputSearch class="mx-1" v-model="searchText"/>
    <button class="mx-1 btn btn-primary btn-sm" @click="refreshList">
      <i class="bi bi-arrow-counterclockwise"></i>
    </button>
  </div>
  <div class="border m-1 p-4 w-auto">
    <List v-if="filteredReaderCount > 0"
      :elements="filteredReaders"
      :buttonMaps="{
        'Xóa': {
          'func': removeReader, 
          'buttonClasses': 'btn btn-danger mx-1 text-center',
          'icon': 'bi bi-x-circle',
          'condition': isWorking()
        },
        'Chỉnh Sửa': {
          'func': goToEditReader, 
          'buttonClasses': 'btn btn-success mx-1 text-center',
          'icon': 'bi bi-wrench',
          'condition': isWorking()
        },
      }"
      :attributesNameMaps="{
        'name': 'Họ tên độc giả',
        'dateOfBirth': 'Năm sinh',
        'gender': 'Phái',
        'address': 'Địa chỉ',
        'phone': 'Số điện thoại'
      }"/>
    <p v-else>Chưa có người đọc</p>
  </div>
</div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import List from "@/components/List.vue";
import ReaderService from "@/services/reader.service";
import AccountService from "@/services/account.service";

export default {
  components: {
    InputSearch,
    List
  },
  data() {
    return {
      readers: [],
      searchText: "",
      isLoggedIn: false,
      accountRole: 1
    };
  },
  computed: {
    readerStrings() {
      return this.readers.map((reader) => {
        const { name, dateOfBirth, gender, address, phone } = reader;
        return [reader._id, name, dateOfBirth, gender, address, phone].join("");
      });
    },
    filteredReaders() {
      if (!this.searchText) return this.readers;
      return this.readers.filter((_, index) => { 
        return this.readerStrings[index].includes(this.searchText);
      });
    },
    filteredReaderCount() {
      return this.filteredReaders.length;
    },
  },
  methods: {
    async retrieveReaders() {
      try {
        this.readers = await ReaderService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    async removeReader(readerId) {
      const reader = this.activeReader(readerId);
      await ReaderService.delete(reader._id);
      await AccountService.delete(reader.accountId);
      this.refreshList();
    },
    refreshList() {
      this.retrieveReaders();
    },
    isWorking() {
      if (this.accountRole != 2) { return true };
      return false;
    },
    activeReader(readerId) {
      return this.readers.filter((_, index) => { 
        return this.readerStrings[index].includes(readerId);
      })[0];
    },
    goToEditReader(readerId) {
      this.$router.push({ name: 'reader.edit', params: { id: this.activeReader(readerId)._id } });
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
</style>

<!-- <template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>
    <div class="mt-3 col-md-6">
      <h4>
        Người dùng
        <i class="fas fa-address-book"></i>
      </h4>
      <List
        v-if="filteredReaderCount > 0"
        :elements="filteredReaders"
        v-model:activeIndex="activeIndex"
      />
      <p v-else>Không có người dùng</p>
    </div>
  </div>
  <div class="mt-3 row justify-content-around align-items-center">
    <button class="btn btn-sm btn-primary" @click="refreshList">
      <i class="fas fa-redo"></i> Làm mới
    </button>
  </div>
  <div class="mt-3 col-md-6">
    <div v-if="activeReader">
      <h4>
        Chi tiết Liên hệ
        <i class="fas fa-address-card"></i>
      </h4>
      <ReaderCard :reader="activeReader" />
      <router-link
        :to="{
          name: 'reader.edit',
          params: { id: activeReader._id },
        }">
        <span class="mt-2 badge badge-warning">
          <i class="fas fa-edit"></i> Hiệu chỉnh </span>
      </router-link>
      <button class="btn btn-sm btn-danger" @click="removeReader">
        <i class="fas fa-trash"></i> Xóa
      </button>
    </div>
  </div>
</template>

<script>
import ReaderCard from "@/components/ReaderCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import List from "@/components/List.vue";
import ReaderService from "@/services/reader.service";
import AccountService from "@/services/account.service";

export default {
  components: {
    ReaderCard,
    InputSearch,
    List
  },
  data() {
    return {
      readers: [],
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
    readersStrings() {
      return this.readers.map((reader) => {
        const { name, dateOfBirth, gender, address, phone } = reader;
        return [name, dateOfBirth, gender, address, phone].join("");
      });
    },
    filteredReaders() {
      if (!this.searchText) return this.readers;
      return this.readers.filter((_, index) => { 
        return this.readersStrings[index].includes(this.searchText);
      });
    },
    activeReader() {
      if (this.activeIndex < 0) return null;
      return this.filteredReaders[this.activeIndex];
    },
    filteredReaderCount() {
      return this.filteredReaders.length;
    },
  },
  methods: {
    async retrieveReaders() {
      try {
        this.readers = await ReaderService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    async removeReader() {
      await ReaderService.delete(this.activeReader._id);
      await AccountService.delete(this.activeReader.accountId);
      this.activeIndex--;
      this.refreshList();
    },
    refreshList() {
      this.retrieveReaders();
      this.activeIndex = -1;
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
