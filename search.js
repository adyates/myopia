var GEORADIUS_MI = 3959
var GOOGLE_CEOCODE_API = 'https://maps.googleapis.com/maps/api/geocode/json'


/**
 * @callback geoHandler
 * @param {Object} geocodeResult - The result of the geocoding API call, parsed JSON 
 */
	
/**
 * Perform the Geocode fetch for a given postal-like address, handling a completed result with
 * the passed in response handler.
 * 
 * @param {string} address - A postal-like address (such as Boston, MA).
 * @param {geoHandler} handler - Function to be called when the response returns successfully.
 */
function getGeocode(address, handler) {
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.onreadystatechange = function() {
		if (xhr.readystate < xhr.DONE || !xhr.status) { return;}
		if (xhr.status && xhr.status >= 400) {
			console.log('There was a Google Geocode API error');
			console.error(xhr.status);
			console.error(xhr.response);
		} else {
			handler(xhr.response);
		}
	};
	xhr.open('GET', GOOGLE_CEOCODE_API + '?address=' + address, true);
	xhr.send();
}	
	
/**
 * Simple conversion of decimal degrees to radians.
 * @param {Number} deg - Number in decimal degrees
 * @returns {Number} Number in radians
 */
function toRadians(deg) {
	return deg * Math.PI / 180;
}


/**
 * Compute the distance between two points of Latitude /Longitude using the Haversine formula.
 * More details can be found here: http://www.movable-type.co.uk/scripts/latlong.html
 *  
 * @param {Number} lat1 - Latitude of the first point (In decimal degrees)
 * @param {Number} lon1 - Longitude of the first point (In decimal degrees)
 * @param {Number} lat2 - Latitude of the second point (In decimal degrees)
 * @param {Number} lon2 - Longitude of the second point (In decimal degrees)
 * @returns {Number} The distance between the two points in miles
 */
function geodistance(lat1, lon1, lat2, lon2) {
	var rlat1 = toRadians(lat1);
	var rlat2 = toRadians(lat2);
	var dLat = toRadians(lat2 - lat1);
	var dLon = toRadians(lon2- lon1);
	
	var a = Math.pow(Math.sin(dLat), 2) + 
		Math.cos(rlat2) * Math.cos(rlat1) * Math.pow(Math.sin(dLon), 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return c * GEORADIUS_MI;
}


/**
 * Computes the closes candidate to a given Latitude and Longitude, returning the result.
 * 
 * @param {Number} lat - Latitude for the reference point (In decimal degrees)
 * @param {Number} lon - Longitude for the reference point (In decimal degrees)
 * @param {Object[]} candidates - Candidate locations for comparison.  All candidates are assumed to be
 * 	 objects with the properties `lat` and `lon` which correspond to the Latitude and Longitude in
 *   decimal degrees.
 * @returns {Object} The item that is closest to the given point.
 */
function computeNeighbor(lat, lon, candidates) {
	if (!candidates || !candidates.length) { return null;}
	
	var result = {
		'neighbor': candidates[0],
		'distance': geodistance(lat, lon, candidates[0].lat, candidates[0].lon)
	}
	
	_.forEach(candidates, function(location) {
		var newDistance = geodistance(lat, lon, location.lat, location.lon);
		if (result.distance > newDistance) {
			result.neighbor = location;
			result.distance = newDistance;
		}
	});
	return result; 
}
