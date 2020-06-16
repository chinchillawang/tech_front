<template>
  <div class="content">
    <div class="md-layut">
      <div class="md-layout-item">
        <search-card
          @getPatentList="getPatentList"
          @getKeyword="getKeyword"
        ></search-card>
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-50">
        <patent-card
          data-background-color="purple"
          v-for="patent in visiblePatents"
          :key="patent.id"
          :patentInfo="patent"
        >
        </patent-card>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-50">
        <kg-card
          data-background-color="purple"
          v-for="keyword in keywords"
          :key="keyword"
          :keyword="keyword"
        ></kg-card>
      </div>
    </div>
  </div>
</template>

<script>
import { SearchCard, PatentCard, KgCard } from "@/pages";

export default {
  components: {
    SearchCard,
    PatentCard,
    KgCard
  },
  data() {
    return {
      keywords: [],
      patents: [],
      visiblePatents: [],
      currentPage: 1,
      pageSize: 12
    };
  },
  methods: {
    getPatentList(patents) {
      var _this = this;
      _this.patents = patents;
      _this.visiblePatents = [];
      console.log(patents);
      for (let i = 0; i < 5; i++) {
        _this.visiblePatents.push(_this.patents[i]);
      }
      // console.log(_this.visiblePatents);
    },
    getKeyword(keyword) {
      var self = this;
      self.keywords = [];
      self.keywords.push(keyword);
      console.log(self.keyword);
    }
  }
};
</script>
