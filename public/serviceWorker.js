

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open('v1')
        .then(cachV1 => {
            return cachV1.addAll([
                "/recoveryFile.html",
                "/blogs/read/css/readBlog.css",
                "/blogs/read/css/bootstrap.min.css",
                "/blogs/read/js/jquery.js",                
                "/blogs/read/js/bootstrap.min.js",
                "/blogs/read/fontawesome/css/all.css",
                "/blogs/read/images/1.jpg",
                "/blogs/read/images/2.jpg",
                "/blogs/read/images/3.jpg",
                "/blogs/read/images/4.jpg",
                "/blogs/read/images/5.jpg",
                "/blogs/read/images/6.jpg",
                "/blogs/read/images/7.jpg",
                "/blogs/read/images/8.jpg",
                "/blogs/read/images/9.jpg",
                "/blogs/read/images/10.jpg",
                "/blogs/read/images/11.jpg",
                "/blogs/read/images/12.jpg",
                "/blogs/read/images/13.jpg"
            ])
        })
        .catch(err => console.log("Error : " + err))
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then(cachedResponse => {
            return (cachedResponse ||  
                fetch(event.request)
                .then(response => {
                    const clonedRes= response.clone();
                    
                    caches.open('v1')
                    .then(cachV1 => {
                        return cachV1.put(event.request, clonedRes);
                    })
                    return response;
                })
            )
        })
        .catch(err => caches.match("/recoveryFile.html"))
    );
})