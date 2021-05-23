

if(navigator.serviceWorker){
    navigator.serviceWorker.register('./serviceWorker.js', { scope : '/blogs/read/'})
    .then(reg => console.log("Service Worker registered"))
    .catch(err => console.log("Error : " + err))
}
