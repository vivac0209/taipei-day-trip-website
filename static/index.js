

let page = 0;
let flag = false;


const getaAttractions=() =>{
    if (flag != true){
        let keyword = document.getElementById("queryView").value;
    let pageUrl;
    if (keyword != "" && page != null){
        pageUrl= `/api/attractions?page=${page}&keyword=${keyword}`;
    }
    else if (page != null){
        pageUrl = `/api/attractions?page=${page}`;
    }
    flag = true;
    fetch(pageUrl)
        .then((response)=> {
            return response.json();
        })
        .then((jsonData)=>{
            // console.log("test");
            //console.log(jsonData);
            let viewData = jsonData.data;
            let nextPage = jsonData.nextPage;
            let Length = Object.keys(viewData).length;
            if (Length != 0){
                createDiv(viewData,nextPage);
                flag = false;
                loadAction();
            }else {
                searchNo();   
            }
            page = nextPage;
        })
        // .then(()=>{
        //     flag = false;
        // })
    }
    
}
const searchNo=() =>{
    let noResult = document.getElementById("boxArea")
    noResult.innerHTML='sorry! 找不到相關資料!';

}


function loadAction(){
    const footer = document.querySelector('.footer');
    console.log("scroll start");
    const options = {
        root : null,
        rootMargin:'0px',
        threshold: 0.2
    }
    // const callback = (entries, observer) =>{
    //     console.log("test1");
    //     console.log(entries,page);
    //     for (const entry of entries){
    //         console.log(entry);
    //         if (entry.isIntersecting){
    //             if(page!=null && page > 0){
    //                 getaAttractions();
    //             }else {
    //                  observer.unobserve(footer);}
    //         }else {
    //             return
    //         }
    //     }
    // }
    // const observer = new IntersectionObserver(callback, options);
    //     // observer.observe(footer);
    const intersectionObserver = new IntersectionObserver((entries) => {
        console.log(entries,page);
        if (entries[0].isIntersecting) {
            if (page!=null && page>0){
                getaAttractions();
                console.log("test");
            };
        } else {
          return
        }
      });
      
    intersectionObserver.observe(footer,options);
    
}

getaAttractions();

function createDiv(viewData,nextPage){
    let dataLength = Object.keys(viewData).length;
    let boxArea = document.getElementsByClassName("boxArea");
    for (let i=0;i<dataLength;i++){
        let viewImg = viewData[i].images[0];
        let viewTitle = viewData[i].name;
        let viewMrt = viewData[i].mrt;
        let viewCategory = viewData[i].category;

        let viewBox = document.createElement("div");
        viewBox.setAttribute('class','viewBox');
        document.querySelector(".boxArea").appendChild(viewBox);

        let pic = document.createElement("div");
        pic.setAttribute('class','pic');
        viewBox.appendChild(pic);

        let viewText = document.createElement("div");
        viewText.setAttribute('class','viewText');
        viewBox.appendChild(viewText);

        let Img = document.createElement("img");
        Img.setAttribute('class','img');
        Img.src = (viewImg);
        
        let Title = document.createElement("div");
        Title.setAttribute('class','Title');
        Title.textContent = (viewTitle);
        
        let Mrt = document.createElement("div");
        Mrt.setAttribute('class','Mrt');
        Mrt.textContent = (viewMrt);
    
        let Category = document.createElement("div");
        Category.setAttribute('class','Category');
        Category.textContent = (viewCategory);
          
        pic.appendChild(Img);
        pic.appendChild(Title);
        viewText.appendChild(Mrt);
        viewText.appendChild(Category);
    }
    
}
let searchBtn = document.getElementById("queryButton")
searchBtn.addEventListener('click',() => {
    page = 0
    getaAttractions();
    let clearView = document.getElementById("boxArea")
    clearView.innerHTML='';
})



/* <div class="viewBox">
        <div class="pic">
        <img class="img" src="https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000848.jpg">
        <div class="Title">新北投溫泉區</div>
    </div>
    <div class="viewText">
        <div class="Mrt">新北投</div>
        <div class="Category">養生溫泉</div>
    </div>
</div> */