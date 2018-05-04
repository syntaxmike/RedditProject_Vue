module.exports = (server) => {
    const
        axios = require("axios")
        io = require('socket.io')(server),
        moment = require('moment')
        url = "https://www.reddit.com"

    const searchHistory = []


    const searchResult = (data, callback) => {

        const result = {
            title: data.display_name,
            desc: data.public_description,
            img: data.icon_img,
            link: url + data.url
        }

        if(result.img == ""){
            result.img = 'https://c1.staticflickr.com/6/5567/31437486496_cf5cab625e_b.jpg'
        }

         callback(result)

    }

    const threadsResult = (data, callback) => {
        const result = {
            title: data.title,
            author: data.author,
            up: data.ups,
            numComments: data.num_comments,
            link: url + data.permalink,
            image: data.thumbnail
        }

        if(result.image == "self"){
            result.image = 'https://c1.staticflickr.com/6/5567/31437486496_cf5cab625e_b.jpg'
        }

        if(result.title > 145){
            result.title = result.title.slice(0, 145) + "..."
        }



         callback(result)
    }

        io.on('connection', socket => {

            //Returns a list of sub-reddits related to search
            socket.on('search', search => {

                const searchResults = []

                axios.get(url + `/subreddits/search.json?limit=10&q=${search}`)
                    .then(function (response) {
                        for(let index in response.data.data.children){

                            searchResult(response.data.data.children[index].data, (result) => {
                                searchResults.push(result)
                            })

                        }
                    })
                    .then(() => {
                        searchHistory.push({[search]: searchResults})
                        io.emit('search-Results', searchResults)
                    })
                    .catch((error) => {
                        io.emit('error-api', error)
                    })

            })

            //Returns topics from sub reddit after a sub reddit is chosen
            socket.on('threads-inSubReddit', chosenReddit => {

                const redditTopics = []
                
                axios.get(url + `/r/${chosenReddit}/.json?limit=8`)
                    .then(function (response) {
                        for(let index in response.data.data.children){

                            threadsResult(response.data.data.children[index].data, (result) => {
                                redditTopics.push(result)
                            })

                        }
                    })
                    .then(() => {
                        searchHistory.push({[chosenReddit]: redditTopics})
                        io.emit("subreddit-threads", redditTopics)
                    })
                    .catch((error) => {
                        io.emit('error-api', error)
                    })


            })

            //Return a list of popular sub reddits, however it takes no parameter
            socket.on("popular", pop => {

                const popularSubReddit = []

                axios.get(url + `/subreddits/popular.json?limit=10&count=10`)
                    .then(function (response) {
                        for(let index in response.data.data.children){

                            searchResult(response.data.data.children[index].data, (result) => {
                                popularSubReddit.push(result)
                            })

                        }
                    })
                    .then(() => {
                        searchHistory.push({pop: popularSubReddit})
                        io.emit("reddit-popular", popularSubReddit)

                    })
                    .catch((error) => {
                        io.emit('error-api', error)
                    })

            })

            //Check if a username is available, returns true or false.
            socket.on("user-name", userName => {
                
                axios.get(url + `/api/username_available.json?user=${userName}`)
                    .then(function (response) {
                        searchHistory.push({[userName]: response.data})
                        io.emit("isAvailable", response.data)
                    })
                    .catch((error) => {
                        io.emit('error-api', error)
                    })

            })

            //previous search
            socket.on("previous-searches", prevSearch => {
                searchHistory.forEach((element) =>{
                    return searchHistory[element][prevSearch]
                })
            })

        })

}
