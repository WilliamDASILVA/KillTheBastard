function getRandom(min, max){
    return Math.random() * (max - min) + min;
}
function getDistanceBetween2Points(aX, aY, bX, bY){
	return Math.sqrt(Math.pow((bY - aY), 2) + Math.pow((bX - aX), 2));
}

self.addEventListener('message', function(e) {
	var checkpoints = JSON.parse(e.data.checkpoints);
	var canSpawn = false;

	var pos = null;
	var stepNumber = 0;


	while(!canSpawn){
		stepNumber++;
		pos = {
            x: getRandom(32, e.data.screenSize.width - 32),
            y : getRandom(32, e.data.screenSize.height - 32)
        }

        var distanceOk = true;
		for (var i = checkpoints.length - 1; i >= 0; i--) {
			var position = checkpoints[i].position;
			var radius = checkpoints[i].radius;
			var distance = getDistanceBetween2Points(position.x, position.y, pos.x, pos.y);
			if(distance <= radius * 2){
				distanceOk = false;
			}
		}

		if(distanceOk){
			canSpawn = true;
		}
	}
	if(canSpawn && pos){
		self.postMessage({
			"keep" : true,
			"position" : pos
		});
	}

	if(stepNumber >= 200){
		// Cancel the worker because it can't find solution
		self.postMessage({
			"keep" : false
		});

		self.close();

	}

}, false);