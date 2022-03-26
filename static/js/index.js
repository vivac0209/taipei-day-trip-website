

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
        
        let viewId = viewData[i].id;
        let viewImg = viewData[i].images[0];
        let viewTitle = viewData[i].name;
        let viewMrt = viewData[i].mrt;
        let viewCategory = viewData[i].category;

        let idLink = document.createElement("a");
        idLink.setAttribute('class','viewBox');
        let idUrl = `/attraction/${viewId}`;
        idLink.setAttribute("href",idUrl);
        document.querySelector(".boxArea").appendChild(idLink);

        let pic = document.createElement("div");
        pic.setAttribute('class','pic');
        idLink.appendChild(pic);

        let viewText = document.createElement("div");
        viewText.setAttribute('class','viewText');
        idLink.appendChild(viewText);

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

/*click登入 */

let navLogin = document.getElementById("navlogin");

navLogin.addEventListener('click',() => {
    document.getElementById("login").style.display = "block";

})

/*註冊 */
let gotoSignup = document.getElementById("gotoSignup");

gotoSignup.addEventListener('click',() => {
    document.getElementById("signup").style.display = "block";
    document.getElementById("login").style.display = "none";
    
})
/*註冊轉登入 */
let gotoLogin = document.getElementById("gotoLogin");

gotoLogin.addEventListener('click',() => {
    document.getElementById("signup").style.display = "none";
    document.getElementById("login").style.display = "block";
})

/*關閉登入視窗 */
let closedBtn = document.getElementById("loginClose");
closedBtn.addEventListener('click',() => {
    document.getElementById("login").style.display = "none";
   
})
/*關閉註冊視窗 */
let signupClose = document.getElementById("signupClose");
signupClose.addEventListener('click',() => {
    
    document.getElementById("signup").style.display = "none";
})

/* 收集登入資料*/
let loginBtn = document.getElementById("loginbtn");

loginBtn.addEventListener('click',function(){
    let loginEmail = document.getElementById("loginEmail");
    let loginPws = document.getElementById("loginPws");
    let errorMsg = document.getElementById("loginMsg");
    
    if (loginEmail.value == "" | loginPws.value == ""){
        errorMsg.textContent = "Email/Password 輸入空值";
    }else{
        loginAction(loginEmail,loginPws);
    }

})
/*登入功能 */
function loginAction(loginEmail,loginPws){
    let loginUrl='/api/user';
    // console.log("test");
    // console.log(loginEmail.value,loginPws.value);
    fetch(loginUrl,{
        method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
            "email": loginEmail.value,
            "password": loginPws.value
        })
    })
    .then((res)=> {
        return res.json();
    })
    .then((result)=>{
        // console.log(result);
        if (result["ok"]){
            console.log("登入成功");
            location.reload(); /*重新整理網頁 */
            
        }else{
            let errorlogin = document.getElementById("loginMsg");
            errorlogin.textContent = result["message"];
            console.log(result["message"]);
        }
    })
    
}

/* 收集註冊資料*/
let signupBtn = document.getElementById("sbtn");
let signupMsg = document.getElementById("signupMsg");

signupBtn.addEventListener('click',function(){
    let signupName = document.getElementById("signupName");
    let signupEmail = document.getElementById("signupEmail");
    let signupPws = document.getElementById("signupPws");
    
    if (signupName.value == "" | signupEmail.value == "" | signupPws.value == "" ){
        signupMsg.textContent = "輸入空值";
    }else{
        signipAction(signupName,signupEmail,signupPws);
    }

})

/*註冊功能 */
function signipAction(signupName,signupEmail,signupPws){
    let signnUrl='/api/user';
    // console.log("test");
    // console.log(loginEmail.value,loginPws.value);
    fetch(signnUrl,{
        method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
            "name": signupName.value,
            "email": signupEmail.value,
            "password": signupPws.value
        })
    })
    .then((res)=> {
        return res.json();
    })
    .then((result)=>{
        console.log(result);
        if (result["ok"]){
            console.log("註冊成功");
            signupMsg.textContent = "註冊成功";

        }else{
            signupMsg.textContent = result["message"];
            console.log(result["message"]);
        }
    })
    
}

/*確認登入狀態 */

let checkUrl='/api/user';
    
let logout = document.getElementById("logout");
let logignFrom = document.getElementById("login");

fetch(checkUrl,{method: "GET"})
    .then((res)=> {
        return res.json();
    })
    .then((result)=>{
        console.log("tset");
        if (result["data"] != null){
            navLogin.style.display = "none";
            logout.style.display = "block";
            logignFrom.style.display = "none";

        }else{
             navLogin.style.display = "block";
            logout.style.display = "none";
        }
})




/*登出 */
// let logoutBtn = document.getElementById("logout");

// logoutBtn.addEventListener('click',() => {
//     let logoutkUrl='/api/user';

//     fetch(logoutkUrl,{method: "DELETE"})
//         .then((res)=> {
//             return res.json();
//         })
//         .then((result)=>{
//             if (result["ok"]){
//                 document.location.pathname='/'
//                 // logoutBtn.style.display = "none";
//                 // navLogin.style.display = "block";
//             }
//         })
// })