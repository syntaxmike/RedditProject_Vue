Vue.config.devtools = true

// Chat Component
const resultsComponent = {
    template: `<div class="accordion" id="accordion">
                <div class="card" v-for="(result, index) in data">
                  <div class="card-header" id="headingindex">
                    <h5 class="mb-0">
                      <button class="btn btn-link" type="button" data-toggle="collapse" v-bind:data-target="'#' + index">
                        {{result.title}}
                      </button>
                    </h5>
                  </div>

                  <div v-bind:id="index" class="collapse show" aria-labelledby="heading{{index}}" data-parent="#accordion">
                    <div class="card-body">
                      {{result.description}}
                    </div>
                  </div>
                </div>
              </div>`,
    props: ['data']
}

const searchButtonComponent = {
  template: `<div class="input-group">
              <input type="text" class="form-control" aria-label="Text input with dropdown button">
              <div class="input-group-append">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Type of Search</button>
                <div class="dropdown-menu">
                  <button class="dropdown-item" v-for="button in buttons" href="#">{{button}}</button>
                </div>
              </div>
            </div>`,
props: ['buttons']
}

//
// const socket = io()
const app = new Vue({
    el: '#reddit-app',
    data: {
        search: '',
        results: [{title:"Result", description:"Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS."},{title:"Resultado", description:"Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS."}],
        previousSearches: [],
        searchButtons: ['Search Subreddits', 'Search User']
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
