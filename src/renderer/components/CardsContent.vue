<template lang="pug">
  .column.col-8.cards-content(v-if="currentCard && !mineCard(currentCard)")
    cards-viewer(v-bind:card="currentCard")

  .column.col-8.cards-content(v-else-if="currentCard && !learning")
    cards-editor(v-bind:card="currentCard")

  .column.col-8.cards-content(v-else-if="currentCard && learning")
    learn-card(v-bind:title="currentCard.title" v-bind:terms="currentCard.terms")

  .column.col-8.cards-content.greeting(v-else)
    .greeting-box.text-center
      .header-box.flex-all-center
        <img src="../../../static/icon.svg" width="128" style="margin-right: 1rem" />
      h2
        span(v-if="username === ''") Добро пожаловать в «Chi»!
        span(v-else) Добро пожаловать в «Chi», {{ username }}!
      h4 Время получать знания!
</template>


<script>
  import CardsViewer from './CardsContent/CardsViewer'
  import CardsEditor from './CardsContent/CardsEditor'
  import LearnCard from './CardsContent/LearnCard'

  export default {
    name: 'cards-content',
    components: { CardsViewer, CardsEditor, LearnCard },
    computed: {
      currentCard () { return this.$store.state.Cards.currentCard },
      username () { return this.$store.state.Auth.username },
      learning () { return this.$store.state.Cards.learning },
      publicView: {
        set (val) {
          this.$store.dispatch('togglePublicView')
        },
        get () {
          return this.$store.state.Cards.publicView
        }
      }
    },
    methods: {
      mineCard (card) {
        return !this.publicView || card.author.toLowerCase() === this.username.toLowerCase()
      }
    }
  }
</script>


<style lang="sass">
  @import '../../css/variables.sass'

  .main
    .input-group
      margin-bottom: 0.5rem
      display: flex
      justify-content: space-between
      .has-icon-left
        width: 49%
    #card-title, #card-tags
      outline-bottom: none
    #card-title
      margin-right: 0.2rem
    #card-tags, #card-title
      width: 100%
    .term
      display: flex
      align-items: flex-start
      justify-content: space-between
      .delete
        height: 36px

  .greeting
    display: flex
    align-items: center
    justify-content: center
</style>
