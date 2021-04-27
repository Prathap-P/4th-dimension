

if(navigator.serviceWorker){
    navigator.serviceWorker.register('./serviceWorker.js', { scope : '/blogs/'})
    .then(reg => console.log("Service Worker registered " + reg.scope))
    .catch(err => console.log("Error : " + err))
}
