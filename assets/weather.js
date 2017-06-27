$(document).ready(function() {
  getLocation();
})

function getLocation() {
  var location;
  $.ajax({
    format: "jsonp",
    dataType: "jsonp",
    url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAtFMJf63AL4K3z04Q0lwAkk6DBeUhdrac",
    success: function(data) {
      location = (data.lat + "," + data.lon);
      $("#weather-location").html(data.city + ", " + data.region);
      getURL(location)
    },
    error: function() {
      httpsLocation();
    },
    method: "GET"
  });

  function httpsLocation() {
    if (navigator.geolocation) {
      var location;
      navigator.geolocation.getCurrentPosition(passLocation);
    }
  }

  function passLocation(position) {
    location = position.coords.latitude + ", " + position.coords.longitude;
    setCity(location);
    getURL(location);
  }
}

function setCity(latLon) {
  var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latLon + "&sensor=true";
  url = url.replace(/\s/g, "");
  $.ajax({
    format: "json",
    dataType: "json",
    url: url,
    success: function(data) {
      $('#weather-location').html(data.results[0].address_components[2].long_name);
    },
    method: "GET"
  });
}

function getURL(location, tempSetting) {
  var url = ("https://api.forecast.io/forecast/2b4b9e2d0c9c7ba61f588616d2967c9c/" + location);
  //console.log(url);
  getJson(url);

}

function getJson(url) {
  //console.log("started getJson with this url: " + url);

  $.ajax({
      format: "jsonp",
      dataType: "jsonp",
      url: url,
      success: function(json) {
        //console.log("great success");
        $("#weather-current").html(Math.round(json.currently.temperature) + "°");
        $("#weather-high").html("High: " + Math.round(json.daily.data[0].temperatureMax) + "°");
        $("#weather-low").html("Low: " + Math.round(json.daily.data[0].temperatureMin) + "°");
        setBackground(json.currently.icon);
      }

    })
    // .error(function(jqXHR, textStatus, errorThrown) {
    //   alert("error: " + JSON.stringify(jqXHR));
    // })
}

$("#temp-type").on("click", function() {
  var currentTemp = $("#weather-current").html().replace(/°/g, "");
  var highTemp = $("#weather-high").html().replace(/°/g, "");
  var lowTemp = $("#weather-low").html().replace(/°/g, "");
  lowTemp = lowTemp.replace("Low: ", "");
  highTemp = highTemp.replace("High: ", "");

  if ($("#temp-type").html() == "Fahrenheit") {
    $("#weather-current").html(toCelsius(currentTemp) + "°");
    $("#weather-high").html("High: " + toCelsius(highTemp) + "°");
    $("#weather-low").html("Low: " + toCelsius(lowTemp) + "°");
    $("#temp-type").html("Celsius");

  } else if ($("#temp-type").html() == "Celsius") {
    $("#weather-current").html(toFahrenheit(currentTemp) + "°");
    $("#weather-high").html("High: " + toFahrenheit(highTemp) + "°");
    $("#weather-low").html("Low: " + toFahrenheit(lowTemp) + "°");
    $("#temp-type").html("Fahrenheit");

  }

  function toCelsius(num) {
    var newNum = (parseInt(num) - 32) * 5 / 9;
    return Math.round(newNum);
  }

  function toFahrenheit(num) {
    var newNum = (parseInt(num) * 9 / 5) + 32;
    return Math.round(newNum);
  }

})

function setBackground(weatherIcon) {
  console.log(weatherIcon);
  switch (weatherIcon) {
    case "clear-day":
      document.getElementById("body").style.backgroundImage = 'url("http://img02.deviantart.net/d2c2/i/2005/028/b/6/clear_day_by_juanchis.jpg")';
      break;
    case "clear-night":
      document.getElementById("body").style.backgroundImage = 'url("https://tcklusman.files.wordpress.com/2014/05/tumblr_static_dark-starry-night-sky-226736.jpg")';
      break;
    case "rain":
      document.getElementById("body").style.backgroundImage = 'url("http://wearechange.org/wp-content/uploads/2015/03/1_See_It.jpg")';
      break;
    case "cloudy":
      document.getElementById("body").style.backgroundImage = 'url("http://www.tripwire.com/state-of-security/wp-content/uploads/cache//shutterstock_106367810/4261234929.jpg")';
      break;
    case "partly-cloudy-day":
      document.getElementById("body").style.backgroundImage = 'url("http://www.sturdyforcommonthings.com/wp-content/uploads/2013/03/wind_blowing.jpg")';
      break;
    case "partly-cloudy-night":
      document.getElementById("body").style.backgroundImage = 'url("http://scienceblogs.com/startswithabang/files/2013/04/night-sky-stars.jpeg")';
      break;
    case "snow":
      document.getElementById("body").style.backgroundImage = 'url("http://www.vancitybuzz.com/wp-content/uploads/2015/12/shutterstock_315123593-984x500.jpg")';
      break;
    default:
      break;

  }

}