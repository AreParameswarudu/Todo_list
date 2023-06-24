exports.getDate = getDate

function getDate() {
    let today = new Date()
    let options ={
       weekend:"long",
       year:"numeric",
       month:"long",
       day:"numeric"
    }
    
    return today.toLocaleDateString("en-US",options)  
}

exports.getTime = getTime

function getTime() {
   let time =  new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })
   return time
}
