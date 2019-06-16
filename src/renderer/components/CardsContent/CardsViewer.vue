<template lang="pug">
  .viewing-card
    .input-group
      .has-icon-left
        input#card-title.form-input(
          type="text"
          autofocus
          placeholder="Название"
          disabled
          v-bind:value="card.title"
        )
        i.form-icon.icon.fas.fa-heading
      .has-icon-left
        input#card-tags.form-input(
          type="text"
          placeholder="Тэги"
          disabled
          v-bind:value="card.tags"
        )
        i.form-icon.icon.fas.fa-tags
    .flex-all-center
      button.btn.btn-primary.full(
        style="margin-bottom: 0.5rem"
        @click="copyCard"
      ) Добавить набор себе
    .terms
      .term(v-for="term in card.terms" v-bind:key="term.ID")
        .input-group.flex-center(style="width: 100%")
          input#card-term.form-input(
            type="text"
            placeholder="Термин"
            v-bind:value="term.value"
            disabled
          )
          input#card-meaning.form-input(
            type="text"
            placeholder="Значение"
            v-bind:value="term.definition"
            disabled
          )
</template>


<script>
  export default {
    name: 'cards-viewer',
    props: {
      card: Object
    },
    methods: {
      learnCard () {
        this.$store.commit('LEARN_CARD')
      },
      copyCard () {
        this.$store.dispatch('copyCard', this.card)
      }
    }
  }
</script>