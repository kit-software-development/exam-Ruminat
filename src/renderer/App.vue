<template lang="pug">
  #app
    top-menu
    .main.columns.col-gapless
      cards-panel
      cards-content
</template>


<script>
  import TopMenu from '@/components/TopMenu'
  import CardsPanel from '@/components/CardsPanel'
  import CardsContent from '@/components/CardsContent'

  export default {
    name: 'chi',
    components: {
      TopMenu,
      CardsPanel,
      CardsContent
    }
  }
</script>


<style lang="sass">
  @import '../css/font-awesome.css'
  @import '../css/variables.sass'
  @import '../css/spectre.css'

  @font-face
    font-family: 'Noto Serif CJK'
    src: url("../../static/NotoSerifCJKjp-Regular.otf")
  @font-face
    font-family: 'Fira Sans'
    src: url("../../static/Fira Sans/FiraSans-Regular.ttf")
  @font-face
    font-family: "Fira Code Regular"
    src: url(../../static/FiraCode-Regular.ttf)
  
  *
    -webkit-box-sizing: border-box
    box-sizing: border-box
  
  h1, h2, h3, h4, h5, h6, p, li, input, div
    font-family: 'Fira Sans', Helvetica, Trebuchet MS, Verdana, 'Noto Serif CJK' !important

  pre, pre *, code, code *, .table-SQL, kbd
    font-family: "Fira Code Regular", "Fira Code", monospace, Consolas
    color: #0077AA
  kbd
    color: #F8F8F8
  button.full
    width: 100%
  button kbd
    background: rgba(0,0,0, 0.1)

  // input
  //   padding: 0.3rem
  //   height: 1.5rem

  .flex-center
    display: flex
    align-items: center
  .flex-all-center
    @extend .flex-center
    justify-content: center

  .top-menu
    height: 1.3rem
    padding: 0 0.5rem 0 0.5rem
  .top-menu, .menu-item
    display: flex
    align-items: center
    justify-content: space-between
  .top-menu div
    cursor: default
  .menu-item > div + div
    margin-left: 0.5rem
  
  .cards-panel, .cards-content
    height: calc(100vh - 1.3rem)
    padding: 0.5rem !important
    overflow-y: auto
 
  .delete
    color: $error-color
    width: 1rem
    height: 1rem
    @extend .flex-all-center

  .transparent
    opacity: 0
  .none
    display: none

  // Стили скролл-бара
  ::-webkit-scrollbar
    width: 0.35rem
  ::-webkit-scrollbar-track
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3)
    -webkit-border-radius: 10px
    border-radius: 10px
  ::-webkit-scrollbar-thumb
    -webkit-border-radius: 10px
    border-radius: 10px
    background: rgba(51, 51, 51, 0.8)
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5)
  ::-webkit-scrollbar-thumb:window-inactive
    background: rgba(51, 51, 51, 0.4)
</style>
