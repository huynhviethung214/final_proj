<template>
<div class="container">
  <div class="d-flex justify-content-center">
    <InputSearch class="mx-1" v-model="searchText"/>
    <button class="mx-1 btn btn-primary btn-sm" @click="refreshList">
      <i class="bi bi-arrow-counterclockwise"></i>
    </button>
    <button v-if="isWorking()" class="mx-1 btn btn-success btn-sm" @click="goToAddPublisher">
      <i class="bi bi-file-plus"></i>
    </button>
  </div>
  <div class="border m-1 p-4 w-auto">
    <List v-if="filteredPublishersCount > 0"
      :elements="filteredPublishers"
      :buttonMaps="{
        'Xóa': {
          'func': removePublisher, 
          'buttonClasses': 'btn btn-danger mx-1 text-center',
          'icon': 'bi bi-x-circle',
          'condition': isWorking()
        },
        'Chỉnh Sửa': {
          'func': goToEditPublisher, 
          'buttonClasses': 'btn btn-success mx-1 text-center',
          'icon': 'bi bi-wrench',
          'condition': isWorking()
        },
      }"
      :attributesNameMaps="{
        'name': 'Tên nhà xuất bản',
        'address': 'Địa chỉ'
      }"/>
    <p v-else>Chưa có nhà xuất bản</p>
  </div>
</div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import List from "@/components/List.vue";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    InputSearch,
    List
  },
  data() {
    return {
      publishers: [],
      searchText: "",
      isLoggedIn: false,
      accountRole: 1
    };
  },
  computed: {
    publisherStrings() {
      return this.publishers.map((publisher) => {
        const { name, address } = publisher;
        return [publisher._id, name, address].join("");
      });
    },
    filteredPublishers() {
      if (!this.searchText) return this.publishers;
      return this.publishers.filter((_, index) => { 
        return this.publisherStrings[index].includes(this.searchText);
      });
    },
    filteredPublishersCount() {
      return this.filteredPublishers.length;
    }
  },
  methods: {
    async retrievePublishers() {
      try {
        this.publishers = await PublisherService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    async removePublisher(publisherId) {
      await PublisherService.delete(publisherId);
      this.refreshList();
    },
    refreshList() {
      this.retrievePublishers();
    },
    goToAddPublisher() {
      this.$router.push({ name: "publisher.add" });
    },
    goToEditPublisher(publisherId) {
      this.$router.push({ name: "publisher.edit", params: { id: this.activePublisher(publisherId)._id } });
    },
    isWorking() {
      if (this.accountRole != 2) { return true };
      return false;
    },
    activePublisher(publisherId) {
      return this.publishers.filter((_, index) => { 
        return this.publisherStrings[index].includes(publisherId);
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
        Nhà Xuất Bản
        <i class="fas fa-address-book"></i>
      </h4>
      <List
        v-if="filteredPublishersCount > 0"
        :elements="filteredPublishers"
        v-model:activeIndex="activeIndex"/>
      <p v-else>Chưa có nhà xuất bản</p>
    </div>
  </div>
  <div class="mt-3 row justify-content-around align-items-center">
    <button class="btn btn-sm btn-primary" @click="refreshList">
      <i class="fas fa-redo"></i> Làm mới
    </button>
    <button v-if="isWorking()" class="btn btn-sm btn-success" @click="goToAddPublisher">
      <i class="fas fa-plus"></i> Thêm mới
    </button>
  </div>
  <div class="mt-3 col-md-6">
    <div v-if="activePublisher">
      <h4>
        Chi tiết Nhà Xuất Bản
        <i class="fas fa-address-card"></i>
      </h4>
      <PublisherCard :publisher="activePublisher" />
      <router-link v-if="isWorking()"
        :to="{
          name: 'publisher.edit',
          params: { id: activePublisher._id },
        }">
        <span class="mt-2 badge badge-warning">
          <i class="fas fa-edit"></i> Hiệu chỉnh </span>
      </router-link>
      <button v-if="isWorking()" class="btn btn-sm btn-danger" @click="removePublisher">
        <i class="fas fa-trash"></i> Xóa
      </button>
    </div>
  </div>
</template>

<script>
import PublisherCard from "@/components/PublisherCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import List from "@/components/List.vue";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    PublisherCard,
    InputSearch,
    List
  },
  data() {
    return {
      publishers: [],
      activeIndex: -1,
      searchText: "",
      isLoggedIn: "false",
      accountRole: "1"
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    publisherStrings() {
      return this.publishers.map((publisher) => {
        const { name, price, quantity, releaseDate, _, author } = publisher;
        return [name, price, quantity, releaseDate, author].join("");
      });
    },
    filteredPublishers() {
      if (!this.searchText) return this.publishers;
      return this.publishers.filter((_, index) => { 
        return this.publisherStrings[index].includes(this.searchText);
      });
    },
    activePublisher() {
      if (this.activeIndex < 0) return null;
      return this.filteredPublishers[this.activeIndex];
    },
    filteredPublishersCount() {
      return this.filteredPublishers.length;
    }
  },
  methods: {
    async retrievePublishers() {
      try {
        this.publishers = await PublisherService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    async removePublisher() {
      await PublisherService.delete(this.activePublisher._id);
      this.activeIndex--;
      this.refreshList();
    },
    refreshList() {
      this.retrievePublishers();
      this.activeIndex = -1;
    },
    goToAddPublisher() {
      this.$router.push({ name: "publisher.add", });
    },
    isWorking() {
      if (this.accountRole == "0" || this.accountRole == "2") { return true };
      return false;
    },
  },
  mounted() {
    this.accountRole = sessionStorage.getItem("accountRole");
    this.refreshList();
  }
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style> -->
