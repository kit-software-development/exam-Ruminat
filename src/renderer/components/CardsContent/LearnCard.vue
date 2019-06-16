<template lang="pug">
  .learn
    h1 {{ title }}
    p Чтобы посмотреть значение термина, нажмите <kbd>space</kbd>.
    .card.text-center
      h3 {{ term.value }}
      h6(v-bind:class="definitionCls") {{ term.definition }}

    .btn-group.btn-group-block
      button.btn.btn-error(@click="nextTerm('bad')" v-bind:class="buttonsCls")
        | 👎 Не помню (<kbd>a</kbd>)
      button.btn.btn-success(@click="nextTerm('good')" v-bind:class="buttonsCls")
        | 👍 Помню    (<kbd>d</kbd>)
</template>


<script>
  import moment from 'moment'

  export default {
    name: 'learn-card',
    props: {
      title: String,
      terms: Array
    },
    data () {
      return {
        currentIndex: this.getNextIndex(0),
        visiable: false
      }
    },
    computed: {
      term () {
        return this.currentIndex === null
          ? {value: 'Нет терминов для изучения, вернитесь позже.', definition: ''}
          : this.terms[this.currentIndex]
      },
      definitionCls () {
        return this.currentIndex === null
          ? ['none']
          : this.visiable ? [''] : ['transparent']
      },
      buttonsCls () {
        return this.currentIndex === null ? ['none'] : ['']
      }
    },
    methods: {
      getNextIndex (fromIndex = 0) {
        let len = this.terms.length
        if (fromIndex >= len) return null
        for (var i = fromIndex; i < len; i++) {
          if (
            !this.terms[i].avaliableDate ||
            moment(new Date()) >= moment(this.terms[i].avaliableDate)
          ) return i
        }
        return null
      },
      nextTerm (type) {
        if (this.currentIndex !== null) {
          this.$store.commit('INCREASE_WAITING', {ID: this.term.ID, type})
          this.currentIndex = this.getNextIndex(this.currentIndex + 1)
          this.visiable = false
          this.$store.dispatch('saveCards')
        }
      },
      keyup (e) {
        // Системные клавишы не нажаты
        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
          if (e.code === 'KeyA') this.nextTerm('bad')
          if (e.code === 'KeyD') this.nextTerm('good')
          if (e.code === 'Space') this.visiable = !this.visiable
        }
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
  @import '../../../css/variables.sass'

  .learn
    .card
      display: flex
      align-items: center
      justify-content: center
      min-height: 8rem
</style>
