function messageAllClients(message) {
return self.clients.matchAll().then(clients => {
  clients.forEach(client => client.postMessage(message));
})
}

const cacheName = "beginner-javascript-tutorial"
const waitOnFirstLoad = 0 //Milliseconds to wait before fetching items on preload list. Helps prevent duplicate requests on first load.

//Array of items to try and preload on install (the serviceWorker will install without them preloaded). Can be exact or relative to serviceWorker scope
const preloadList = [
    "",
    "editor.html",
	"codemirror-5.42.0/lib/codemirror.js",
	"codemirror-5.42.0/lib/codemirror.css",
	"codemirror-5.42.0/mode/htmlmixed/htmlmixed.js",
	"codemirror-5.42.0/mode/xml/xml.js",
	"codemirror-5.42.0/mode/javascript/javascript.js",
	"codemirror-5.42.0/mode/css/css.js",
    "lesson1.html",
    "lesson1a.html",
    "lesson1b.html",
    "lesson1c.html",
    "lesson2.html",
    "lesson3.html",
    "lesson4.html",
    "lesson4a.html",
    "lesson5.html",
    "lesson6.html",
    "lesson7.html",
    "lesson8.html",
    "lesson9.html",
    "lesson10.html",
    "lesson11.html",
    "lesson12.html",
    "lesson13.html",
    "lesson14.html",
    "lesson15.html"
]

function rebaseURL(url) {
    //Fills in relative URLs using the serviceWorker scope
    return (new URL(url, registration.scope)).href
}

function activateHandler(event) {
    event.waitUntil((async function() {

        //Allow requests by the page to get into browser cache, so that we don't sent 2 requests for the same thing.
        await new Promise((resolve, reject) => {
            setTimeout(resolve, waitOnFirstLoad)
        })

        const cache = await caches.open(cacheName)
        let requests = []
        for (let index in preloadList) {
            let url = rebaseURL(preloadList[index])
            requests.push(fetch(url))
        }
        for (let index in requests) {
            let request = requests[index]
            try {
                let response = await request
                await cache.put(response.url, response)
            }
            catch(e) {
                console.error(e)
            }
        }
    })())
}



self.addEventListener("activate", activateHandler)






//Milliseconds to wait for network response before using cache
//When set to 0, cached data will be returned immediately, and cache will be updated in background.
const defaultWaitPeriod = 2500


function fetchHandler(event) {
    event.respondWith((async function(){
		let waitperiod = defaultWaitPeriod

        let cache = await caches.open(cacheName)

        let url = event.request.url

        let fromcache = await caches.match(url)

		
		let fromnetwork = fetch(event.request)
		
        if (!fromcache) {
            //No cache. All we can do is return network response
            let response = await fromnetwork
            await cache.put(url, response.clone())
            return response
        }
        else {

            //We have cached data			
            return new Promise(function(resolve, reject){

				let served = 0

                //If the fetch event fails (ex. offline), return cached immediately
                fromnetwork.catch(function(e){
					messageAllClients(url + " errored. Using cache.")
					if (!served) {
						served = 1
						resolve(fromcache)
					}
                })

				//Fetch from network and update cache
                fromnetwork.then(function(response){
					let otherServed = served
					served = 1
                    cache.put(url, response.clone()).then(() => {
						if (otherServed) {
							if (url.includes("waterservices.usgs.gov")) {
								usgsDataUpdated = Date.now()
							}
							messageAllClients("Updated cache for " + url)
						}
						else {
							messageAllClients(url + " has been loaded from the network")
						}
						resolve(response)
					})
                })
				
				
                    //If the network doesn't respond quickly enough, use cached data
                    setTimeout(function(){
						if (!served) {
							served = 1
                        	messageAllClients(url + " took too long to load from network. Using cache")
							resolve(fromcache)
						}
                    }, waitperiod)
                })
            }
    }()))
}

self.addEventListener("fetch", fetchHandler)
