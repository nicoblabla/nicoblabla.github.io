let line, map, buses = [];


let f = fetch('cleanLines.json')
    .then(response => response.json());

async function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: 47.1000769, lng: 6.8228485 },
        disableDefaultUI: true,
        styles: [{
            featureType: "poi",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }]
    });

    lines = await f;

    for (let line in lines) {
        for (let stop of lines[line].stops) {
            stop.marker = new google.maps.Marker({
                position: { "lat": stop.lat, "lng": stop.lng },
                icon: {
                    url: "stop.png",
                    anchor: new google.maps.Point(7, 7),
                },
                map: map,
            });
            const infowindow = new google.maps.InfoWindow({
                content: stop.name,
            });
            stop.marker.addListener("click", () => {
                infowindow.open({
                    anchor: stop.marker,
                    map,
                    shouldFocus: false,
                });
            });
            /*new google.maps.Polyline({
                path: stop.path,
                geodesic: true,
                strokeColor: randomColor(),
                strokeOpacity: 1.0,
                strokeWeight: 4,
                map: map
            });*/
        }
        lines[line].polyline = new google.maps.Polyline({
            path: lines[line].path,
            geodesic: true,
            strokeColor: randomColor(),
            strokeOpacity: 1.0,
            strokeWeight: 4,
            map: map
        });

    }

    initBus();
    setInterval(() => {
        update();
    }, 10);
}
function initBus() {
    let s = now();
    for (let l in lines) {
        let stops = lines[l].stops;
        for (let i = 0; i < stops.length - 1; i++) {
            trySpawn(l, i, s);
        }
    }
}

let busID = 0;
class Bus {
    constructor(line, stop) {
        this.line = line;
        this.stop = stop;
        this.id = busID++;
        this.marker = new google.maps.Marker({
            position: { lat: this.line.stops[this.stop].lat, lng: this.line.stops[this.stop].lng },
            map: map,
            icon: {
                url: "bus.png#" + this.id,
                anchor: new google.maps.Point(50, 55),
            },
        });

        this.marker.addListener("click", () => {
            showLine(this.line);
        });
    }

    update(t) {
        let tOriginal = t;
        let stops = this.line.stops;
        let s = this.stop;
        let dep, arr;
        let loop = true;
        while (loop) {
            loop = false;
            dep = stops[s].departure;
            arr = stops[s + 1].arrival;

            if (dep > arr) {
                arr += 600;
                if (t < stops[s].arrival) {
                    t += 600;
                }
            }
            if (t > arr) {
                if (stops[s].departure < stops[s].arrival && t > stops[s].arrival) {
                    break;
                }
                t = tOriginal;
                s = ++this.stop;
                if (s >= stops.length - 1) {
                    this.die();
                    return;
                }
                loop = true;
            }
        }

        let progression = Math.max(0, (t - dep) / (arr - dep));
        let pathLength = stops[s].path[stops[s].path.length - 1].dist;

        let targetPathLength = pathLength * progression;
        let currentPathLength = 0;
        for (let i = 0; i < stops[s].path.length; i++) {
            currentPathLength = stops[s].path[i].dist;
            if (currentPathLength > targetPathLength) {
                let currentPathLength0 = stops[s].path[i - 1].dist;
                let progression2 = (targetPathLength - currentPathLength0) / (currentPathLength - currentPathLength0);
                let lat = stops[s].path[i - 1].lat + progression2 * (stops[s].path[i].lat - stops[s].path[i - 1].lat);
                let lng = stops[s].path[i - 1].lng + progression2 * (stops[s].path[i].lng - stops[s].path[i - 1].lng);
                this.marker.setPosition({ lat, lng });
                let angle = angleFromCoordinate(stops[s].path[i - 1], stops[s].path[i]);
                angle -= Math.PI / 2;
                let scale = "scale(0.8,0.8)";

                if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
                    angle += Math.PI;
                    scale = "scale(-0.8,0.8)"
                }

                if (this.element) {
                    this.element.style.transform = `rotate(${angle}rad) ${scale}`;
                } else {
                    this.element = document.querySelector(`img[src="bus.png#${this.id}"]`);
                }
                break;
            }
        }
    }

    die() {
        this.marker.setMap(null);
        const index = buses.indexOf(this);
        if (index > -1) {
            buses.splice(index, 1);
        }
    }
}

function trySpawn(l, i, time) {
    let stops = lines[l].stops;
    if (stops[i].arrival <= time && time < stops[i + 1].arrival ||
        stops[i + 1].arrival < stops[i].arrival && (stops[i].arrival <= time || (time <= stops[i].arrival && time < stops[i + 1].arrival))) {
        for (let bus of buses) {
            if (bus.line == lines[l] && bus.stop == i) {
                return;
            }
        }
        let b = new Bus(lines[l], i);
        buses.push(b);
        b.update();
    }
}

function update() {
    let time = now();
    for (let bus of buses) {
        bus.update(time);
    }
    for (let l in lines) {
        let i = 0;
        trySpawn(l, i, time);
    }
}


function randomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function dist(p1, p2) {
    return Math.sqrt(Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2));
}

function angleFromCoordinate(p1, p2) {
    let dLon = (p2.lng - p1.lng);
    let y = Math.sin(dLon / 180 * Math.PI) * Math.cos(p2.lat / 180 * Math.PI);
    let x = Math.cos(p1.lat / 180 * Math.PI) * Math.sin(p2.lat / 180 * Math.PI) - Math.sin(p1.lat / 180 * Math.PI) * Math.cos(p2.lat / 180 * Math.PI) * Math.cos(dLon / 180 * Math.PI);
    let brng = Math.atan2(y, x);
    return brng;
}

let ct = 560;
function now() {
    //return (ct+=0.2) % 600;
    let d = new Date();
    return d.getSeconds() + (d.getMinutes() % 10) * 60 + d.getMilliseconds() / 1000;
}

function showLine(wantedLine) {
    for (let l in lines) {
        let line = lines[l];
        let cmap = null;
        if (line == wantedLine)
            cmap = map;
        for (let stop of line.stops) {
            stop.marker.setMap(cmap);
        }
        line.polyline.setMap(cmap)
    }
}