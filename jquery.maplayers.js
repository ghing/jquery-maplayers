(function( $ ) {
  
  var randomColorVal = function() {
    return Math.floor(Math.random() * 255);
  };
  var randomRgb = function() {
    return {
      r: randomColorVal(),
      g: randomColorVal(),
      b: randomColorVal()
    }
  };
  var rgbString = function ( rgb ) {
    return "rgb(" + rgb['r'] + "," + rgb['g'] + "," + rgb['b'] + ")";
  };
  var parseRgb = function ( rgbs ) {
    var re = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
    var matches = rgbs.match(re);
    return { r: matches[1], b: matches[2], g: matches[3] };
  };
  // Based on algorithm by Gacek
  // http://stackoverflow.com/a/1855903/386210 
  var contrastColor = function( color, bright, dark ) {
    var a = 1 - ( 0.299 * color.r + 0.587 * color.g + 0.114 * color.b)/255;
    // Default to black for bright background colors and white for
    // light background colors
    bright = bright || { r: 0, g: 0, b: 0 };
    dark = dark || { r: 255, g: 255, b: 255 };

    if (a < 0.5) {
      // Bright background color
      return bright;
    }
    else {
      // Dark background color
      return dark;
    }
  };
  var addColorData = function ( $el ) {
    var color = randomRgb();
    $el.data('color', rgbString(color));
  };
  var setColor = function ( $el ) {
    var color;
    if ($el.hasClass('selected')) {
      color = $el.data('color');
      $el.css({
        'background-color': color,
        'color': rgbString(contrastColor(parseRgb(color)))
      });
    }
    else {
      // Reset colors to defaults 
      $el.css({
        'background-color': '',
        'color': ''
      });
    }
  };
  $.fn.maplayers = function( options ) {
      var settings = $.extend( {
        initialLat: 42.27487077,
        initialLng: -83.15812993,
        initialZoom: 13,
        tileUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: 'Map data &copy; 2012 OpenStreetMap contributors',
        dataRoot: "data",
        dataExt: ".geojson",
        mapContainer: $('#map'),
        alterEl: addColorData,
        alterElOnClick: setColor
      }, options);

      var map = L.map(settings.mapContainer[0]).setView([settings.initialLat, settings.initialLng], settings.initialZoom);
      var layers = {};
      var showLayer = function(layerId, layers, map) {
        layers[layerId].addTo(map);
      };
      var getLayer = function(id, layers, map, options) {
          var filename = settings.dataRoot + "/" + id + settings.dataExt;
          var addPopup = function(featureData, layer) {
            var content = [];
            var title = options.titleAttr ? featureData.properties[options.titleAttr] : null;
            var body = options.bodyAttr ? featureData.properties[options.bodyAttr] : null;
            var type = options.typeAttr ? featureData.properties[options.typeAttr] : null;
            if (title) {
              content.push("<strong>" + title + "</strong>");
            }
            if (type) {
              content.push("<p>" + type + "</p>");
            }
            if (body) {
              content.push(body);
            }
            if (content.length > 0) {
              layer.bindPopup(content.join("\n"));
            }
          };
          var getStyle = function(featureData) {
            var style = {};
            if (options.color) {
              style.color = options.color;
            }
            return style;
          };
          var getMarker = function(feature, latlng) {
            var markerOptions = {
              fillOpacity: 1.0
            };
            if (options.color) {
              markerOptions.fillColor = options.color;
            }
            return L.circleMarker(latlng, markerOptions); 
          };
          if (layers[id] === undefined) {
            $.getJSON(filename, function(data) {
              layers[id] = L.geoJson(data, {
                onEachFeature: addPopup,
                pointToLayer: getMarker,
                style: getStyle
              });
              options.callback(id, layers, map);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
              // TODO: Cleaner error handling 
            });
          }
          else {
            options.callback(id, layers, map);
          }
      };
      var toggleLayer = function(evt) {
          var $target = $(evt.target);
          var layerId = $target.data('layer-id');
          var titleAttr = $target.data('title-attr');
          var bodyAttr = $target.data('body-attr');
          var typeAttr = $target.data('type-attr');
          var color = $target.data('color');
          if ($target.hasClass('selected')) {
              map.removeLayer(layers[layerId]);
          }
          else {
              getLayer(layerId, layers, map, { 
                callback: showLayer,
                titleAttr: titleAttr,
                bodyAttr: bodyAttr,
                typeAttr: typeAttr,
                color: color
              }); 
          }
          $target.toggleClass('selected');
          settings.alterElOnClick($target);
          evt.preventDefault();
      };
      L.tileLayer(settings.tileUrl, {
        attribution: settings.attribution,
        maxZoom: 18
      }).addTo(map);
      if (settings.defaultLayer) {
        getLayer(settings.defaultLayer, layers, map, {
          callback: showLayer
        });
      }
      return this.each(function() {
        var $this = $(this);
        settings.alterEl($this);
        $this.click(toggleLayer);
      });
  };
})( jQuery );
