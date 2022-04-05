// let getID = window.location.href;
// console.log(getID);
// let queryUrl = "/"+ getID.split("/")[3] + "/" + getID.split("/")[4];
// console.log(queryUrl);


function getaAttraction(){
    let getID = window.location.href;
    let queryUrl = "/api/attraction/" + getID.split("/")[4];
    fetch(queryUrl)
        .then((response)=>{
            return response.json();
        })
        .then((jsonData)=>{
            let AttractionData = jsonData.data;

            let pic1 = document.getElementById("pic");
            let picAll = AttractionData.images[0];
            pic1.style.backgroundImage = 'url(' + picAll + ')';

            let viewName1 = document.getElementById("changeText1");
            let viewNameH2 = document.createElement("h2");
            viewNameH2.textContent = AttractionData.name;
            viewName1.appendChild(viewNameH2);

            let viewName2 = document.getElementById("changeText2");
            let viewName2P = document.createElement("p");
            viewName2P.textContent = AttractionData.category +" at "+ AttractionData.mrt;
            viewName2.appendChild(viewName2P);

            let narrative = document.getElementById("narrative");
            let narrativeP = document.createElement("p");
            narrativeP.textContent = AttractionData.description;
            narrative.appendChild(narrativeP);

            let address = document.getElementById("address");
            let addressP = document.createElement("p");
            addressP.textContent = AttractionData.address;
            address.appendChild(addressP);

            let traffic = document.getElementById("traffic");
            let trafficP = document.createElement("p");
            trafficP.textContent = AttractionData.transport;
            traffic.appendChild(trafficP);

            selectAction();
            /*images 陣列*/
            
            showImagesButton(AttractionData);
            imageBuuton(AttractionData);
            
        })
}

getaAttraction();

function selectAction(){
    let morningPrice = "新台幣 2000 元";
    let afternoonPrice = "新台幣 2500 元";
    let changeAmount = document.getElementById("changeAmount");
    let radioAll = document.querySelectorAll('input[name="time"]');
    radioAll.forEach((item)=>{
        item.addEventListener("change", function(event){
            let clickValut = event.target.value;
            console.log(clickValut);
            if (clickValut == "morning"){
                changeAmount.textContent = morningPrice;
            }else {
                changeAmount.textContent = afternoonPrice;
            }
            
        })
    })

}
    
function showImagesButton(AttractionData){
    let imagwsALL = AttractionData.images;
    let imagesBox = document.querySelector(".images");
    /*當滑鼠經過 才顯示按鈕*/
    let leftArrow = document.querySelector(".leftArrow");
    let rightArrow = document.querySelector(".rightArrow");
    imagesBox.addEventListener('mouseenter',function(){
        leftArrow.style.display = 'block';
        rightArrow.style.display = 'block';
    })
    imagesBox.addEventListener('mouseleave',function(){
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
    })
    
}


function imageBuuton(AttractionData){
    let ImagesLength = AttractionData.images.length;
    let ImagesData = AttractionData.images;
    let ballArea = document.getElementById("ballArea");
    for (let j = 0; j < ImagesLength; j++){
        let ball = document.createElement("div");
        ball.setAttribute("class","ball");
        ball.id ="dev"+j
        ballArea.appendChild(ball);
    }

    
    let rightButton = document.getElementById("rightArrow");
    let leftButton = document.getElementById("leftArrow");
    let picIndex = document.getElementById("pic");
    
    let index = 0;
    
    document.getElementById("dev"+0).style.backgroundColor="black";
    
    
    leftButton.onclick =  function(){
        index--;
        if (index < 0 ){
            index = ImagesLength -1;
        }
        picIndex.style.backgroundImage = 'url(' + ImagesData[index] + ')';
        console.log("第"+index+"張");
        console.log("左");
        for (let a =0;a <ImagesLength ;a++){
            if (index == a){
                document.getElementById("dev"+index).style.backgroundColor = "black";
            }
            else {
                document.getElementById("dev"+a).style.backgroundColor = "white";
            }
        }
        
    }

    rightButton.onclick =  function(){
        index++;
        if (index > ImagesLength -1){
            index = 0;
        }
        picIndex.style.backgroundImage = 'url(' + ImagesData[index] + ')';
        console.log("第"+index+"張");
        console.log("右");
        for (let b =0;b <ImagesLength ;b++){
            if (index == b){
                str = "dev"+b;
                document.getElementById(str).style.backgroundColor = "black";
            }
            else {
                document.getElementById("dev"+b).style.backgroundColor = "white";
            }
        }
        

    }
}

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

let navBooking = document.getElementById("Booking")

navBooking.addEventListener('click',function(){
    let UserUrl='/api/user';
    fetch(UserUrl,{method: "GET"})
        .then((res)=> {
            return res.json();
         })
        .then((result)=>{
            if (result["data"] == null){
                document.getElementById("login").style.display = "block";
                document.getElementById("background").style.display = "block";
            }else{
                window.location.href = "/booking";
            }
        })
})


