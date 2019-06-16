<template lang="pug">
  .card
    .main-part
      .title
        slot(name="card-title")
      slot(name="card-delete"): .delete
        <i class="delete-icon fas fa-times"></i>
    .describing-part
      .card-tags
        slot(name="card-tags")
      .card-bottom
        .card-changed
          slot(name="card-changed")
        .card-author
          slot(name="card-author")
</template>


<script>
  export default {
    name: 'card-preview'
  }
</script>
