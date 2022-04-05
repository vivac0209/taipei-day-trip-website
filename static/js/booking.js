/* 新增註冊登入功能 */

/*click登入 */

let navLogin = document.getElementById("navlogin");

navLogin.addEventListener('click',() => {
    document.getElementById("login").style.display = "block";
    document.getElementById("background").style.display = "block";
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
    document.getElementById("background").style.display = "none";
})
/*關閉註冊視窗 */
let signupClose = document.getElementById("signupClose");
signupClose.addEventListener('click',() => {
    document.getElementById("signup").style.display = "none";
    document.getElementById("background").style.display = "none";
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
let logoutBtn = document.getElementById("logout");

function queryState(){
    fetch(checkUrl,{method: "GET"})
    .then((res)=> {
        return res.json();
    })
    .then((result)=>{
        console.log("tset");
        if (result["data"] != null){
            navLogin.style.display = "none";
            logout.style.display = "block";
            // logignFrom.style.display = "none";

        }else{
            navLogin.style.display = "block";
            logout.style.display = "none";
        }
    })
}

queryState();

logoutBtn.addEventListener('click',function(){
    
    fetch(checkUrl,{method: "GET"})
    .then((res)=> {
        return res.json();
    })
    .then((result)=>{
        console.log("tset");
        if (result["data"] != null){
            navLogin.style.display = "none";
            logout.style.display = "block";
            // logignFrom.style.display = "none";

        }else{
            navLogin.style.display = "block";
            logout.style.display = "none";
        }
    })
})

/* show booking data */

function GetmemberName(){
    let getUserUrl = '/api/user';
    fetch(getUserUrl,{method: "GET"})
    .then((Response)=>{
        return Response.json();
    })
    .then((result)=>{
        // console.log(result);
        if (result != null){
            
            let memberName = result["data"]["name"];
            let handle = document.getElementById("handle");
            handle.textContent = memberName;
            navLogin.style.display = "none";
            logout.style.display = "block";
            GetBooking();
            console.log("test-booking1");
        }
        
    })
}

GetmemberName();

let showView = document.getElementById("showView");
let showDate = document.getElementById("showDate");
let showtime = document.getElementById("showTime");
let showSpend = document.getElementById("showSpend");
let showLoc = document.getElementById("showLoc");
let showPic = document.getElementById("viewPic");

let deleteBtn = document.getElementById("deleteIcon");

function GetBooking(){
    let getUrl = '/api/booking';
    fetch(getUrl,{method: "GET"})
        .then((response)=>{
            return response.json();
        })
        .then((result)=>{
            console.log("booking");
            if (result.data == null){
                console.log(result.data);
                noData();
            }
            else {

                console.log(result);
                showView.textContent = result["data"]["attraction"]["name"];
                showDate.textContent = result["data"]["date"];
                
                showtime.textContent = result["data"]["time"];
                showSpend.textContent = result["data"]["price"];
                showLoc.textContent = result["data"]["attraction"]["address"];

                console.log(result["data"]["attraction"]["image"]);
                showPic.style.backgroundImage = 'url(' +result["data"]["attraction"]["image"]+ ')';
            }

        })  
}



/* delete功能 */
deleteBtn.addEventListener("click",function(){
    let deleteUrl = '/api/booking';
    fetch(deleteUrl,{method: "DELETE"})
    .then((response)=>{
        return response.json();
    })
    .then((result)=>{
        if (result["ok"]){
            // noData();
            location.reload(); /*重新整理網頁 */
        }
        
    })
})

let deleteBakkground =document.getElementById("deleteBakkground");
let contactData =document.getElementById("contactData");
let bookingData =document.getElementById("bookingData");
let CCdata =document.getElementById("CCdata");

function noData(){
    deleteBakkground.style.display="block";
    contactData.style.display="none";
    bookingData.style.display="none";
    CCdata.style.display="none";
}

let headerTitle = document.getElementById("headerTitle");
headerTitle.addEventListener('click',function(){
    window.location.href = "/";
})