let checkBtn = document.getElementById("checkBtn")
checkBtn.addEventListener('click',function(){
    let UserUrl='/api/user';
    fetch(UserUrl,{method: "GET"})
        .then((res)=> {
            return res.json();
         })
        .then((result)=>{
            if (result["data"] == null){
                document.getElementById("login").style.display = "block";
                document.getElementById("background").style.display = "block";
            }else{
                navLogin.style.display = "none";
                logout.style.display = "block";
            }
        })
})


CreateBooking();

function CreateBooking(){

    let checkBtn1 = document.getElementById("checkBtn")
    checkBtn1.addEventListener('click',function(){
        let getID = window.location.href;
        let attractionID = getID.split("/")[4];
        let dateValue = document.getElementById("date").value;
        let timeValue = document.querySelector('input[class="radio"]:checked').value;
        let price = 0;
        console.log(attractionID,dateValue,timeValue);
        if (dateValue == ""){
            let dateMsg = document.getElementById("dateMsg");
            dateMsg.textContent = "請選擇日期";
        }
        else{
        
            if (timeValue == "morning"){
                price = 0+2000;
            }else {
                price = 0+2500;
            }
            let bookingkUrl='/api/booking';
            fetch(bookingkUrl,{
                method: "POST",
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "attractionId": attractionID,
                    "date": dateValue,
                    "time": timeValue,
                    "price": price
                })
            })
            .then((res)=> {
                return res.json();
             })
            .then((result)=>{
                if (result["ok"]){
                    window.location.href = "/booking";
                }
                else {
                    let errorMsg = document.getElementById("errorMsg");
                    errorMsg.textContent = result["message"];
                }
            })
        }
    })

}

let headerTitle = document.getElementById("headerTitle");
headerTitle.addEventListener('click',function(){
    window.location.href = "/";
})


/* <div class="function">
    <div class="viewLocation">
        <div class="changeText1"><h2>平安鐘</h2></div>
        <div class="changeText2"><p nowrap>公共藝術 at 忠孝復興</p></div>
    </div>
    <div class="infornation">
        <h4>訂購導覽行程</h4>
        <p>以此景點為中心的一日行程，帶您探索城市角落故事</p>
        <label class="data" for="date">選擇日期:</label>
        <input id="date" type="date">
        <div class="radioBox">
            選擇時間:
            <span class="radio">
            <input type="radio" value="morning" name="time" id="morning" checked>
            <label for="morning" class="radio">上半天</label>
            </span>
            <span class="radio">
            <input type="radio" value="afternoon" name="time" id="afternoon">
            <label for="morning" class="radio">下半天</label>
            </span>
        </div>
        <div class="amount">
            <span class="amountOrder">導覽費用:</spanp><span class="changeAmount" id="changeAmount">新台幣 2000 元</span>
        </div>
        <div class="button">
            <button class="checkBtn" id="checkBtn">開始預訂行程</button>
        </div>
                        
        </div>
</div> */


/* <div class="introduceArea">
    <div class="narrative">
        <p>北投溫泉從日據時代便有盛名，深受喜愛泡湯的日人自然不會錯過，瀧乃湯、星乃湯、
                    鐵乃湯就是日本人依照溫泉的特性與療效給予的名稱，據說對皮膚病、神經過敏、氣喘、風濕等具有很好的療效，
                    也因此成為了北部最著名的泡湯景點之一。新北投溫泉的泉源為大磺嘴溫泉，泉質屬硫酸鹽泉，PH值約為3~4之間，
                    水質呈黃白色半透明，泉水溫度約為50-90℃，帶有些許的硫磺味 。目前北投的溫泉旅館、飯店、
                    會館大部分集中於中山路、光明路沿線以及北投公園地熱谷附近，總計約有44家，每一家都各有其特色，
                    多樣的溫泉水療以及遊憩設施，提供遊客泡湯養生，而鄰近的景點也是非常值得造訪，例如被列為三級古蹟的三寶吟松閣、
                    星乃湯、瀧乃湯以及北投第一家溫泉旅館「天狗庵」，都有著深遠的歷史背景，而北投公園、北投溫泉博物館、
                    北投文物館、地熱谷等，更是遊客必遊的景點，來到北投除了可以讓溫泉洗滌身心疲憊，
                    也可以順便了解到北投溫泉豐富的人文歷史。</p>
    </div>
    <div class="address">
        <h4>景點地址:</h4>
        <p>臺北市  北投區中山路、光明路沿線</p>
    </div>
    <div class="traffic">
        <h4>交通方式:</h4>
        <p>捷運站名：雙連站，轉乘紅33(固定班次)於大稻埕碼頭站下車。公車：9、206、274、641、669、704至大稻埕碼頭站
                    及255、518、539至民生西路口站，再沿民生西路底方向步行約10分鐘抵達。 
                    開車：沿著環河北路依大稻埕碼頭入口指引便可抵達。</p>
    </div>
</div> */