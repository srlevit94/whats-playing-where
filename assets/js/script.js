// MovieGlu API credentials
const API_KEY = 'UkhUTl9YWDpPWDVQeDNKS0NVY1Q=';
const CLIENT_NAME = 'RHTN';
const X_API_KEY = 'Fvn2jSwMsT4NBd1JVtz9u9lnwhsnaZQs2wP8Nmq8';
const API_VERSION = 'v200';
const TERRITORY = 'XX';

const firstScreenDiv = document.querySelector('.first-screen');
const grabLocationForm = document.querySelector('.grab-location-form');
const secondScreenDiv = document.querySelector('.second-screen');
const nearbyTheatersTbody = document.querySelector('.nearby-theaters-tbody');
const thirdScreenDiv = document.querySelector('.third-screen');
const showsTbody = document.querySelector('.shows-tbody');
const forthScreenDiv = document.querySelector('.forth-screen');
const theaterMapDiv = document.querySelector('.theater-map');
const goBackBtns = document.querySelectorAll('.go-back-btn');
const searchedZipCodesList = document.querySelector('.searched-zipcodes-list');
const zipCodesDiv = document.querySelector('.zipcodes-container');
// default coords
let curLocation = { lat: 	40.730610, lng: -73.935242 };

// gets cinemasNearby from MovieGlu API
function getNearbyTheaters() {
  return new Promise(function(resolve, reject){
    fetch('https://api-gate2.movieglu.com/cinemasNearby/?n=10', {
      method: 'GET',
      headers: {
        "api-version": API_VERSION,
        "Authorization": `Basic ${API_KEY}`,
        "client": CLIENT_NAME,
        "x-api-key": X_API_KEY,
        "device-datetime": new Date().toISOString(),
        "territory": TERRITORY,
        // "geolocation": `${curLocation.lat};${curLocation.lng}`
        "geolocation": '-22.0;14.0'
      }
    })
    .then(function(res){
      if(res.ok) return res.json();
      reject('No theaters found nearby');
    })
    .then(function(data){
      if(!data.cinemas.length) reject('No theaters found nearby');
      resolve(data.cinemas);
    })
    .catch(function(err){ 
      reject('Something went wrong');
    })
  });  
}

// gets cinemaShowtimes from MovieGlu API
function getTheaterShowTimes(theaterId, date) {
  return new Promise(function(resolve, reject){
    fetch(`https://api-gate2.movieglu.com/cinemaShowTimes/?cinema_id=${theaterId}&date=${date}`, {
      method: 'GET',
      headers: {
        "api-version": API_VERSION,
        "Authorization": `Basic ${API_KEY}`,
        "client": CLIENT_NAME,
        "x-api-key": X_API_KEY,
        "device-datetime": new Date().toISOString(),
        "territory": TERRITORY,
        // "geolocation": `${curLocation.lat};${curLocation.lng}`
        "geolocation": '-22.0;14.0'
      }
    })
    .then(function(res){
      if(res.ok) return res.json();
      reject('No shows found for this theater');
    })
    .then(function(data){
      if(!data.films.length) reject('No shows found for this theater');
      resolve(data.films);
    })
    .catch(function(err){ 
      reject('Something went wrong');
    })
  });  
}

// shows pin on Google Map for cinema
function showTheaterMap(e) {
  e.preventDefault();

  const theaterLat = Number(e.target.querySelector('.theater-lat-inp').value);
  const theaterLng = Number(e.target.querySelector('.theater-lng-inp').value);

  firstScreenDiv.classList.add('d-none');
  secondScreenDiv.classList.add('d-none');
  forthScreenDiv.classList.remove('d-none');

  const map = new google.maps.Map(theaterMapDiv, {
    zoom: 10,
    center: { lat: theaterLat, lng: theaterLng }
  });

  new google.maps.Marker({
    position: { lat: theaterLat, lng: theaterLng },
    map: map,
  });
}

// dynamically creates HTML to display cinemaShowtimes
async function renderTheaterShows(e) {
  e.preventDefault();

  const theaterId = e.target.querySelector('.theater-id-inp').value;
  const date = e.target.querySelector('.theater-shows-date-inp').value;
  firstScreenDiv.classList.add('d-none');
  secondScreenDiv.classList.add('d-none');
  thirdScreenDiv.classList.remove('d-none');
  showsTbody.innerHTML = '';
  
  try {
    const films = await getTheaterShowTimes(theaterId, date);
    console.log(films);
    
    films.forEach(function(film, idx){
      showsTbody.innerHTML += `<tr class="shows-tr">
        <td class="shows-td">${idx + 1}</td>
        <td class="shows-td">${film.film_name}</td>
        <td class="shows-td">${film.showings.Standard.times.map(el => el.start_time + ' - ' + el.end_time).join('<br/>')}</td>
      </tr>`;
    });
  } catch (err) {
    nearbyTheatersTbody.innerHTML = `<tr class="nearby-theaters-tr">
      <td class="nearby-theaters-td err" colspan="3">${err}</td>
    </tr>`;
  }
}

