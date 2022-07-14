// 県別コード
const codelist = {
    北海道: "016010", 青森県: "020010", 岩手県: "030010", 宮城県: "040010", 秋田県: "050010", 山形県: "060010",
    福島県: "070010", 茨城県: "080010", 栃木県: "090010", 群馬県: "100010", 埼玉県: "110010", 千葉県: "120010",
    東京都: "130010", 神奈川県: "140010", 新潟県: "150010", 富山県: "160010", 石川県: "170010", 福井県: "180010",
    山梨県: "190010", 長野県: "200010", 岐阜県: "210010", 静岡県: "220010", 愛知県: "230010", 三重県: "240010", 
    滋賀県: "250010", 京都府: "260010", 大阪府: "270000", 兵庫県: "280010", 奈良県: "290010", 和歌山県: "300010",
    鳥取県: "310010", 島根県: "320010", 岡山県: "330010", 広島県: "340010", 山口県: "350010", 徳島県: "360010",
    香川県: "370000", 愛媛県: "380010", 高知県: "390010", 福岡県: "400010", 佐賀県: "410010", 長崎県: "420010",
    熊本県: "430010", 大分県: "440010", 宮崎県: "450010", 鹿児島県: "460010", 沖縄県: "471010",
}; //参考URL:https://weather.tsukumijima.net/primary_area.xml


// api用のurl
const getPreUrl = "https://geoapi.heartrails.com/api/json?method=searchByGeoLocation";
const getWethUrl = "https://weather.tsukumijima.net/api/forecast/city/";



// mapを表示
var mymap = L.map('mapid',{
    center: [37.874, 136.724],
    zoom: 5,
    minZoom: 5,
    maxZoom: 7
}
);
// タイトルレイヤー
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);  
// ポップアップを表示
L.popup().setLatLng([37.874, 136.724])
         .setContent("日本の範囲上でクリックするとそこの県の天気が表示されます。")
         .openOn(mymap);

// form上で都道府県が検索された時の処理
function serchPrefecture(){
   
    const prefecture = document.getElementById("inputPrefecture").value;
    const prefectureCode = codelist[prefecture];
        
    const wethUrl = getWethUrl + prefectureCode;
    getWeather(wethUrl);
    
    
}

// 地図上をクリックされた時の処理
mymap.on('click', function(e) {
    //クリック位置経緯度取得
    lat = e.latlng.lat;
    lng = e.latlng.lng;
    // console.log(lat);
    // console.log(lng);

    x = String(lng);
    y = String(lat);
    
    const preUrl = getPreUrl + ("&x=" + x + "&y=" + y)
    getData(preUrl);
});


// モーダルを消す
function closeModal(){
    document.getElementById("modal").style.display = "none";
}

// 天気情報を表示
function getData(preUrl){
    fetch(preUrl)
    .then(response => response.json())
    .then((data) => {
        prefecture = data.response.location[0].prefecture;
        prefectureCode = codelist[prefecture];
        
        const wethUrl = getWethUrl + prefectureCode;
        getWeather(wethUrl);

    })
    .catch(error => {
        // モーダル表示
        document.getElementById("modal").style.display = "flex";
        document.getElementById("modalContent").innerHTML = "天気予報範囲外です。日本上をクリックしてください。";
    });
}

// 天気予報を取得
function getWeather(wethUrl){
    
    fetch(wethUrl)
    .then(response => response.json())
    .then((data) => {
        // console.log(data.forecasts); 

        // 本日の天気を表示
        const title = data.title;
        const weather = data.forecasts[0].telop
        const weatherOverview = data.description.bodyText.replace(/\s|\n/g, "");
        const imgUrl = data.forecasts[0].image.url;
        const celsius = "最高気温 " + data.forecasts[0].temperature.max.celsius + "°";

        document.getElementById("area-text").innerHTML = title;
        document.getElementById("weather-text").innerHTML = weather;
        document.getElementById("weatherOverview-text").innerHTML = weatherOverview;
        document.getElementById("celsius-text").innerHTML = celsius;

        const wetherImg = document.getElementById("wetherImg");
        wetherImg.src = imgUrl;

        // 明日の天気を表示
        const tm_weather = data.forecasts[1].telop;
        const tm_imgUrl = data.forecasts[1].image.url;
        const tm_celsius = "最高気温 " + data.forecasts[1].temperature.max.celsius + "° " + "最低気温 " + data.forecasts[1].temperature.min.celsius + "°";
        document.getElementById("tm-weather").innerHTML = tm_weather;
        document.getElementById("tm-celsius").innerHTML = tm_celsius;

        const tm_wetherImg = document.getElementById("tm-img");
        tm_wetherImg.src = tm_imgUrl;

        // 明日の天気を表示
        const da_tm_weather = data.forecasts[2].telop;
        const da_tm_imgUrl = data.forecasts[2].image.url;
        const da_tm_celsius = "最高気温 " + data.forecasts[2].temperature.max.celsius + "° " + "最低気温 " + data.forecasts[2].temperature.min.celsius + "°";
        document.getElementById("da-tm-weather").innerHTML = da_tm_weather;
        document.getElementById("da-tm-celsius").innerHTML = da_tm_celsius;

        const da_tm_wetherImg = document.getElementById("da-tm-img");
        da_tm_wetherImg.src = da_tm_imgUrl;


        // 天気表示部分まで移動
        document.getElementById('showWeather').scrollIntoView();
    })
    .catch(error => {
        // モーダル表示
        document.getElementById("modal").style.display = "flex";
        document.getElementById("modalContent").innerHTML = "都道府県が見つかりませんでした。";
        
    });
}
