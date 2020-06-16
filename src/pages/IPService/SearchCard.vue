<template>
  <div>
    <md-card>
      <md-card-content>
        <h1 class="text-center">知识产权搜索</h1>
        <div class="md-layout">
          <div class="md-layout-item md-size-30"></div>
          <md-field class="md-layout-item md-size-40">
            <label>输入关键词</label>
            <md-input v-model="keyword" type="text"></md-input>
          </md-field>
          <md-button
            class="md-layout-item md-size-20 md-mypurple"
            @click="search"
          >
            搜索
          </md-button>
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>
<script>
export default {
  name: "search-card",
  data() {
    return {
      keyword: ""
    };
  },
  methods: {
    search() {
      var _this = this;
      this.$emit("getKeyword", this.keyword);
      this.axios
        .get("/patent/all")
        .then(function(response) {
          if (response.status === 200) {
            console.log(response.data);
            _this.$emit("getPatentList", response.data);
            //   for (
            //     var i = _this.pageSize * (_this.currentPage - 1);
            //     i < _this.pageSize * _this.currentPage;
            //     i++
            //   ) {
            //     if (i >= _this.patents.length) {
            //       break;
            //     }
            //     _this.visiblePatents.push(_this.patents[i]);
            //   }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.md-button {
  height: 50px;
  background-color: #9c27b0 !important;
}
</style>
