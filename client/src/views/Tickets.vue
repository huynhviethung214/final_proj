<template>
<div class="container">
  <div class="d-flex justify-content-center">
    <InputSearch class="mx-1" v-model="searchText"/>
    <button class="mx-1 btn btn-primary btn-sm" @click="refreshList">
      <i class="bi bi-arrow-counterclockwise"></i>
    </button>
  </div>
  <div class="border m-1 p-4 w-auto">
    <List v-if="filteredTicketsCount > 0"
      :elements="filteredTickets"
      :buttonMaps="{
        'Xác Nhận Trả Sách': {
          'func': returnConfirmation, 
          'buttonClasses': 'btn btn-success mx-1 text-center',
          'icon': 'bi bi-check-circle',
          'condition': isWorking()
        }
      }"
      :attributesNameMaps="{
        'author': 'Tác giả',
        'publisherName': 'Tên nhà xuất bản',
        'bookName': 'Tên sách',
        'name': 'Họ tên người mượn',
        'readerAddress': 'Địa chỉ người mượn',
        'rentDate': 'Ngày mượn',
        'returnDate': 'Ngày trả',
        'quantity': 'Số lượng mượn'
      }"/>
    <p v-else>Chưa có lịch sử mượn sách</p>
  </div>
</div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import List from "@/components/List.vue";
import TicketService from "@/services/ticket.service";
import ReaderService from "@/services/reader.service";
import BookService from "@/services/book.service";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    InputSearch,
    List
  },
  data() {
    return {
      tickets: [],
      searchText: "",
      accountRole: 1
    };
  },
  computed: {
    ticketStrings() {
      return this.tickets.map((ticket) => {
        const { name, readerAddress, bookName, publisherName, author } = ticket;
        return [ticket._id, name, readerAddress, bookName, publisherName, author].join("");
      });
    },
    filteredTickets() {
      if (!this.searchText) return this.tickets;
      return this.tickets.filter((_, index) => { 
        return this.ticketString[index].includes(this.searchText);
      });
    },
    activeTicket(ticketId) {
      return this.tickets.filter((_, index) => { 
        return this.ticketStrings[index].includes(ticketId);
      })[0];
    },
    filteredTicketsCount() {
      return this.filteredTickets.length;
    },
  },
  methods: {
    async retrieveTickets() {
      try {
        if (this.isWorking() == true) {
          this.tickets = await TicketService.getAll();
        } else if (this.accountRole == 2) {
          const readerId = sessionStorage.getItem("readerId");
          this.tickets = await TicketService.getByReaderId(readerId);
        }

        for (var i = 0; i < this.tickets.length; i++) {
          const book = await BookService.get(this.tickets[i].bookId);
          const reader = await ReaderService.get(this.tickets[i].readerId);
          const publisher = await PublisherService.get(book.publisherId);

          this.tickets[i].bookName = book.name;
          this.tickets[i].publisherName = publisher.name;
          this.tickets[i].author = book.author;

          this.tickets[i].name = reader.name;
          this.tickets[i].readerAddress = reader.address;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async returnConfirmation(ticketId) {
      const resp = await TicketService.delete(ticketId);
      const book = await BookService.get(resp.bookId);
      book.quantity += resp.quantity;
      await BookService.update(book._id, book);
      this.refreshList();
    },
    isWorking() {
      if (this.accountRole != 2) { return true };
      return false;
    },
    refreshList() {
      this.retrieveTickets();
    }
  },
  mounted() {
    this.accountRole = parseInt(sessionStorage.getItem("accountRole"));
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
        Danh Sách Thẻ mượn
        <i class="fas fa-address-book"></i>
      </h4>
      <List
        v-if="filteredReaderCount > 0"
        :elements="filteredTickets"
        v-model:activeIndex="activeIndex"
      />
      <p v-else>Không có thẻ mượn sách</p>
    </div>
  </div>
  <div class="mt-3 row justify-content-around align-items-center">
    <button class="btn btn-sm btn-primary" @click="refreshList">
      <i class="fas fa-redo"></i> Làm mới
    </button>
  </div>
  <div class="mt-3 col-md-6">
    <div v-if="activeTicket">
      <h4>
        Danh Sách Thẻ Mượn
        <i class="fas fa-address-card"></i>
      </h4>
      <TicketCard :ticket="activeTicket" />
      <button v-if="isWorking() == true" class="btn btn-sm btn-danger" @click="returnConfirmation">
        <i class="fas fa-trash"></i> Xác Nhận Trả Sách
      </button>
    </div>
  </div>
</template>

<script>
import TicketCard from "@/components/TicketCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import List from "@/components/List.vue";
import TicketService from "@/services/ticket.service";
import ReaderService from "@/services/reader.service";
import BookService from "@/services/book.service";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    TicketCard,
    InputSearch,
    List,
  },
  data() {
    return {
      tickets: [],
      activeIndex: -1,
      searchText: "",
      accountRole: "1"
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    ticketString() {
      return this.tickets.map((ticket) => {
        const { name, readerAddress, bookName, publisherName, author } = ticket;
        return [name, readerAddress, bookName, publisherName, author].join("");
      });
    },
    filteredTickets() {
      if (!this.searchText) return this.tickets;
      return this.tickets.filter((_, index) => { 
        return this.ticketString[index].includes(this.searchText);
      });
    },
    activeTicket() {
      if (this.activeIndex < 0) return null;
      return this.filteredTickets[this.activeIndex];
    },
    filteredReaderCount() {
      return this.filteredTickets.length;
    },
  },
  methods: {
    async retrieveTickets() {
      try {
        if (this.isWorking() == true) {
          this.tickets = await TicketService.getAll();
        } else if (this.accountRole == "1") {
          const readerId = sessionStorage.getItem("readerId");
          this.tickets = await TicketService.getByReaderId(readerId);
        }

        for (var i = 0; i < this.tickets.length; i++) {
          const book = await BookService.get(this.tickets[i].bookId);
          const reader = await ReaderService.get(this.tickets[i].readerId);
          const publisher = await PublisherService.get(book.publisherId);

          this.tickets[i].bookName = book.name;
          this.tickets[i].publisherName = publisher.name;
          this.tickets[i].author = book.author;

          this.tickets[i].name = reader.name;
          this.tickets[i].readerAddress = reader.address;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async returnConfirmation() {
      await TicketService.delete(this.activeTicket._id);
      const book = await BookService.get(this.activeTicket.bookId);
      book.quantity++;
      await BookService.update(book._id, book);

      this.activeIndex--;
      this.refreshList();
    },
    isWorking() {
      if (this.accountRole == "0" || this.accountRole == "2") { return true };
      return false;
    },
    refreshList() {
      this.retrieveTickets();
      this.activeIndex = -1;
    }
  },
  mounted() {
    this.accountRole = sessionStorage.getItem("accountRole");
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
