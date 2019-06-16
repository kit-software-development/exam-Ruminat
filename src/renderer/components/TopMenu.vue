<template lang="pug">
  .top-menu(v-on:keyup.esc="closeAuth")
    .menu-item.user-part(v-if="!username")
      #username-button <i class="fas fa-user-secret"></i> Гость
      #login-button(@click="openAuth") <i class="fas fa-sign-in-alt"></i> Войти
    .menu-item.user-part(v-else)
      #username-button {{ username }}
      #login-button(@click="logout") <i class="fas fa-sign-out-alt"></i> Выйти

    auth(v-if="!username || win.opened")
</template>


<script>
  import Auth from './TopMenu/Auth'

  export default {
    name: 'top-menu',
    components: { Auth },
    data () {
      return {
        win: this.$store.getters.win
      }
    },
    computed: {
      username () { return this.$store.state.Auth.username }
    },
    methods: {
      openAuth () {
        this.$store.dispatch('open')
      },
      closeAuth () {
        this.$store.dispatch('close')
      },
      keyup (e) {
        if (e.code === 'Escape') {
          if (this.win.opened) this.closeAuth()
          else this.$store.dispatch('chooseCard', null)
        }
      },
      logout () {
        this.$store.commit('LOGOUT')
      }
    },
    mounted () {
      window.addEventListener('keyup', this.keyup)
      if (this.username !== '') {
        this.$store.dispatch('sync')
      } else {
        console.log(this.username)
      }
    },
    destroyed () {
      window.removeEventListener('keyup', this.keyup)
    }
  }
</script>


<style lang="sass">
  @import '../../css/variables.sass';
</style>
