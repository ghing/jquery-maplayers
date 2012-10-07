jquery-maplayers
================

A jQuery plugin to make a Leaflet map of layers from GeoJSON files that can
be toggled on and off.

It uses a declarative syntax that uses attributes of DOM elements to
define map properties.

This plugin was written to make a web map of map layers drawn by
community members in Detroit's 48217 neighborhood during a [DiscoTech](http://detroitdjc.org/discotech/)
event organized by the [Detroit Digital Justice Coalition](http://detroitdjc.org/).

Usage
=====

```
$('#layers li a').maplayers();
```

Each element matched by the jQuery selection should have data attributes
like this:

```
<a href="#"
    data-layer-id="neighborhoods_bought_out"
    data-body-attr="story"
    title="Neighborhoods bought out">
Neighborhoods bought out
</a>

```

At the very least, the elements need to have a ``data-layer-id`` attribute that corresponds to a GeoJSON file of the same name. In the example above, the plugin tries to display a layer from the GeoJSON file ``data/neighborhoods_bought_out.json`` when the the link is clicked.

Data Attributes
===============

* data-layer-id (required) - An id for a map layer.  This also corresponds to a GeoJSON file containing the layer's features.
* data-title-attr - The name of the attribute in the GeoJSON that contains the value that will be used for the title of the popup for a feature in this layer
* data-body-attr - The name of the attribute in the GeoJSON that contains the value that will be used for the body of the popup for a feature in this layer
* data-type-attr - The name of the attribute in the GeoJSON that contains a value that distinguishes different types of features in this layer. This will be shown in the popup along with the title and body

Options
=======

* initialLat - The latitude value of the map's initital center
* intitalLng - The longitude value of the map's initial center
* initialZoom - The initialZoom level of the map
* tileUrl - A string containing a template for map tiles
* attribution - Attribution text for the map data
* dataRoot - URL/path to GeoJSON files.  Defaults to ``data``
* dataExt - Extension of GeoJSON files.  This is used to form the filename from the ``data-layer-id`` value.  Defaults to ``.geojson``
* mapContainer: jQuery object matching the container element where the map will be drawn.  Defaults to ``$('#map')``
* alterEl: Callback function that will be called on each of the elements matching the selector used to instantiate the plugin. By default this is used to assign a background color matching the layer color to the clickable elements.
* alterElOnClick: Callback function that will be called on an element when it is clicked. This is called after the map layer has been shown/hidden. By default, it changes the color and background color of the clickable element when the element is clicked to show the map layer.

License
=======

This software is free software licensed under The MIT License.
