const confirmed = document.getElementById("confirmed");
const recovered = document.getElementById("recovered");
const deaths = document.getElementById("deaths");

const tg_confirm = document.getElementById("tg_confirm");

let confirm_desc = true;

const fetch_url = async url => {
  let res;
  await fetch(url)
    .then(j => j.json())
    .then(doc => {
      console.log(doc);
      res = doc;
    })
    .catch(err => console.log(err));
  return res;
};

const count_up = (target, value) => {
  const c = new CountUp(target, 0, value);
  if (!c.error) c.start();
  else console.log(c.error);
};

window.onload = async () => {
  const url = "https://covid19.mathdro.id/api";

  const global = await fetch_url(url);

  count_up(confirmed, global.confirmed.value);
  count_up(recovered, global.recovered.value);
  count_up(deaths, global.deaths.value);

  const fetched_data = await fetch_url(
    "https://covid19.mathdro.id/api/confirmed"
  );
  const custom = [];
  fetched_data.slice(0, 150).forEach(data => {
    const index = custom.findIndex(d => d.countryRegion === data.countryRegion);
    console.log(index);
    if (index === -1) {
      custom.push({
        countryRegion: data.countryRegion,
        confirmed: data.confirmed,
        recovered: data.recovered,
        deaths: data.deaths,
        active: data.active
      });
    } else {
      custom[index].confirmed += data.confirmed;
      custom[index].recovered += data.recovered;
      custom[index].deaths += data.deaths;
      custom[index].active += data.active;
    }
  });
  console.log(custom);
  console.log(fetched_data);
  const cs = custom.sort((a, b) =>
    confirm_desc ? b.confirmed - a.confirmed : a.confirmed - b.confirmed
  );
  const trs = [];
  let total_actives = 0;
  for (var i = 0; i < custom.length; i++) {
    total_actives += cs[i].active;
    trs.push(
      `<tr><th>${cs[i].countryRegion}</th><th>${cs[i].confirmed}</th><th>${cs[i].recovered}</th><th>${cs[i].deaths}</th><th>${cs[i].active}</th></tr>`
    );
  }
  const joint = trs.join("");
  console.log(joint);
  const table = document.getElementById("table");

  table.innerHTML =
    "<tr><th>Country</th><th>Confirmed</th><th>Recovered</th><th>Deaths</th><th>Active</th></tr>" +
    joint +
    `<tr><th>Total</th><th>${global.confirmed.value}</th><th>${global.recovered.value}</th><th>${global.deaths.value}</th><th>${total_actives}</th></tr>`;

  console.log(joint);
};
