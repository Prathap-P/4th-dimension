

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open('v1')
        .then(cachV1 => {
            return cachV1.addAll([
                "/blogs/",
                "/blogs/css/bootstrap.min.css",
                "/blogs/allBlogs.css",                
                "/blogs/js/jquery.js",                
                "/blogs/js/bootstrap.min.js",
                "/blogs/images/1.jpg",
                "/blogs/images/2.jpg",
                "/blogs/images/3.jpg",
                "/blogs/images/4.jpg",
                "/blogs/images/5.jpg",
                "/blogs/images/6.jpg",
                "/blogs/images/7.jpg",
                "/blogs/images/8.jpg",
                "/blogs/images/9.jpg",
                "/blogs/images/10.jpg",
                "/blogs/images/11.jpg",
                "/blogs/images/12.jpg",
                "/blogs/images/13.jpg"
            ])
        })
        .catch(err => console.log("Error : " + err))
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then(cachedResponse => {
            return (cachedResponse ||  fetch(event.request)
                .then(response => {
                    caches.open('v1')
                    .then(cachV1 => cachV1.put(event.request, response.clone()))
                    return response;
                })
            )
        })
        .catch(err => console.log("Error : " + err))
    );
})