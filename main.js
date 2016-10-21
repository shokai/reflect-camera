navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ;
window.URL = window.URL || window.webkitURL ;

function initialize() {
  navigator.getUserMedia(
	{audio: true, video: true},
	function(stream) {
	  var video = document.getElementById('video');
	  video.src = URL.createObjectURL(stream);
	  video.play();
	  renderStart();
	},
	function(error) {
	  console.error(error);
	}
  );
}

function renderStart() {
  var video = document.getElementById('video');
  var buffer = document.createElement('canvas');
  var display = document.getElementById('display_canvas');
  var bufferContext = buffer.getContext('2d');
  var displayContext = display.getContext('2d');

  var render = function() {
	requestAnimationFrame(render);
	var width = video.videoWidth;
	var height = video.videoHeight;
	if (width == 0 || height == 0) {return;}
	buffer.width = display.width = width;
	buffer.height = display.height = height;
	bufferContext.drawImage(video, 0, 0);

	var src = bufferContext.getImageData(0, 0, width, height);
	var dest = bufferContext.createImageData(buffer.width, buffer.height);
    for (var i = 0; i < dest.data.length; i += 4) {
      dest.data[i + 0] = src.data[dest.data.length - i + 0];
      dest.data[i + 1] = src.data[dest.data.length - i + 1];
      dest.data[i + 2] = src.data[dest.data.length - i + 2];
      dest.data[i + 3] = 255;
    }

	displayContext.putImageData(dest, 0, 0);
  };
  render();
}

window.addEventListener('load', initialize);
