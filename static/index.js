

let view = document.getElementById("viewData");
let url = `http://127.0.0.1:5000/api/attractions`;

fetch(url,{})
        .then((response)=> {
            return response.json();
        })
        .then((jsonData)=>{
            console.log(jsonData);
            let viewData = jsonData;
            view.textContent = viewData;

        })