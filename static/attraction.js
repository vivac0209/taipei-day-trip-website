let test = location.href;
console.log(test)
let urlID = test.split('/')[4];


let url = `/api/attraction/`+ urlID


let searchId = document.getElementById("searchView");
fetch(url)
        .then((response)=> {
            return response.json();
        })
        .then((jsonData)=>{
            console.log(jsonData);
            let searchData = jsonData;
            searchId.textContent = searchData;

        })