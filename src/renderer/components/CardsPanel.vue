<template lang="pug">
  .column.col-4.cards-panel
    label.form-switch
      input(type="checkbox" v-model="publicView")
      <i class="form-icon"></i> Показать все публичные карточки
    button#create-new.btn.btn-success(@click="createCard")
      <i class="fas fa-plus"></i> Создать набор карточек (<kbd>ctrl</kbd> + <kbd>n</kbd>)

    card-preview(
      v-for="card in viewCards"
      v-bind:key="card.ID"
      @click.native="cardClick(card, $event)"
      v-bind:class="cardCls(card)"
    )
      template(v-slot:card-title)
        <i class="fas fa-users" v-if="card.public"></i> {{ card.title }}
      template(v-slot:card-delete)
      template(v-slot:card-tags v-if="card.tags")
        span.tag.label.tag-ordinary(
          v-for="tag in card.tags.split(',').map((tag) => tag.trim())"
          v-bind:class="tag.type"
        ) {{ tag }}
      template(v-if="card.changed" v-slot:card-changed) {{ fromNow(card.changed) }}
      template(v-if="card.author"  v-slot:card-author) Автор: {{ card.author }}
</template>


<script>
  import CardPreview from './CardsPanel/CardPreview'
  import moment from 'moment'

  export default {
    name: 'cards-panel',
    components: { CardPreview },
    computed: {
      cards () { return this.$store.state.Cards.cards },
      publicCards () { return this.$store.state.Cards.publicCards },
      currentCard () { return this.$store.state.Cards.currentCard },
      username () { return this.$store.state.Cards.username },
      viewCards () {
        if (this.publicView) {
          return Array.from(this.publicCards).reverse()
        } else {
          return Array.from(this.cards).reverse()
        }
      },
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
      fromNow (date) { return moment(date).fromNow() },
      cardClick (card, e) {
        // Нажатие на корзину => удаление карточки
        if (e.target.classList.value.includes('delete-icon')) {
          this.$store.commit('DELETE_CARD', card.ID)
        // Нажатие на карточку => переключение на карточку
        } else {
          this.$store.dispatch('chooseCard', card)
        }
      },
      createCard () {
        this.$store.dispatch('newCard', this.$store.state.Auth.username)
      },
      keyup (e) {
        if (!this.$store.getters.win.opened && this.$store.state.Cards.username !== '') {
          if (e.ctrlKey && !e.altKey && !e.shiftKey) {
            if (e.code === 'KeyN') this.createCard()
            if (e.code === 'KeyS') this.$store.dispatch('saveCards')
            if (e.code === 'KeyE' && this.currentCard) this.$store.commit('LEARN_CARD')
          }
        }
      },
      cardCls (card) {
        let cls = []
        if (!this.mineCard(card)) cls.push('not-mine')
        if (this.currentCard && card.ID === this.currentCard.ID) cls.push('active')
        return cls
      },
      mineCard (card) {
        return !this.publicView || card.author.toLowerCase() === this.username.toLowerCase()
      }
    },
    mounted () {
      window.addEventListener('keyup', this.keyup)
    },
    destroyed () {
      window.removeEventListener('keyup', this.keyup)
    }
  }
</script>


<style lang="sass">
  @import '../../css/variables.sass';

  #card-search
    width: 100%
    margin-bottom: 0.5rem

  #create-new
    width: 100%
    margin-bottom: 0.5rem

  .form-switch
    margin-top: 0 !important


  .cards-panel
    .card
      border: none
    .card + .card
      border-top: 1px solid #EEE
    .card
      padding: 0.2rem
      line-height: 1rem
      border-left: 1px solid rgba(0,0,0,0)
      border-right: 1px solid rgba(0,0,0,0)
      cursor: default
      .main-part
        display: flex
        align-items: flex-start
        justify-content: space-between
      .title
        font-weight: bold
        font-size: 0.8rem
      .title, .card-text, .card-tags
        width: 100%
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        display: block
        h1, h2, h3, h4, h5, h6
          font-size: inherit
      .title *, .card-text *, .card-tags *
        display: inline
      .title
        width: calc(100% - 1.5rem)
        display: inline-block
      .card-text
        font-size: 0.7rem
      .tag
        font-size: 0.6rem
        background: rgba(0,0,0, 0.03)
        margin-right: 0.2rem
      .tag-primary
        color: $primary-color
      .tag-warning
        color: $warning-color
      .tag-danger
        color: $error-color
      .card-bottom
        display: flex
        justify-content: space-between
      .card-author, .card-changed
        font-size: 0.6rem

    .card:hover
      background: rgba(0,0,0, 0.03)

    .not-mine
      .title
        width: 100%
      .delete
        display: none

    .card.active
      border-left: 1px solid $primary-color
      border-right: 1px solid $primary-color
      background: rgba(0,0,0, 0.03)
    .card.active:hover
      background: rgba(0,0,64, 0.05)
</style>
