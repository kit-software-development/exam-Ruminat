<template lang="pug">
  editor-content(:editor="editor")
</template>


<script>
  import { Editor, EditorContent } from 'tiptap'
  import {
    Heading,
    Bold,
    Italic,
    Underline,
    Link,
    HardBreak,
    ListItem,
    BulletList,
    OrderedList,
    Code,
    History,
    Placeholder
  } from 'tiptap-extensions'

  export default {
    name: 'cards-editor',
    components: { EditorContent },
    props: ['value'],
    data () {
      return {
        editor: new Editor({
          extensions: [
            new Heading({ levels: [1, 2, 3, 4, 5, 6] }),
            new Bold(),
            new Italic(),
            new Underline(),
            new Link(),
            new HardBreak(),
            new ListItem(),
            new BulletList(),
            new OrderedList(),
            new Code(),
            new History(),
            new Placeholder({
              emptyNodeClass: 'is-empty',
              emptyNodeText: 'Текст заметки',
              showOnlyWhenEditable: true
            })
          ],
          onUpdate: ({ getHTML }) => {
            this.$store.commit('CHANGE_TEXT', getHTML())
          }
        })
      }
    },
    mounted () {
      this.editor.setContent(this.value)
    },
    watch: {
      value (val) {
        if (val !== this.editor.getHTML()) {
          this.editor.setContent(val)
          this.$store.commit('CHANGE_TEXT', val)
        }
      }
    },
    computed: {
      currentCard () { return this.$store.state.Cards.currentCard }
    },
    beforeDestroy () { this.editor.destroy() }
  }
</script>


<style lang="sass">
  @import '../../../css/variables.sass'

  .ProseMirror
    min-height: 15rem
    padding: 0.5rem
    line-height: 1rem
    border: 0.5px solid #A9A9A9
    color: $body-font-color
    p
      margin: 0
    
    li
      margin: 0
      p
        display: inline

  .ProseMirror p.is-empty:first-child::before
    content: attr(data-empty-text)
    float: left
    color: #aaa
    pointer-events: none
    height: 0
</style>
