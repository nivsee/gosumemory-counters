let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");

socket.onopen = () => console.log("Successfully Connected");

socket.onclose = event => {
  console.log("Socket Closed Connection: ", event);
  socket.send("Client Closed!");
};

socket.onerror = error => console.log("Socket Error: ", error);

let difficulty = document.getElementById('difficulty');
let background = document.getElementById('background');
let title = document.getElementById('title');
let mapStatus = document.getElementById('rankStatus');
let rankIcon = document.getElementById('icon')
let stars = new CountUp('stars', 0, 0, 2, .5, { useEasing: true, useGrouping: false, separator: " ", decimal: "." })

let rankedStatus;
let icon;

socket.onmessage = event => {
  try {
    let data = JSON.parse(event.data), menu = data.menu, play = data.gameplay;

    
    if(menu.bm.rankedStatus === 7){
      rankedStatus = "Loved"
      rankIcon.style = "color: orangered"
      icon = ""
    } else if (menu.bm.rankedStatus === 4){
      rankedStatus = "Ranked"
      rankIcon.style = "color: dodgerblue"
      icon = ""
    } else if (menu.bm.rankedStatus === 6){
      rankedStatus = "Qualified"
      rankIcon.style = "color: lime"
      icon = ""
    } else {
      rankIcon.style = "color: gray"
      rankedStatus = "Unranked"
      icon = "?"
    }

    console.log(menu.bm.rankedStatus)

    data.menu.bm.path.full = data.menu.bm.path.full.replace("\\", "/");
    background.style.background = "url(\"" + "http://" + location.host + `/Songs/${data.menu.bm.path.full}` + "\")";
    background.style.backgroundPosition = "center";
    background.style.backgroundSize = "cover";

    title.innerHTML = menu.bm.metadata.artist + " - " + menu.bm.metadata.title;
    mapStatus.innerHTML = rankedStatus;
    rankIcon.innerHTML = icon
    difficulty.innerHTML = "[" + menu.bm.metadata.difficulty + "]";
    stars.update(menu.bm.stats.SR)
  } catch (err) { console.log(err); };
};