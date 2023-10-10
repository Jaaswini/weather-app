const yourWeather = document.querySelector("[data-yourWeatherTab]");
const search = document.querySelector("[data-searchTab]");
const searchBar = document.querySelector("[data-searchBar]");
const searchIcon = document.querySelector("[data-searchIcon]");
const searchText = document.querySelector("[data-searchText]");
const weatherDet = document.querySelector("[data-weatherDetails]");
const setCityName = document.querySelector("[data-cityName]");
const weather = document.querySelector("[data-weather]");
const windspeed = document.querySelector("[data-windSpeed]");
const humidity = document.querySelector("[data-humidity]");
const clouds = document.querySelector("[data-clouds]");
const temp = document.querySelector("[data-temp]");
const flag = document.querySelector("[data-flag]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const loading = document.querySelector("[data-loading]");
const error = document.querySelector("[data-error]");
const allowAccess = document.querySelector("[data-allowPermission]");
const grantAccessBtn = document.querySelector("[data-grantAccessBtn]");
let currentTab = "YourWeather";
const apiKey = "efa03d9120c3910a8e3429fd3ecd9410";
let latitude, longitude;
function clickOnTab(tabName, activeClassName, inActiveClassName) {
  currentTab = tabName;
  activeClassName.classList.add("selected");
  inActiveClassName.classList.remove("selected");
  if (currentTab === "Search") searchTabClicked();
  else yourWeatherTabClicked();
}
clickOnTab("YourWeather", yourWeather, search);

function searchTabClicked() {
  searchBar.classList.add("active");
  allowAccess.classList.remove("active");
  weatherDet.classList.remove("active");
  searchText.value = "";
}
function yourWeatherTabClicked() {
  searchBar.classList.remove("active");
  weatherDet.classList.remove("active");
  allowAccess.classList.add("active");
  error.classList.remove("active");
  findYourWeather();
}
function showWeatherDetailsOnUi(data) {
  console.log(data.cod);
  if (data.cod === "404") {
    error.classList.add("active");
    console.log(error);
    return;
  }
  error.classList.remove("active");
  weatherDet.classList.add("active");
  setCityName.innerHTML = data?.name;
  weather.innerHTML = data?.weather?.[0]?.main;
  windspeed.innerHTML = data?.wind?.speed + "m/s";
  humidity.innerHTML = data?.main?.humidity + "%";
  clouds.innerHTML = data?.clouds?.all + "%";
  temp.innerHTML = data?.main?.temp;
  flag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
  weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather[0]?.icon}.png`;
}
function coords() {
  if (navigator.geolocation) {
    const k = navigator.geolocation.getCurrentPosition(showPosition);
    console.log(k);
  }
}
function showPosition(pos) {
  latitude = pos.coords.latitude;
  longitude = pos.coords.longitude;
}
async function clickOnSearch() {
  try {
    weatherDet.classList.remove("active");
    error.classList.remove("active");
    loading.classList.add("active");
    if (searchText.value) {
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchText.value}&appid=${apiKey}`
      );
      const data = await resp.json();
      console.log(data);
      loading.classList.remove("active");
      showWeatherDetailsOnUi(data);
    }
  } catch (e) {
    console.log(e);
  }
}
async function findYourWeather() {
  if (latitude && longitude) {
    try {
      allowAccess.classList.remove("active");
      loading.classList.add("active");
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
      );
      const data = await resp.json();
      loading.classList.remove("active");
      showWeatherDetailsOnUi(data);
    } catch (e) {}
  } else {
    coords();
  }
}
yourWeather.addEventListener("click", () =>
  clickOnTab("YourWeather", yourWeather, search)
);
search.addEventListener("click", () =>
  clickOnTab("Search", search, yourWeather)
);

searchIcon.addEventListener("click", () => clickOnSearch());
grantAccessBtn.addEventListener("click", () => {
  coords();
  findYourWeather();
});
searchText.addEventListener("keypress", (event) => {
  if (event.key === "Enter") clickOnSearch();
});
