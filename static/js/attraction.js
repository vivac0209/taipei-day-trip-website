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
            
            showImagesButton();
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
    
function showImagesButton(){
    
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
    /*動態生成小圓圈 最後寫*/

}


function imageBuuton(AttractionData){
    let ImagesData = AttractionData.images;
    let rightButton = document.getElementById("rightArrow");
    let leftButton = document.getElementById("leftArrow");
    let picIndex = document.getElementById("pic");

    let index = 0;
    leftButton.onclick =  function(){
        index--;
        if (index < 0 ){
            index = ImagesData.length -1;
        }
        picIndex.style.backgroundImage = 'url(' + ImagesData[index] + ')';
    }
    rightButton.onclick =  function(){
        index++;
        if (index > ImagesData.length -1){
            index = 0;
        }
        picIndex.style.backgroundImage = 'url(' + ImagesData[index] + ')';

    }
}




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