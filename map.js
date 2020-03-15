let loading = document.getElementById("loading").innerHTML;

const LOAD_MAP = max => {
  am4core.ready(async () => {
    loading = "loading";
    const url = "https://covid19.mathdro.id/api/confirmed";
    const fetched_data = await fetch_url(url);

    var colorSet = new am4core.ColorSet();
    const custom_data = [];
    fetched_data.slice(0, max).forEach(data =>
      custom_data.push({
        title: data.countryRegion,
        latitude: data.lat,
        longitude: data.long,
        color: colorSet.next(),
        recovered: data.recovered,
        confirmed: data.confirmed,
        deaths: data.deaths,
        province: data.provinceState || data.countryRegion
      })
    );

    am4core.useTheme(am4themes_animated);

    const chart = am4core.create("chart", am4maps.MapChart);

    chart.geodata = am4geodata_worldLow;

    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    polygonSeries.exclude = ["AQ"];

    polygonSeries.useGeodata = true;

    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.polygon.fillOpacity = 0.6;

    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0);

    var imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.mapImages.template.propertyFields.longitude = "longitude";
    imageSeries.mapImages.template.propertyFields.latitude = "latitude";
    imageSeries.mapImages.template.tooltipText =
      "{province} ({title}):\n{confirmed} confirmed\n{recovered} recovered\n{deaths} deaths";
    imageSeries.mapImages.template.propertyFields.url = "url";

    var circle = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle.radius = 3;
    circle.propertyFields.fill = "color";

    var circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle2.radius = 3;
    circle2.propertyFields.fill = "color";

    circle2.events.on("inited", function(event) {
      animateBullet(event.target);
    });
    chart.events.on("ready", () => (loading = null));

    function animateBullet(circle) {
      var animation = circle.animate(
        [
          { property: "scale", from: 1, to: 5 },
          { property: "opacity", from: 1, to: 0 }
        ],
        1000,
        am4core.ease.circleOut
      );
      animation.events.on("animationended", function(event) {
        animateBullet(event.target.object);
      });
    }

    imageSeries.data = custom_data;
  });
};

const handleLoadmapData = e => {
  LOAD_MAP(document.getElementById("load_input").value);
};

LOAD_MAP(document.getElementById("load_input").value);
