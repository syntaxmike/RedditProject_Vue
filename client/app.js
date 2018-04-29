// Chat Component
const resultsComponent = {
    template: ` <div>
                  <ul class="collapsible">
                  <li v-for="data in results">
                    <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
                    <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
                  </li>
                  </ul>
               </div>`,
    props: ['results']
}

const searchButtonComponent = {
  template: `<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown button
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
  </div>
</div>`
}

//
// const socket = io()
const app = new Vue({
    el: '#reddit-app',
    data: {
        search: '',
        results: ['test'],
        previousSearches: []
    },
    methods: {
        // search: function () {
        //     if (!this.message)
        //         return
        //
        //     socket.emit('send-message', { message: this.message, user: this.user, avatar: 'https://robohash.org/'+this.user.name+'.png?set=set3' })
        // }
    },
    components: {
        'results-component': resultsComponent,
        'search-button-component': searchButtonComponent
        // 'chat-component': chatComponent,
        // 'duplicate-user-component':duplicateUserComponent,
        // 'welcome-component':welcomeComponent
    }
})
