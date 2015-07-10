# Myopia

A (wildly developmental) Chrome plugin for checking the nearest neighbor to a given location.

## Background
 
This is pretty much a one-off personal project, as a half proof-of-concept, half-estimation,
but can be extended to something that is more general and useful in a couple of ways:

  * Uploading a CSV into the widget to get the candidate points
  * Returning the k-nearest neighbors from the base point
  * Open the points in a map with an overlay, like all the cool websites do
  * Probably not brute force just about everything 


## To Make It Work
  
If you're still absolutely convinced you _must_ have this plugin, read on.  In order for places to
exist in your plugin, you will need to create a file with the following contents:

__geodata.js__

```
var CANDIDATES = [
   ...{'lat': 45.5230622, 'lon': -122.6764816, 'location': 'Portland, OR'}
]
```

This is loaded directly onto the page and used in the neighbor search.
    
