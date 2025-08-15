$(function () {
  let apiKey = "";

  let date = new Date();
  let day = date.getDate();
  let monthCheck = date.getMonth() + 1;
  let month = monthCheck.length < 2 ? "0" + monthCheck : "0" + monthCheck;
  let year = date.getFullYear();
  let currentDate = `${day}.${month}.${year}`;

  function getWeather(city) {
    if (!city) {
      $(".weather").html("<p>Город не указан</p>");
      return;
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric&lang=ru`;

    $(".weather").html("<p>Загрузка...</p>");

    $.getJSON(url, function (data) {
      let city = data.name;
      let temp = data.main.temp.toString().slice(0, 2);
      let description = data.weather[0].description;
      let descriptionFormat =
        description.toString().charAt(0).toUpperCase() + description.slice(1);
      let humidity = data.main.humidity;

      $(".weather").html(`
                <h2 class="weathercity">${city}</h2>
                <p class="weatherdate">${currentDate}</p>
                <p class="weathertemp">${temp}°C</p>
                <p class="weatherdescription">${descriptionFormat}</p>
                <p class="weatherhumidity">Влажность: ${humidity}%</p>
            `);
    }).fail(function (xhr) {
      if (xhr.status === 401) {
        $(".weather").html("<p>Ошибка 401: Проверь API ключ.</p>");
      } else {
        $(".weather").html("<p>Не удалось загрузить погоду.</p>");
      }
    });
  }

  let cityFromIpUrl = "http://ip-api.com/json/?fields=city,lat,lon";

  $.getJSON(cityFromIpUrl, function (location) {
    let city = location.city;
    console.log("Город, определённый по ip: ", city);
    $("#city").val(city);
  }).fail(function () {
    $("#weather").html("<p>Не удалось определить город.</p>");
  });

  $("#getWeather").click(function () {
    let city = $("#city").val();
    apiKey = $('#apiKeyInput').val();
    getWeather(city);
    console.log("Новые данные определены для города: ", city);
  });

  $(document).on("mousemove", function (e) {
    var winW = $(window).width();
    var winH = $(window).height();
    var offsetX = (e.pageX / winW - 0.5) * 20;
    var offsetY = (e.pageY / winH - 0.5) * 20;

    $(".layer").each(function (i) {
      var depth = i * 0.5;
      $(this).css(
        "transform",
        `translate(calc(-50% + ${-offsetX / depth}px), calc(-50% + ${
          -offsetY / depth
        }px))`
      );
    });
  });
});

$(window).on('load', function() {
  $('#preloader').fadeOut(500);
});
