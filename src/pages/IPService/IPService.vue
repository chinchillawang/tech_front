<template>
  <div class="content">
    <div class="md-layut">
      <div class="md-layout-item">
        <search-card data-background-color="green"> </search-card>
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-33">
        <patent-card> </patent-card>
      </div>
    </div>
  </div>
</template>

<script>
import { SearchCard, PatentCard } from "@/pages";

export default {
  components: {
    SearchCard,
    PatentCard
  }
};
</script>
