// import config from './config'

// const CALLBACK_NAME = 'gmapsCallback';

// let initialized = !!window.L;

/*
let resolveInitPromise;
let rejectInitPromise;

const initPromise = new Promise((resolve, reject) => {
  resolveInitPromise = resolve;
  rejectInitPromise = reject;
});
 */

let initPromise = null;


function loadScriptStylePromise(tagName, params_array)
{
  return new Promise((resolve, reject) => {
    const tag = document.createElement(tagName);

    for (let i = 0; i < params_array.length; i++) {
      let obj = params_array[i]
      for (let name in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, name)) {
          tag[name] = obj[name];
        }
      }
    }

    tag.onload  = () => { window.console.log('tag loaded'); resolve() };
    tag.onerror = () => { window.console.log('tag error');  reject() };
    window.console.log('setup new head tag')
    window.console.log(tag)

    document.head.appendChild(tag);
    window.console.log('aggiunto al head')
  });
}

export function initMap() {

  if (initPromise) {
    // alert('map already initialized?')
    return initPromise;
  }

  initPromise = new Promise(async (resolve, reject) => {

    try {
      // leaflet
      /*await*/ loadScriptStylePromise('link',[{'href':'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css'},{'rel':'stylesheet'}])
      await loadScriptStylePromise('script',[{'src':'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js'}])

      // clustering plugin
      /*await*/ loadScriptStylePromise('link',[{'href':'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css'},{'rel':'stylesheet'}])
      /*await*/ loadScriptStylePromise('link',[{'href':'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css'},{'rel':'stylesheet'}])
      await loadScriptStylePromise('script',[{'src':'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js'}])

      resolve(window.L);
    }
    catch (e) {
      reject(e)
    }
  });

   return initPromise;
}

export function getMapStyles() {
  return [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4d4f5c"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4d4f5c"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ]
}
