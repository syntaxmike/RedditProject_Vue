module.exports = (server) => {
    const
        axios = require("axios")
        io = require('socket.io')(server),
        moment = require('moment')
        url = "https://www.reddit.com/"


        io.on('connection', socket => {


            //User search by topic
            socket.on('search', search => {


                const searchResults = []
                axios.get(url + `subreddits/search.json?limit=20&q=${search}`)
                    .then(function (response) {
                        for(let index in response.data.data.children){
                            searchResults.push(response.data.data.children[index].data)
                        }
                    })
                    .then(() => {
                        io.emit('search-Results', searchResults)
                    })

            })


            //Returns topics from reddit, top/hot do not work or return private
            socket.on('searchSub', chosenReddit => {

                const redditTopics = []
                axios.get(url + `r/${chosenReddit}/.json?count=20`)
                    .then(function (response) {
                        for(let index in response.data.data.children){
                            const
                                author = response.data.data.children[index].data.author,
                                size = response.data.data.children[index].data.title.length,
                                up = response.data.data.children[index].data.ups,
                                numComments = response.data.data.children[index].data.num_comments,
                                link = response.data.data.children[index].data.permalink,
                                title = response.data.data.children[index].data.title


                            redditTopics.push(
                                {title:title,
                                 author: author,
                                upvotes: up,
                                comments: numComments,
                                url: link})
                        }
                    })
                    .then(() => {
                        io.emit("reddit-Topics", redditTopics)
                    })


            })



            //Return a list of popular sub reddit names, however it takes no parameter
            socket.on("popular", pop => {

                const popularSubReddit = []

                axios.get(url + `subreddits/popular.json`)
                    .then(function (response) {
                        for(let index in response.data.data.children){
                            popularSubReddit.push(response.data.data.children[index].data)

                        }
                    })
                    .then(() => {

                        io.emit("reddit-popular", popularSubReddit)

                    })

            })

            //Check if a username is available, returns true or false.
            socket.on("user-name", userName => {
                console.log(userName)
                axios.get(url + `api/username_available.json?user=${userName}`)
                    .then(function (response) {
                        io.emit("isAvailable", response)
                    })

            })

        })

}
