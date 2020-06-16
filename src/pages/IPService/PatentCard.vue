<template>
  <md-card>
    <md-card-header :data-background-color="dataBackgroundColor">
      <h4 class="title">
        <a class="card-title" href="#">
          {{ title }}
        </a>
      </h4>
    </md-card-header>
    <md-card-content>
      <div class="col-md-6">
        <p class="card-text">申请号: {{ applyNo }}</p>
      </div>
      <div class="col-md-6">
        <p class="card-text">申请日: {{ applyDate }}</p>
      </div>
      <div class="col-md-6">
        <p class="card-text">申请人: {{ applicant }}</p>
      </div>
      <div>
        <p class="card-text">摘要： {{ restrict(abstract) }}</p>
      </div>
    </md-card-content>
  </md-card>
</template>
<script>
export default {
  name: "patent-card",
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    patentInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      applyNo: "",
      applyDate: "",
      applicant: "",
      title: "",
      abstract: ""
    };
  },
  mounted() {
    this.showPatent(this.patentInfo);
  },
  methods: {
    showPatent(patent) {
      this.title = patent.title;
      this.applyNo = patent.applyNo;
      this.applyDate = patent.applyDate;
      this.applicant = patent.applicant;
      this.abstract = patent.abstractContent;
      // console.log(this.abstract);
    },
    restrict(abs) {
      if (abs === "" || abs == null) {
        return "";
      }
      if (abs.length < 48) {
        return abs;
      } else {
        return abs.substring(0, 48) + "...";
      }
    }
  }
};
</script>
<style></style>
