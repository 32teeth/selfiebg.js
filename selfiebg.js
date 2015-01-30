var selfiebg = (function(){
	/*
	** @param video {object}
	** @description video and video id
	*/
	var video;
	var video_id = 'selfiebg_video';

	/*
	** @param canvas {object}
	** @description canvas and canvas id
	*/
	var canvas;
	var canvas_id = 'selfiebg_canvas';	

	/*
	** @param overlay {object}
	** @description overlay, overlay id, overlay image (scan lines)
	*/
	var overlay;
	var overlay_id = 'selfiebg_overlay';
	var overlay_bg = 'selfiebg.png';

	/*
	** @param button {object}
	** @description button and button id
	*/
	var button;
	var button_id = 'selfiebg_button';
	var button_text = 'x';
	/*
	** @param button_require {boolean} [true|false]
	** @description add button to stop stream once invoked
	*/	
	var button_require = false;


	/*
	** @param ctx {object} canvas context
	*/
	var ctx;

	/*
	** @param lms {object} media stream
	*/	
	var lms;

	/*
	** @param mobile {boolean}
	** @description only run in non mobile devices
	*/	
	var mobile;


	/*
	** @method setup
	** @description check mobile, adjust boddy padding, add elements, set media
	*/
	function setup()
	{
		/*
		** @description check if mobile device
		*/
		if(navigator.userAgent.match(/(iPad|iPhone|iPod)/g) || navigator.userAgent.match(/(Android)/g)){mobile = true;}

		/*
		** @description proceed only if not mobile device
		*/
		if(!mobile)
		{
			/*
			** @description add required elements to page
			*/			
			var body = document.querySelector('body');
			body.style.margin = 0;
			body.style.padding = 0;
			/*
			** @description add required elements to page
			*/
			addVideo();
			addCanvas();
			addOverlay();
			/*
			** @description set getMedia property
			*/
			setMedia();
			/*
			** @description start streaming
			*/
			start();
		}
	}

	/*
	** @method addVideo
	** @description add video element to page
	*/
	function addVideo()
	{
		var video = document.createElement('video');
		video.setAttribute('id', video_id);
		video.setAttribute('autoplay', true);
		video.setAttribute('width', 400);
		video.setAttribute('height', 300);	
		video.style.display = 'none';

		document.body.appendChild(video);		
	}

	/*
	** @method addCanvas
	** @description add canvas element to page
	*/
	function addCanvas()
	{
		var canvas = document.createElement('canvas');
		canvas.setAttribute('id', canvas_id);
		canvas.style.display = 'block';
		canvas.style.zIndex = '-2';
		canvas.setAttribute('width', 400);
		canvas.setAttribute('height', 300);		
		canvas.style.position = "fixed";
		canvas.style.top = 0;
		canvas.style.bottom = 0;
		canvas.style.left = 0;
		canvas.style.right = 0;		

		document.body.appendChild(canvas);
	}

	/*
	** @method addOverlay
	** @description add overlay div element to page
	*/
	function addOverlay()
	{
		var overlay = document.createElement('overlay');
		overlay.setAttribute('id', overlay_id);
		overlay.style.display = 'block';
		overlay.style.background = "url('" + overlay_bg + "')";	
		overlay.style.width = "100%";
		overlay.style.height = "100%";
		overlay.style.position = "fixed";		
		overlay.style.zIndex = '-1';
		overlay.style.top = 0;
		overlay.style.bottom = 0;
		overlay.style.left = 0;
		overlay.style.right = 0;			

		document.body.appendChild(overlay);	
	}

	/*
	** @method addButton
	** @description add close button to page
	*/
	function addButton()
	{
		var button = document.createElement('button');
		button.setAttribute('id', button_id);
		button.innerHTML = button_text;
		button.style.display = 'block';
		button.style.position = "fixed";
		button.style.right = "1rem";
		button.style.top = "1rem";
		button.style.zIndex = '9999';	

		button.addEventListener("click", function(){selfiebg.stop();this.style.display = "none";});

		document.body.appendChild(button);	
	}

	/*
	** @method setMedia
	** @description set navigators getMedia property object based on browser capabilities
	*/
	function setMedia()
	{
		navigator.getMedia = ( 
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia
		);
		window.URL = window.URL || window.webkitURL;		
	}

	/*
	** @method start
	** @description 
	*/
	function start()
	{
		video = document.getElementById(video_id);
		canvas = document.getElementById(canvas_id);
		ctx = canvas.getContext('2d');

		navigator.getMedia(
			{video: true,audio: false},
			function(stream){
	  			video.src = window.URL.createObjectURL(stream);
	  			lms = stream;

	  			if(button_require){addButton();}
	  			setTimeout(function(){background();},500);
			},
			function(err){

			}
		);	
	}
	/*
	** @method stop
	** @description stop stream and video
	*/
	function stop()
	{
		lms.stop();
		video.pause();		
	}
	/*
	** @method background
	** @description update the background with the canvas image output from the video stream
	*/
	function background()
	{
		var width = window.innerWidth;
		var height = window.innerHeight;
		setInterval(function(){
			width = window.innerWidth;
			height = window.innerHeight;

			if(width > height){height = width * 0.74;}
			if(height > width){width = height * 1.33;}

			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);	

			ctx.drawImage(video, 0, 0, width, height);		
		},100);
	}
	/*
	** public methods returned in module reveal pattern
	*/
	return {
		setup:function(){setup();},
		start:function(){start();},
		stop:function(){stop();}
	}
})();

selfiebg.setup();