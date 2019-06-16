import moment from 'moment'
import _ from 'lodash'
import Store from 'electron-store'

// import requests from '../../requests'

const store = new Store()

moment.locale('ru')

// время ожидания следующего повторения в часах
const defaultGoodWait = 4 // при правильном   ответе (потом умножается на 2)
const defaultBadWait = 2 //  при неправильном ответе

const username = store.get('username') || ''
const cards = store.get(`${username}.cards`) || []

const state = {
  cards,
  username,
  currentCard: null,
  learning: false,
  publicView: false,
  publicCards: []
}

function terms2String (terms) {
  if (terms.length === 0) return ''
  return terms.reduce((acc, term) => `${acc}${term.value}${term.definition}`, '')
}

const mutations = {
  CHOOSE_CARD (state, card) {
    // Проверяем, есть ли текущая каточка
    if (state.currentCard) {
      // Проверяем, пуста ли текущая каточка, если да, то удаляем её
      if ([ // проверяем, что каждое поле пусто
        state.currentCard.title,
        state.currentCard.tags,
        terms2String(state.currentCard.terms)
      ].every((item) => item.trim() === '')) {
        let deleteIndex = state.cards.findIndex(card => card.ID === state.currentCard.ID)
        if (deleteIndex !== -1) state.cards.splice(deleteIndex, 1)
      }
    }
    state.currentCard = card
    state.learning = false
  },
  TOGGLE_PUBLIC_VIEW (state) {
    state.publicView = !state.publicView
    state.currentCard = null
  },
  CHANGE_TITLE (state, title) {
    if (state.currentCard.title !== title) {
      state.currentCard.changed = new Date()
    }
    state.currentCard.title = title
  },
  CHANGE_TAGS (state, tags) {
    if (state.currentCard.title !== tags) {
      state.currentCard.changed = new Date()
    }
    state.currentCard.tags = tags
  },
  CHANGE_TERM_VALUE (state, {ID, val}) {
    let terms = state.currentCard.terms
    let i = terms.findIndex(term => term.ID === ID)
    if (terms[i].value !== val) {
      terms[i].value = val
      state.currentCard.changed = new Date()
    }
  },
  CHANGE_TERM_DEFINITION (state, {ID, val}) {
    let terms = state.currentCard.terms
    let i = terms.findIndex(term => term.ID === ID)
    if (terms[i].definition !== val) {
      terms[i].definition = val
      state.currentCard.changed = new Date()
    }
  },
  DELETE_TERM (state, ID) {
    let terms = state.currentCard.terms
    let i = terms.findIndex(term => term.ID === ID)
    terms.splice(i, 1)
  },
  ADD_TERM (state) {
    if (state.currentCard) {
      let ID = state.currentCard.terms.length > 0
        ? _.last(state.currentCard.terms).ID + 1
        : 1
      state.currentCard.terms.push({ID, value: '', definition: ''})
    }
  },
  TOGGLE_PUBLIC (state) {
    state.currentCard.changed = new Date()
    state.currentCard.public = !state.currentCard.public
  },
  COPY_CARD (state, card) {
    // Добавляем новую каточку в конец, ID = max(ID) + 1
    let ID = state.cards.length === 0
      ? 1
      : state.cards[state.cards.length - 1].ID + 1
    state.cards.push({
      ID,
      title: card.title,
      tags: card.tags,
      terms: card.terms,
      author: card.author,
      created: (new Date()).toJSON(),
      changed: (new Date()).toJSON(),
      public: false
    })
  },
  NEW_CARD (state, author) {
    // Добавляем новую каточку в конец, ID = max(ID) + 1
    let ID = state.cards.length === 0
      ? 1
      : state.cards[state.cards.length - 1].ID + 1
    state.cards.push({
      ID,
      title: '',
      tags: '',
      terms: [{ID: 1, value: '', definition: ''}],
      author,
      created: (new Date()).toJSON(),
      changed: (new Date()).toJSON(),
      public: false
    })
  },
  RELOAD_CARDS (state, username) {
    state.username = username
    state.cards = store.get(`${username}.cards`) || []
  },
  DELETE_CARD (state, ID) {
    // Ищем каточку с ID из параметра, если находим, то удаляем
    let deleteIndex = state.cards.findIndex(card => card.ID === ID)
    // Если удаляем текущую каточку
    if (state.currentCard && state.currentCard.ID === ID) state.currentCard = null
    if (deleteIndex !== -1) {
      state.cards.splice(deleteIndex, 1)
      store.set(`${state.username}.cards`, state.cards)
    }
  },
  // Удалить пустые термины в карточках
  CLEAN_CARDS (state) {
    for (let card of state.cards) {
      card.terms = card.terms.filter((term) =>
        term.value.trim() !== '' &&
        term.definition.trim() !== ''
      )
    }
  },
  SAVE_CARDS (state) {
    store.set(`${state.username}.cards`, state.cards)
  },
  LEARN_CARD (state) {
    if (state.currentCard) state.learning = true
  },
  // увеличить время ожидания для доступа к термину
  INCREASE_WAITING (state, {ID, type}) {
    let card = state.currentCard
    if (card) {
      let index = card.terms.findIndex(term => term.ID === ID)
      let term = card.terms[index]
      let waiting = type === 'bad' ? defaultBadWait : defaultGoodWait
      term.waiting = !term.waiting
        ? waiting
        : (type === 'bad' ? waiting : term.waiting * 2)
      term.avaliableDate = moment(new Date()).add(term.waiting, 'hours').toJSON()
    }
  }
}

const actions = {
  chooseCard ({ commit }, card) {
    commit('CHOOSE_CARD', card)
    commit('CLEAN_CARDS')
    store.set(`${state.username}.cards`, state.cards)
  },
  newCard ({ commit }, author) {
    commit('NEW_CARD', author)
    commit('CHOOSE_CARD', state.cards[state.cards.length - 1])
  },
  saveCards ({ commit }) {
    commit('CLEAN_CARDS')
    store.set(`${state.username}.cards`, state.cards)
  },
  togglePublicView ({ commit }) {
    commit('TOGGLE_PUBLIC_VIEW')
  },
  copyCard ({ commit }, card) {
    console.log('card', card)
    commit('COPY_CARD', card)
    commit('SAVE_CARDS')
    commit('CHOOSE_CARD', _.last(state.cards))
  },
  sync ({ commit }) {
    console.log('sync')
    // requests.syncTest(state.username, state.cards)
    //   .then(res => {
    //     console.log(res)
    //     // если нужно отправить каточки на сервер
    //     if (res.needed_cards && res.needed_cards.length > 0) {
    //       console.log('trying to send cards', res.needed_cards)
    //       requests.sendCards(
    //         state.username,
    //         state.cards.filter(card => res.needed_cards.includes(card.ID))
    //       )
    //         .then(console.log)
    //     }
    //     // если есть каточки, которые есть на сервере, но нет у нас
    //     if (res.sync_cards && res.sync_cards.length > 0) {
    //       console.log('got new cards ', res.sync_cards)
    //       for (let card of res.sync_cards) commit('COPY_CARD', card)
    //     }
    //     commit('SAVE_CARDS')
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }
}

const getters = {
  // main() { return state.main }
}

export default {
  state,
  mutations,
  actions,
  getters
}
