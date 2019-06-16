<template lang="pug">
  .editing-card
      .input-group
        .has-icon-left
          input#card-title.form-input(
            type="text"
            autofocus
            placeholder="Название"
            v-model="title"
          )
          i.form-icon.icon.fas.fa-heading
        .has-icon-left
          input#card-tags.form-input(
            type="text"
            placeholder="Тэги"
            v-model="tags"
          )
          i.form-icon.icon.fas.fa-tags
      label.form-checkbox(v-model:checked="isPublic")
        input(type="checkbox" v-model="isPublic")
        <i class="form-icon"></i> <i class="fas fa-users"></i> Набор виден всем
      .flex-all-center
        button.btn.btn-primary.full(
          style="margin-bottom: 0.5rem"
          @click="learnCard"
        ) Изучать (<kbd>ctrl</kbd> + <kbd>e</kbd>)
      .terms
        .term(v-for="term in card.terms" v-bind:key="term.ID")
          .input-group.flex-center(style="width: calc(100% - 1.2rem)")
            input#card-term.form-input(
              type="text"
              placeholder="Термин"
              v-bind:value="term.value"
              @input="termValueChanged(term.ID, $event.target.value)"
              @keyup.ctrl.enter.exact="newTerm"
            )
            input#card-meaning.form-input(
              type="text"
              placeholder="Значение"
              v-bind:value="term.definition"
              @input="definitionValueChanged(term.ID, $event.target.value)"
              @keyup.ctrl.enter.exact="newTerm"
            )
          .delete(@click="deleteTerm(term.ID)") <i class="delete-icon fas fa-times"></i>
        button.btn.btn-primary.full(@click="newTerm")
          | Добавить термин (<kbd>ctrl</kbd> + <kbd>enter</kbd>)
</template>


<script>
  export default {
    name: 'cards-editor',
    props: {
      card: Object
    },
    computed: {
      title: {
        set (val) {
          this.$store.commit('CHANGE_TITLE', val)
        },
        get () {
          return this.card.title
        }
      },
      tags: {
        set (val) {
          this.$store.commit('CHANGE_TAGS', val)
        },
        get () {
          return this.card.tags
        }
      },
      isPublic: {
        set (val) {
          this.$store.commit('TOGGLE_PUBLIC')
        },
        get () {
          return this.card.public
        }
      }
    },
    methods: {
      joinBy (arr, attr, joiner = ',') {
        if (!arr) return ''
        return arr.map((elem) => elem[attr]).join(joiner)
      },
      newTerm () {
        this.$store.commit('ADD_TERM')
      },
      termValueChanged (ID, val) {
        this.$store.commit('CHANGE_TERM_VALUE', {ID, val})
      },
      definitionValueChanged (ID, val) {
        this.$store.commit('CHANGE_TERM_DEFINITION', {ID, val})
      },
      deleteTerm (ID) {
        this.$store.commit('DELETE_TERM', ID)
      },
      learnCard () {
        this.$store.commit('LEARN_CARD')
      }
    }
  }
</script>