/**
 *  Setup the menu tree for Myopia 
 */
var myopiaItem = chrome.contextMenus.create({
	'title': 'Myopia',
	'contexts': ['all']
});

var checkAddress = chrome.contextMenus.create({
	'title': 'Check address',
	'parentId': myopiaItem,
	'contexts': ['selection'], // This only makes sense with selected text
	'onclick': addLocation 
});

// TODO: Make sure that all the information here is reproduced / transfered to the popup
var previousChecks = chrome.contextMenus.create({
	'title': 'Search results',
	'parentId': myopiaItem,
	'contexts': ['all']
});


/**
 *  Spin up a new item in the contextMenu for the address.  This is only to be used as an onclick
 *  for a chrome.contextMenus item.
 */ 
function addLocation(info, tab) {
	var address = info.selectionText;
	var addressId = chrome.contextMenus.create({
		'title': address,
		'parentId': previousChecks,
		'contexts': ['all'] // Since this is a request, we always want access to it's existence
	});
	
	
	var searchId = chrome.contextMenus.create({
		'title': 'Geocoding...',
		'parentId': addressId,
		'contexts': ['all'] // Same as above
	});
	
	// Slightly modify the request so we can update the item once a result is found
	var update = function(geocode) {
		var completedResult = '';
		if (!geocode || !geocode.results) {
			completedResult = 'Location not found';
		} else {
			// Just use the first one, annotate if non-unique (Can rewrite this later if needed)
			var location = geocode.results[0].geometry.location;
			var closestLocation = computeNeighbor(location['lat'], location['lng'], CANDIDATES);
			if (!closestLocation) {
				completedResult = ''
			}
			completedResult = (geocode.results.length > 1 ? '!' : '') +
				String(closestLocation.distance.toFixed(1)) + 'mi - ' +
				closestLocation.neighbor.location;
		}
		
		chrome.contextMenus.update(searchId, {
			'title': completedResult
		});
	};
	var xhr = getGeocode(address, update);	
}

