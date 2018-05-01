module.exports = (server) => {
    const
        axios = require("axios")
        io = require('socket.io')(server),
        moment = require('moment')
        url = "https://www.reddit.com"


        io.on('connection', socket => {


            //Returns a list of sub-reddits related to search
            socket.on('search', search => {

                const searchResults = []
                axios.get(url + `/subreddits/search.json?limit=10&q=${search}`)
                    .then(function (response) {
                        for(let index in response.data.data.children){
                            const
                                title = response.data.data.children[index].data.display_name,
                                desc = response.data.data.children[index].data.public_description,
                                img = response.data.data.children[index].data.icon_img,
                                link = url + response.data.data.children[index].data.url


                            if (img == ""){
                                
                                searchResults.push(
                                    {title:title,
                                    desc: desc,
                                    img: 'https://c1.staticflickr.com/6/5567/31437486496_cf5cab625e_b.jpg',
                                    url: link})

                            }else{

                                searchResults.push(
                                    {title:title,
                                    desc: desc,
                                    img: img,
                                    url: link})
                            }

                        }
                    })
                    .then(() => {
                        io.emit('search-Results', searchResults)
                    })

            })


            //Returns topics from sub reddit after a sub reddit is chosen
            socket.on('threads-inSubReddit', chosenReddit => {

                const redditTopics = []
                
                axios.get(url + `/r/${chosenReddit}/.json?count=10`)
                    .then(function (response) {
                        for(let index in response.data.data.children){
                            const
                                author = response.data.data.children[index].data.author,
                                up = response.data.data.children[index].data.ups,
                                numComments = response.data.data.children[index].data.num_comments,
                                link = url + response.data.data.children[index].data.permalink,
                                image = response.data.data.children[index].data.thumbnail,
                                title = response.data.data.children[index].data.title

                                if (image == "self"){

                                    redditTopics.push(
                                        {title:title,
                                         author: author,
                                        upvotes: up,
                                        comments: numComments,
                                        url: link,
                                        image: 'https://c1.staticflickr.com/6/5567/31437486496_cf5cab625e_b.jpg'})
                                }else{

                                    redditTopics.push(
                                        {title:title,
                                         author: author,
                                        upvotes: up,
                                        comments: numComments,
                                        url: link,
                                        image: image})

                                }
                        }
                    })
                    .then(() => {
                        io.emit("subreddit-threads", redditTopics)
                    })


            })



            //Return a list of popular sub reddits, however it takes no parameter
            socket.on("popular", pop => {

                const popularSubReddit = []

                axios.get(url + `/subreddits/popular.json`)
                    .then(function (response) {
                        for(let index in response.data.data.children){
                            const
                                title = response.data.data.children[index].data.display_name,
                                desc = response.data.data.children[index].data.public_description,
                                img = response.data.data.children[index].data.icon_img,
                                link = url + response.data.data.children[index].data.url


                            if (img == ""){

                                popularSubReddit.push(
                                    {title:title,
                                    desc: desc,
                                    img: 'https://c1.staticflickr.com/6/5567/31437486496_cf5cab625e_b.jpg',
                                    url: link})

                            }else{

                                popularSubReddit.push(
                                    {title:title,
                                    desc: desc,
                                    img: img,
                                    url: link})
                            }
                        }
                    })
                    .then(() => {

                        io.emit("reddit-popular", popularSubReddit)

                    })

            })

            //Check if a username is available, returns true or false.
            socket.on("user-name", userName => {
                
                axios.get(url + `/api/username_available.json?user=${userName}`)
                    .then(function (response) {
                            io.emit("isAvailable", response.data)
                    })

            })

        })

}
