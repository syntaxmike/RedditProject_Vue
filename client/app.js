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

                  <div v-bind:id="index" class="collapse" aria-labelledby="heading{{index}}" data-parent="#accordion">
                    <div class="card-body">
                    <img :src="result.image" class="rounded float-left" width="100">
                      <p><span v-html="result.description"></span>
                      <a :href="result.url" target="_blank">{{result.url}}</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>`,
    props: ['data']
}

const searchButtonComponent = {
  template: `<div class="input-group">
              <input type="text" ref="searchInput" class="form-control" aria-label="Text input with dropdown button">
              <div class="input-group-append">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Type of Search</button>
                <div class="dropdown-menu">
                  <button class="dropdown-item" v-for="button in buttons" v-on:click="button.action" :id="button.id">{{button.text}}</button>
                </div>
              </div>
            </div>`,
props: ['buttons']
}


const socket = io()
const app = new Vue({
    el: '#reddit-app',
    data: {
        search: '',
        results: [],
        previousSearches: [],
        searchButtons: [{action:'searchSubreddit', id:'subreddit', text:'Search Subreddits'}, {action:'searchUser', id:'user', text:'Search User'}]
    },
    methods: {
      searchSubreddit: function () {
        console.log(this.$refs.searchInput.value)
              if (!this.$refs.searchInput.value)
                  return

              socket.emit('search', this.$refs.searchInput.value)
          },
      searchTopic: function () {
        console.log(this.$refs.searchInput.value)
              if (!this.$refs.searchInput.value)
                  return

              socket.emit('threads-inSubReddit', this.$refs.searchInput.value)
          },
      searchUser: function () {
        console.log(this.$refs.searchInput.value)
              if (!this.$refs.searchInput.value)
                  return

              socket.emit('user-name', this.$refs.searchInput.value)
          },
      popular: function () {
              socket.emit('popular', null)
          }
    },
    components: {
        'results-component': resultsComponent,
        'search-button-component': searchButtonComponent
    }
})


// Client Side Socket Event

socket.on('search-Subreddit', search => {

  app.results = []

  search.forEach(function(element) {
    console.log(element);
    const title = element.title;
    const header = element.public_description;
    const tempObj = {title: title, description: header};
    app.results.push(tempObj)
  });

})

/*Returns an array of objects of sub reddit data
  ex: {hide_ads: false, banner_img: something, id: "fjd2k", ...}
*/
socket.on('search-Results', search => {
  app.results = []

  search.forEach(function(element) {
    const title = element.title;
    const header = element.desc;
    const url = element.url;
    const img = element.img;

    const tempObj = {title: title, description: header, url: url, image: img};
    app.results.push(tempObj)
  });
})

/*Returns an array of objects topics within subreddit, possibly display in collapse of UI in unordered list
 * ex: {title: "Steam", author: "Me", upvotes: -1, ...}
*/
socket.on('subreddit-threads', redditTopics => {

  app.results = []

  redditTopics.forEach(function(element) {

    const title = element.title;
    const header = "Author: "+element.author+"<br># of comments: "+element.comments+"<br># of upvotes: "+element.upvotes+"<br>";
    const url = element.url;
    const img = element.image;

    const tempObj = {title: title, description: header, url: url, image: img};
    app.results.push(tempObj)
  });

})

/*Returns an array of objects topics  of popular sub reddit data
  ex: {hide_ads: false, banner_img: something, id: "fjd2k", ...}
*/
socket.on('reddit-popular', popular => {

  app.results = []

  popular.forEach(function(element) {

    const title = element.title;
    const header = element.desc;
    const url = element.url;
    const img = element.img;

    const tempObj = {title: title, description: header, url: url, image: img};
    app.results.push(tempObj)
  });

})

/*Returns a boolean
  ex: true
*/
socket.on('isAvailable', response => {
  console.log(response)
  app.results = []

  if(response){
    console.log("Username is available.")
    app.results.push({title: "Username is available."})
  }else{
    console.log("Username is not available.")
    app.results.push({title: "Username is not available."})
  }
})
