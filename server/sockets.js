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
                        for(let index in response.data.children){
                            searchResults.push(response.data.children[index].data)
                        }
                    })
    
                 io.emit('search-Results', search)
            })

            
            //Returns topics from reddit, top/hot do not work or return private
            socket.on('searchSub', chosenReddit => {
                const topics = []
                axios.get(url + `r/${chosenReddit}/.json?count=20`)
                    .then(function (response) {
                        for(let index in idResult.data.children){
                            const 
                                author = idResult.data.children[index].data.author,
                                size = idResult.data.children[index].data.title.length,
                                up = idResult.data.children[index].data.ups,
                                numComments = idResult.data.children[index].data.num_comments,
                                link = idResult.data.children[index].data.permalink
            
                            if(size > 220){
                                const title = idResult.data.children[index].data.title.slice(0, 220) + "..."
                            }else{
                                const title = idResult.data.children[index].data.title
                            }
            
            
                            topics.push(
                                ["Title: " + title
                                +"\nAuthor: " + author
                                +"\nUpvotes: " + up
                                +"\n# of Comments: " + numComments
                                +"\nUrl to comments: www.reddit.com" +  link])
                        }
                    })

                io.emit("reddit-Topics", redditTopics)
            })



            //Return a list of popular sub reddit names, however it takes no parameter
            socket.on("popular", pop => {

                const popularSubReddit = []
                axios.get(url + `subreddits/popular.json`)
                    .then(function (response) {
                        for(let index in results.data.children){
                            popularSubReddit.push(results.data.children[index].data)
                        }
                    })

                io.emit("reddit-popular", popularSubReddit)

            })

            //Check if a username is available, returns true or false.
            socket.on("user-name", userName => {

                axios.get(url + `api/username_available.json?user=${userName}`)
                    .then(function (response) {
                        io.emit("isAvailable", response)
                    })

            })
            
        })

}