// dynamically creates HTML to display cinemaNearby
async function renderNearbyTheatersHandler() {
  nearbyTheatersTbody.innerHTML = '';

  try {
    const theaters = await getNearbyTheaters();

    theaters.forEach(function(theater, idx){
      nearbyTheatersTbody.innerHTML += `<tr class="nearby-theaters-tr">
        <td class="nearby-theaters-td">${idx + 1}</td>
        <td class="nearby-theaters-td">${theater.cinema_name} <br/> ${theater.address}, ${theater.city}</td>
        <td class="nearby-theaters-td">
          <form class="theater-shows-form">
            <input type="hidden" class="theater-id-inp" value="${theater.cinema_id}"/>
            <input type="date" class="theater-shows-date-inp" required/>
            <button type="submit" class="what-playing-btn">What's Playing</button>
          </form>
        </td>
        <td class="nearby-theaters-td">
          <form class="show-theater-map-form">
            <input type="hidden" class="theater-lat-inp" value="${theater.lat}"/>
            <input type="hidden" class="theater-lng-inp" value="${theater.lng}"/>
            <button type="submit" class="show-on-the-map-btn">Show on the map</button>
          </form>
        </td>
      </tr>`;
    });

    const showTheaterMapForms = document.querySelectorAll('.show-theater-map-form');
    showTheaterMapForms.forEach(function(showTheaterMapForm){
      showTheaterMapForm.addEventListener('submit', showTheaterMap);
    });

    const theaterShowsForms = document.querySelectorAll('.theater-shows-form');
    theaterShowsForms.forEach(function(theaterShowsForm){
      theaterShowsForm.addEventListener('submit', renderTheaterShows);
    });
  } catch (err) {
    nearbyTheatersTbody.innerHTML = `<tr class="nearby-theaters-tr">
      <td class="nearby-theaters-td err" colspan="4">${err}</td>
    </tr>`;
  }
}

// converts user input to coords
function grabLocationHandler(e) {
  e.preventDefault();

  secondScreenDiv.classList.remove('d-none');
  zipCodesDiv.classList.add('d-none');

  var zipCode = document.querySelector('.zip-code-inp').value;
  saveSearchedZipCode(zipCode);
  var geocodeApiKey = 'AIzaSyCaEJWz2Tr0vukbMCAxqPj9HxuNe22tCyg';
  var apiURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${geocodeApiKey}`;
  fetch(apiURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    curLocation.lat = data.results[0].geometry.location.lat;
    curLocation.lng = data.results[0].geometry.location.lng;
    renderNearbyTheatersHandler();
  }) 
}

// handles the click on "Go Back" buttons
function goBackHandler() {
  thirdScreenDiv.classList.add('d-none');
  forthScreenDiv.classList.add('d-none');
  secondScreenDiv.classList.remove('d-none');
  firstScreenDiv.classList.remove('d-none');
}

// submit eventListener for the .grab-location-form
grabLocationForm.addEventListener('submit', grabLocationHandler);

// click eventListener for "Go Back" buttons
goBackBtns.forEach(function(goBackBtn){
  goBackBtn.addEventListener('click', goBackHandler);
});

// convert the value of the element clicked into coords
function getLocationHandler (e) {
  secondScreenDiv.classList.remove('d-none');
  zipCodesDiv.classList.add('d-none');

  var zipCode = e.target.dataset.q;
  // 10/3 API ket
  var geocodeApiKey = 'AIzaSyCaEJWz2Tr0vukbMCAxqPj9HxuNe22tCyg';
  var apiURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${geocodeApiKey}`;
  fetch(apiURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    curLocation.lat = data.results[0].geometry.location.lat;
    curLocation.lng = data.results[0].geometry.location.lng;
    renderNearbyTheatersHandler();
  })
}

// gets key values from localStorage
function renderSearchedZipCodes() {
  const searchedZipCodesLs = JSON.parse(localStorage.getItem('searched-zipcodes')) || [];
  searchedZipCodesList.innerHTML = '';

  searchedZipCodesLs.forEach(function(item){
    const li = document.createElement('li');
    li.className = 'searched-zipcodes-item';
    li.setAttribute('data-q', item);
    li.innerText = item;
    searchedZipCodesList.prepend(li);
    li.addEventListener('click', getLocationHandler);
  });
}

// saves user input to localStorage
function saveSearchedZipCode(zipCode) {
  const searchedZipCodesLs = JSON.parse(localStorage.getItem('searched-zipcodes')) || [];
  if(searchedZipCodesLs.findIndex(el => el == zipCode) != -1) return;
  searchedZipCodesLs.push(zipCode);
  localStorage.setItem('searched-zipcodes', JSON.stringify(searchedZipCodesLs));
  renderSearchedZipCodes();
}

renderSearchedZipCodes();