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
            class="md-layout-item md-size-20"
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
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      keyword: ""
    };
  }
};
</script>
<style></style>
