<template lang="pug">
  .login-window
    .login-box
      .btn-group.btn-group-block
        button(@click="switchToRegister" v-bind:class="registerButtonCls").btn Регистрация
        button(@click="switchToLogin" v-bind:class="loginButtonCls").btn Вход
      .form-group(v-if="win.mode == 'register'")
        p.text-error(v-if="registerStatus !== ''") {{ registerStatus }}
        .form-group(v-bind:class="registerUsernameCls")
          input#username-field.form-input(
            type="text"
            placeholder="Имя пользователя"
            v-model="registerUsername"
            @keyup.enter.exact="register"
          )
        .form-group(v-bind:class="registerEmailCls")
          input#email-field.form-input(
            type="text"
            placeholder="Электронная почта"
            v-model="registerEmail"
            @keyup.enter.exact="register"
          )
        .form-group(v-bind:class="registerPasswordCls")
          input#password-field.form-input(
            type="password"
            placeholder="Пароль"
            v-model="registerPassword"
            @keyup.enter.exact="register"
          )
        .form-group(v-bind:class="registerPasswordAgainCls")
          input#password-again-field.form-input(
            type="password"
            placeholder="Повторите пароль"
            v-model="registerPasswordAgain"
            @keyup.enter.exact="register"
          )
        button#register-button.btn(
          v-bind:class="createAccountButtonCls"
          @click="register"
        ) Создать аккаунт
      .form-group(v-else)
        p.text-error(v-if="loginStatus !== ''") {{ loginStatus }}
        .form-group
          input#username-field.form-input(
            type="text"
            placeholder="Имя пользователя"
            v-model="loginUsername"
            @keyup.enter.exact="authorize"
          )
        .form-group
          input#password-field.form-input(
            type="password"
            placeholder="Пароль"
            v-model="loginPassword"
            @keyup.enter.exact="authorize"
          )
        button#login-button.btn(
          v-bind:class="authorizeButtonCls"
          @click="authorize"
        ) Войти
</template>


<script>
  import requests from '../../requests'

  export default {
    name: 'auth',
    data () {
      return {
        win: this.$store.state.Auth.window,
        registerUsername: '',
        registerEmail: '',
        registerPassword: '',
        registerPasswordAgain: '',
        registerStatus: '',
        loginUsername: '',
        loginPassword: '',
        loginStatus: ''
      }
    },
    computed: {
      registerButtonCls () {
        return this.win.mode === 'login' ? [] : ['btn-primary', 'disabled']
      },
      loginButtonCls () {
        return this.win.mode === 'login' ? ['btn-primary', 'disabled'] : []
      },
      registerUsernameCls () {
        if (this.registerUsername === '') return []
        return this.checkUsername(this.registerUsername) === 'OK' ? ['has-success'] : ['has-error']
      },
      registerEmailCls () {
        if (this.registerEmail === '') return []
        return this.checkEmail(this.registerEmail) === 'OK' ? ['has-success'] : ['has-error']
      },
      registerPasswordCls () {
        if (this.registerPassword === '') return []
        return this.checkPassword(this.registerPassword) === 'OK' ? ['has-success'] : ['has-error']
      },
      registerPasswordAgainCls () {
        if (this.registerPassword === '' && this.registerPasswordAgain === '') return []
        return this.registerPassword === this.registerPasswordAgain ? ['has-success'] : ['has-error']
      },
      createAccountButtonCls () {
        if (
          this.checkUsername(this.registerUsername) === 'OK' &&
          this.checkEmail(this.registerEmail) === 'OK' &&
          this.checkPassword(this.registerPassword) === 'OK' &&
          this.registerPassword === this.registerPasswordAgain
        ) return ['btn-success']
        return ['disabled']
      },
      authorizeButtonCls () {
        if (
          this.checkUsername(this.loginUsername) === 'OK' &&
          this.checkPassword(this.loginPassword) === 'OK'
        ) return ['btn-primary']
        return ['disabled']
      }
    },
    methods: {
      switchToRegister () {
        this.$store.dispatch('registerMode')
      },
      switchToLogin () {
        this.$store.dispatch('loginMode')
      },
      checkUsername (username) {
        if (username === '') return 'Имя пользователя не может быть пустым'
        if (username.length > 30) {
          return 'Имя пользователя не должно быть длиннее 30 символов'
        }
        if (/^[^a-z]|[^a-z0-9]/i.test(username)) {
          return 'Имя пользователя должно содержать лишь латиницу и цифры и начинаться с буквы'
        }
        return 'OK'
      },
      checkEmail (email) {
        const emailRE = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
        if (!emailRE.test(email)) return 'Неправильный email'
        return 'OK'
      },
      checkPassword (password) {
        if (password.length < 6) return 'Пароль должен быть не короче 6 символов'
        if (password === '123456') return 'Вы — сама гениальность!'
        if (password === 'password') return 'Ваша фантазия не знает границ!'
        return 'OK'
      },
      register () {
        if (!this.createAccountButtonCls.some(cls => cls === 'disabled')) {
          requests.register({
            username: this.registerUsername,
            email: this.registerEmail,
            password: this.registerPassword
          })
            .then(res => {
              if (res && res.success === true) {
                this.$store.commit('CHOOSE_USER', this.registerUsername)
                this.$store.commit('RELOAD_CARDS', this.registerUsername)
                this.registerStatus = ''
              } else {
                this.registerStatus = 'Регистрация не удалась, попробуйте другие логин/email.'
              }
            })
            .catch(err => {
              this.registerStatus = 'Регистрация не удалась, попробуйте другие логин/email.'
              console.log(err)
            })
        }
      },
      authorize () {
        if (!this.authorizeButtonCls.some(cls => cls === 'disabled')) {
          requests.login({
            username: this.loginUsername,
            password: this.loginPassword
          })
            .then(res => {
              if (res.success && res.success === true) {
                this.$store.commit('CHOOSE_USER', this.loginUsername)
                this.$store.commit('RELOAD_CARDS', this.loginUsername)
                this.loginStatus = ''
                this.$store.dispatch('sync')
              } else {
                this.loginStatus = 'Неверные логин или пароль.'
              }
            })
            .catch(err => {
              this.loginStatus = 'Неверные логин или пароль.'
              console.log(err)
            })
        }
      }
    }
  }
</script>


<style lang="sass">
  @import '../../../css/variables.sass';

  .login-window
    position: fixed
    z-index: 999
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    background: rgba(255,255,255, 0.9)
    display: flex
    align-items: center
    justify-content: center
    button
      width: 100%
      margin-top: 1rem
    .login-box
      min-width: 16rem
    .btn-group
      margin-bottom: 1rem
</style>
