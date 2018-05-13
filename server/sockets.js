module.exports = (server) => {
    const
        axios = require("axios")
        io = require('socket.io')(server),
        moment = require('moment'),
        url = "https://www.reddit.com"

    const searchHistory = []

    const defaultFields = {
        title: "",
        author: "",
        desc: "",
        image: "",
        link: "",
        up: 0,
        num_comments: 0
    }


    const formatSearchResult = (data, callback) => {

        const result = Object.assign({}, defaultFields)

        result.title = (data.display_name != undefined) ? data.display_name : (data.title.length > 135) ? data.title.slice(0, 135) + "..." : data.title
        result.author = data.author
        result.desc = data.public_description == "" ? data.description : data.public_description
        result.image = data.icon_img == "" ? 'https://c1.staticflickr.com/6/5567/31437486496_cf5cab625e_b.jpg' : data.icon_img
        result.url = data.permalink != undefined ? url + data.permalink : url + data.url
        result.upvotes = data.ups
        result.comments = data.num_comments

        if(result.image === undefined)
            result.image = data.thumbnail == "self" ? 'https://c1.staticflickr.com/6/5567/31437486496_cf5cab625e_b.jpg' : data.thumbnail

         callback(result)

    }

        io.on('connection', socket => {

            //Returns a list of sub-reddits related to search
            socket.on('search', search => {

                const searchResults = []
                const modHash = {modHash:""}

                axios.get(url + `/subreddits/search.json?limit=10&q=${search}`)
                    .then(function (response) {

                        modHash.modHash = response.data.data.after

                        for(let index in response.data.data.children){

                            formatSearchResult(response.data.data.children[index].data, (result) => {
                                searchResults.push(result)
                            })
                        }

                    })
                    .then(() => {
                        searchHistory.push({id:`${search}`, type: modHash.modHash,  value: searchResults})
                        io.emit('search-Results', searchResults)
                        io.emit("update-previous", {id:`${search}`, type: modHash.modHash, value: searchResults})
                    })
                    .catch((error) => {
                        io.emit('error-api', error)
                    })
                    

            })

            //Returns topics from sub reddit after a sub reddit is chosen
            socket.on('threads-inSubReddit', chosenReddit => {

                const redditTopics = []
                const modHash = {modHash:""}

                axios.get(url + `/r/${chosenReddit}/.json?limit=8`)
                    .then(function (response) {
                        modHash.modHash = response.data.data.after

                        for(let index in response.data.data.children){

                            formatSearchResult(response.data.data.children[index].data, (result) => {
                                redditTopics.push(result)
                            })

                        }

                    })
                    .then(() => {
                        searchHistory.push({id:`${chosenReddit}`, type: modHash.modHash, value: redditTopics})
                        io.emit("subreddit-threads", redditTopics)
                        io.emit("update-previous", {id:`${chosenReddit}`, type: modHash.modHash, value: redditTopics})
                    })
                    .catch(function (error){
                        io.emit('error-api', error)
                    })
                    


            })

            //Return a list of popular sub reddits, however it takes no parameter
            socket.on("popular", pop => {


                const popularSubReddit = []
                const modHash = {modHash:""}

                axios.get(url + `/subreddits/popular.json?limit=10&count=10`)
                    .then(function (response) {
                        modHash.modHash = response.data.data.after
                        for(let index in response.data.data.children){

                            formatSearchResult(response.data.data.children[index].data, (result) => {
                                popularSubReddit.push(result)
                            })

                        }
                    })
                    .then(() => {
                        searchHistory.push({id: `${pop}`, type: modHash.modHash, value: popularSubReddit})
                        io.emit("reddit-popular", popularSubReddit)
                        io.emit("update-previous", {id: `${pop}`, type: modHash.modHash, value: popularSubReddit})

                    })
                    .catch((error) => {
                        io.emit('error-api', error)
                    })
                    

            })

            //Check if a username is available, returns true or false.
            socket.on("user-name", userName => {
                const user = []
                
                axios.get(url + `/api/username_available.json?user=${userName}`)
                    .then(function (response) {
                        user.push(response.data)
                    })
                    .then(() => {
                        io.emit("isAvailable", user)
                    })
                    .catch((error) => {
                        io.emit('error-api', error)
                    })

            })

            //previous search
            socket.on("get-prevSearches", history => {
                searchHistory.forEach(element => {
                    if(element.id == history.name && history.mod === element.type){
                            io.emit("return-prev", element.value)
                    }
                    
                });
            })

        })

}
