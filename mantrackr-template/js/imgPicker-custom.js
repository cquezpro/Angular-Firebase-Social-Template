(function($){
 	$.fn.extend({ 
 		imgPicker: function(options) {
			if (typeof(options) != "object")
				options = {el: options};

			//Set default values
			var defaults = {
				//el: '',
				upload: true,
				webcam: true,
				width: 400, // Modal width (everything inside will scale)
				swf_url: 'assets/webcam.swf',
				attr: 'src', // Image attribute that will be changed
				title: 'Edit Image', //Modal title
				api: 'includes/api.php',
				//aspectRatio: '1:1',
				timestamp: true
			}
			, stream
			, options =  $.extend(defaults, options);
			  options.width = options.modalWidth || options.width;

			var
			mainTemplate = '<div class="ip-body">'+
				( options.upload ? 
					'<div class="btn btn-primary ip-upload"><span>Upload photo</span><form><input type="file" name="ip-file" class="ip-file"></form></div>' : '' ) +
				( options.webcam ? '<button class="btn btn-info ip-webcam">Webcam</button>' : '' ) +
				'<div class="alert ip-alert"><span></span> <a class="dismiss">&times;</a></div><div class="cropper-container"><div class="cropper-mask"><div class="cropper-overlay"></div><img class="cropper-image" id="cropimg" src=""></div><div class="cropper-slider"><div class="cropper-handle"></div></div></div><div class="webcam-container"><video autoplay></video><div class="preview"></div></div></div><div class="ip-footer"><button class="btn btn-success ip-save">Save</button><button class="btn btn-success ip-capture">Take photo</button><button class="btn btn-default ip-cancel">Cancel</button></div>'
			
			// Modal html template
	        , modalTemplate = function() {
	        	return options.modalTemplate || 
	        		'<div class="ip-modal imgPicker"><div class="ip-dialog"><div class="ip-header"><a class="ip-close">&times;</a><h1>'+options.title +'</h1></div>'+ mainTemplate +'</div></div>';
	        }

	        , inlineTemplate = function() {
				//my code
				jQuery(function($) {
					$('#cropimg').Jcrop();
				});
				
	        	return options.inlineTemplate || '<div class="imgPicker">'+ mainTemplate +'</div>';				
	        }
	        
	        , customInlineTemplate = function(){
	        
	        	return options.customInlineTemplate || '<div class="imgPicker"><div class="ip-body"><div class="alert ip-alert"><span></span> <a class="dismiss">&times;</a></div><div class="cropper-container"><div class="cropper-mask"><div class="cropper-overlay"></div><img class="cropper-image" src=""></div><div class="cropper-slider"><div class="cropper-handle"></div></div></div><div class="webcam-container"><video autoplay></video><div class="preview"></div></div></div></div>';
	        }

			// Remove modal div
	    	, removeModal = function() {
	    		// Remove modal div
	    		if ($('.imgPicker').length)
	    			$('.imgPicker').remove();

	    		// Stop webcam stream (html5)
	    		if (stream)
	    			stream.stop();
	    	}

	    	// Reset uploader & cropper
	    	, reset = function() {
	    		$('.cropper-image, .cropper-handle').attr('style', '');
	    		$('.cropper-container, .webcam-container, .ip-save, .ip-capture').hide(); // Hide cropper, webcam, buttons
	    		alertMessage(0); // Hide alert message
	    		
	    		// Stop webcam stream (html5)
	    		if (stream)
	    			stream.stop();

	    		// Reset image info
	    		for (i in imgInfo)
	    			imgInfo[i] = 0;
	    		imgInfo.s = 1;
	    	}

	    	// Alert helper
	    	, alertMessage = function(message, type) {
	    		var alert = $('.ip-alert');

	   	   		if (message == 0 & !type) {
	    			alert.hide();
	    			return;
	    		}
	   	   		
	   	   		alert.find('span').text(message); // Set alert message
	   	   		
	   	   		switch(type) {
	   	   			case 1: // warning message
						alert.removeClass('alert-danger').addClass('alert-warning');
					break;
	   	   			case 2: // danger message
	   	   				alert.removeClass('alert-warning').addClass('alert-danger');
	   	   			break;
	   	   		}

	   	   		alert.show();

	   	   		// Add click event to hide it
	   	   		alert.on('click', '.dismiss', function(e) {
		    		e.preventDefault();
					$('.ip-alert').hide();
				});
	    	}

	    	// Checks if the borwser supports getUserMedia
	    	, hasGetUserMedia = function() {
	    		return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            			navigator.mozGetUserMedia || navigator.msGetUserMedia);
	    	}

	    	// Checks for touch devices
	    	, is_touch_device = function() {
				return !!('ontouchstart' in window);
			}

			, timestamp = function() {
				return (options.timestamp) ? '?'+ new Date().getTime() : '';
			}

			// Reduce a numerator and denominator to it's smallest
			, reduceRatio = function(numerator, denominator) {
                var temp, divisor,

                gcd = function(a, b) { 
                    if (b === 0) return a;
                    return gcd(b, a % b);
                },

                isInt = function(value) {
                	return /^[0-9]+$/.test(value);
                };

                if (!isInt(numerator) || !isInt(denominator))
                	return [0, 0];

                if (numerator === denominator) 
                	return [1, 1];

                if (+numerator < +denominator) {
                    temp        = numerator;
                    numerator   = denominator;
                    denominator = temp;
                }
                divisor = gcd(+numerator, +denominator);
                return 'undefined' === typeof temp ? [numerator/divisor, denominator/divisor] : [denominator/divisor, numerator/divisor];
            }

			// Cropper image information
	    	, imgInfo = {
				ow: 0,
				oh: 0,
				w: 	0,
				h: 	0,
				at: 0,
				al: 0,
				t: 	0,
				l: 	0,
				s: 	1 // scale
			}

			, cropImg
			// Cropper resize image
			, resizeImg = function (scale) {
				var oldScale = imgInfo.s;

				imgInfo.s = scale || imgInfo.s;

				// Set image width & height
				cropImg.css({
					width: imgInfo.w * imgInfo.s,
					height: imgInfo.h * imgInfo.s
				});

				// Move image
				moveImg({
					t: -((imgInfo.h * oldScale) - (imgInfo.h * imgInfo.s))/2,
					l: -((imgInfo.w * oldScale) - (imgInfo.w * imgInfo.s))/2
				});
			}

			// Cropper move image
			, moveImg = function (move) {
				var mask = $('.cropper-mask');

				imgInfo.t += move.t;
				imgInfo.l += move.l;

				var top = imgInfo.at - imgInfo.t,
					left = imgInfo.al - imgInfo.l;

				if (top > 40) {
					top = 40;
					imgInfo.t = (imgInfo.at == 40) ? 0 : -40;
				} else if (top < -((imgInfo.h * imgInfo.s) - (mask.height() - 40))) {
					top = -((imgInfo.h * imgInfo.s) - (mask.height() - 40));
					imgInfo.t = ((imgInfo.at == 40) ? (imgInfo.h * imgInfo.s) - (mask.height() - 80) : (imgInfo.h * imgInfo.s) - (mask.height() - 40));
				}

				if (left > 40) {
					left = 40;
					imgInfo.l = (imgInfo.al == 40) ? 0 : -40;
				} else if (left < -((imgInfo.w * imgInfo.s) - (mask.width() - 40))) {
					left = -((imgInfo.w * imgInfo.s) - (mask.width() - 40));
					imgInfo.l = ((imgInfo.al == 40) ? (imgInfo.w * imgInfo.s) - (mask.width() - 80) : (imgInfo.w * imgInfo.s) - (mask.width() - 40));
				}

				// Set image position
				cropImg.css({
					top: top,
					left: left
				});
			}

			// Cropper init
	    	, cropper = function(src) {
	    		var mask = $('.cropper-mask'),
	    			img = new Image();
				
				cropImg = $('.cropper-image');

				img.onload = function() {

					options.minWidth  = options.minWidth  || 1;
					options.minHeight = options.minHeight || 1;
						
					/*var cropperWidth = $('#cropper').width(); 
					
					options.width = cropperWidth;*/
					
					if (img.width < options.minWidth)
						return alertMessage('Image requires a minimum width of '+options.minWidth+'px', 2);

					if (img.width < options.minHeight)
						return alertMessage('Image requires a minimum height of '+options.minHeight+'px', 2);

					if (options.maxWidth && img.width > options.maxWidth)
						return alertMessage('Image exceeds maximum width of '+options.maxWidth+'px', 2);

					if (options.maxHeight && img.width > options.maxHeight)
						return alertMessage('Image exceeds maximum height of '+options.maxHeight+'px', 2);

					// Set cropper mask width/height
					var ratio;
					if (options.aspectRatio)
						ratio = (options.aspectRatio || '').split(/:/);
					else if ( $(options.el).length )
						ratio = reduceRatio( $(options.el).width() , $(options.el).height() );
					else 
						ratio = reduceRatio( img.width , img.height );

					var max = options.width - 30,
						mask_width = max * ratio[0],
						mask_height = max * ratio[1];

					if (mask_width > max) {
						mask_height = mask_height / mask_width * max;
						mask_width  = max;
					}

					if (mask_height > max) {
						mask_width  = mask_width / mask_height * max;
						mask_height = max;
					}

					var convertRange = function(val) { return val * ((40*2) / max); }

					if (mask_width > mask_height)
						mask_height += convertRange(mask_width - mask_height);
					else if (mask_height > mask_width)
						mask_width += convertRange(mask_height - mask_width);

					mask.css({
						width: mask_width,
						height: mask_height,
						'margin-left': (mask_width < max) ? (mask_height - mask_width) / 2  : 0
					});

					// Set image source
					cropImg.attr('src', src);

					var img_width  = img.width,
						img_height = img.height,
						ratio = {
							wh: mask.width() / mask.height(),
							hw: mask.height() / mask.width()
						};

					imgInfo.ow = img_width;
					imgInfo.oh = img_height;

					if (img_width * ratio.hw < img_height * ratio.wh) {
						imgInfo.w = mask.width() - (40*2);
						imgInfo.h = imgInfo.w * (img_height / img_width);
						imgInfo.al = 40;
					}
					else {
						imgInfo.h = mask.height() - (40*2);
						imgInfo.w = imgInfo.h * (img_width / img_height);
						imgInfo.at = 40;
					}

					resizeImg();

					$('.cropper-container, .ip-save').show(); // Show cropper, save btn

	            	cropperOverlay(); // Overlay events
	            	cropperSlider();  // Slider events

	            	//$('.ip-save').off("");
	            	
					$('.ip-save').on('click', function(){
						saveImg(src);
					});
					
					if (options.customInline){
						
						$(options.yesButton).on('click', function(){
							
							saveImg(src);
							
						});
						
					}
				};

				img.src = src;
	    	}

	    	// Overlay events (move/touch)
	    	, cropperOverlay = function() {
	    		// Mouse/Touch start
            	$('.cropper-overlay').on('mousedown touchstart', function (e) {
            		var overlay = $(this),
						mousedown = {
							x: (e.pageX || e.originalEvent.changedTouches[0].pageX),
							y: (e.pageY || e.originalEvent.changedTouches[0].pageY)
						},
						elpos = {
							x: overlay.parent().offset().left,
							y: overlay.parent().offset().top
						};

					e.preventDefault();

					// Mouse/Touch move
					$(document).on('mousemove touchmove', function (e) {
						if (e.pageX || (e.originalEvent.changedTouches && typeof e.originalEvent.changedTouches[0] !== undefined)) {
							var mousepos = {
								x: (e.pageX || e.originalEvent.changedTouches[0].pageX),
								y: (e.pageY || e.originalEvent.changedTouches[0].pageY)
							};

							if (parseInt(overlay.css('top')) == 0) {
								overlay.css({
									top: $('.cropper-mask').offset().top,
									left: $('.cropper-mask').offset().left
								});
							}

							moveImg({
								t: parseInt(overlay.css('top')) - (elpos.y - (mousedown.y - mousepos.y)),
								l: parseInt(overlay.css('left')) - (elpos.x - (mousedown.x - mousepos.x))
							});

							overlay.css({
								left: elpos.x - (mousedown.x - mousepos.x),
								top: elpos.y - (mousedown.y - mousepos.y)
							});
						}
					});

					// Mouse stop / Touch end
					$(document).on('mouseup touchend', function () {
						$(document).unbind('mousemove touchmove');
						$('.cropper-overlay').css({top: 0, left: 0});
					});

					return false;
				});
	    	}

	    	// Cropper slider
	    	, cropperSlider = function() {
	    		var handle = $('.cropper-handle'),
            		slider = $('.cropper-slider'),
            		sliderWidth = slider[0].offsetWidth;
				
				var setPercent = function(e) {
					var percent = ((((e.pageX || (e.originalEvent.changedTouches && e.originalEvent.changedTouches[0].pageX)) - slider.offset().left) / sliderWidth)).toFixed(2);
					if (percent < 0) percent = 0;
					if (percent > 1) percent = 1;
					
					handle.css('margin-left', percent * (sliderWidth-5)-5);
					resizeImg(percent*3+1);

					e.preventDefault();
				};

				//Mouse/Touch start
				$(document).on('mousedown touchstart', '.cropper-slider', function(e) {
					//Mouse/Touch move
					$(document).on('mousemove touchmove', function(e){
						if (handle.focus())
							setPercent(e);
					});

					if ($(e.target).hasClass('cropper-slider'))
						handle.addClass('transition');
					setPercent(e);
				});

				//Mouse stop / Touch end
				$(document).on('mouseup touchend', function() {
					$(document).unbind('mousemove touchmove');
					handle.removeClass('transition');
				});
	    	}

	    	// Save image (send request to server)
	    	, saveImg = function(image) {

	    		var mask = $('.cropper-mask')
					saveBtn = $('.ip-save'),
					data = {
						action: 'save',
						x: Math.round( -(parseInt(cropImg.css('left')) - 40) * (imgInfo.ow / (imgInfo.w * imgInfo.s)) ),
						y: Math.round( -(parseInt(cropImg.css('top')) - 40) * (imgInfo.oh / (imgInfo.h * imgInfo.s)) ),
						width: Math.round( (mask.width() - (40*2)) * (imgInfo.ow / (imgInfo.w * imgInfo.s)) ),
						height: Math.round( (mask.height() - (40*2)) * (imgInfo.oh / (imgInfo.h * imgInfo.s)) ),
						type: options.type || '',
						obj_id: options.obj_id || 0,
						data: options.data || {},
						image: image
					};
				
	    		// Send request
				$.ajax({
					url: options.api,
					type: 'POST',
					dataType: 'json',
					data: data,
					beforeSend: function() {
						saveBtn.prop('disable', true);
						alertMessage('Saving image...', 1);
					}
				})
				.done(function(response) {
					if (response.code == 0) {
						if (options.attr == 'src')
							$(options.el).attr('src', options.photoupload_baseuri + response.photo_url);
						else if ( $(options.el).length )
							$(options.el).attr(options.attr, options.photoupload_baseuri + response.photo_url);

						removeModal();
						
						// On complete callback
						if (options.complete)
							options.complete(response.photo_url);
                    } else
                    	alertMessage(response.msg, 2);
				})
				.fail(function() {
					alertMessage('Unexpected error. Try again.', 2);
				})
				.always(function() {
					saveBtn.prop('disable', false);
					
					var cropWnd = $(options.customInline);
            		
            		if (!cropWnd) return;
            		
            		cropWnd.fadeOut(function(){
						removeModal();
					});
            	            		
            		
            		if (options.frontModal) $(options.frontModal).modal('show');
				});
				
			}

	    	// HTML5 upload method via FileRender
	    	, html5Upload = function(button) {
	    		var file = $(button)[0].files[0],
				 	imageType = /image.*/;

				if (!file.type) // Fix for Dolphin browser
					return iframeUpload(button);
				
				if (file.type.match(imageType) && file.type != 'image/bmp') {
					alertMessage('Uploading...', 1);

					var reader = new FileReader();
					reader.onload = function(e) {
						cropper(reader.result);
						button.parent()[0].reset();
						alertMessage(0);
					}
					reader.readAsDataURL(file);

				} else 
					alertMessage('Filetype not allowed', 2);
	    	}

	    	// HTML5 webcam via getUserMedia
	        , html5Webcam = function() {
            	var container = $('.webcam-container'),
            		video = container.find('video')[0];
		            	
		        navigator.getUserMedia = (navigator.getUserMedia ||
		                            navigator.webkitGetUserMedia ||
		                            navigator.mozGetUserMedia ||
		                            navigator.msGetUserMedia);

	            navigator.getUserMedia({ video: true }, function (localMediaStream) {
	            	stream = localMediaStream;
	                video.src = window.URL.createObjectURL(localMediaStream);
	                
	                $(video).css('max-width', options.width-30).show();
	                container.show();
	                $('.ip-capture').show();

	                // Click event on the capture button / Tap on touch devices
	                $('.ip-capture, .touch video').on('click', function() {
		            	// Save the image in a canvas 
		            	var canvas = document.createElement('canvas'),
		            		ctx = canvas.getContext('2d');

		            	canvas.width = video.videoWidth;
		                canvas.height = video.videoHeight;
		                ctx.drawImage(video, 0, 0);
		                
		                // Read image data from canvas
		                var imageData = canvas.toDataURL("image/png");
		                localMediaStream.stop(); // Stop webcam stream
		                container.hide(); $('.ip-capture').hide();

		                cropper(imageData); // Show cropper
		            });

	            }, function(error) {
					alertMessage('Webcam Error: '+error.name, 2);
			    });
            }

            // Iframe upload for old browsers
	    	, iframeUpload = function (button) {
	    		// Create iframe & append it to body
	            var iframe = $('<iframe id="ip-iframe" name="ip-iframe"></iframe>').css('display', 'none');
	            $('body').append(iframe);
	         
	            // Add load event
	            iframe.on('load', function () {
	                // Message from server
	                var content = iframe.contents().find('body').html();

	                content = stripHTMLTags(content);
	                
	                try {
	                	var response = jQuery.parseJSON(content); // Convert to json
	                }
	                catch(e) {}

	                if (response) {
	                    if (response.code == 0) {
	                    	alertMessage(0);
	                    	// Show cropper
	                    	cropper(options.photoupload_baseuri + response.photo_url);
	                    } else
	                    	alertMessage(response.data, 2);
	                } else 
	                	alertMessage('Error ! (malformed json)', 2);
	     
	                // Delete the iframe & form
	                setTimeout(function(){ $('#ip-form, #ip-iframe').remove(); button.parent()[0].reset(); }, 250);
	            });

	            // Create form & append to body
	            var form = $('<form/>', {id: 'ip-form', method: 'post', action: options.api,
	            	enctype: 'multipart/form-data', encoding: 'multipart/form-data', target: 'ip-iframe'}).css('display', 'none');
	            
	            var inputs  = {
	            	action: 'upload',
	            	type: options.type || '',
	            	obj_id: options.obj_id || 0
	            };

	            for (var i in inputs)
					form.append( $('<input/>', {type: 'hidden', name: i, value: inputs[i]}) );
	           
	            $('body').append(form);
	            
	            var parent = button.parent();

	            // Append input file to form & submit
	            $('#ip-form').append( button );
	            form.submit();
	            parent.append(button);
	            alertMessage('Uploading...', 1);
	        }

	        // Flash webcam
	        , flashWebcam = function() {
	        	var container = $('.webcam-container'),
	        		width = options.width - 30,
					height = options.width * .8;

				// Set webcam html & show it
				container.find('.preview').html( webcam.get_html(options.swf_url, width, height, width+200, height+200) );
				container.show();

				// Click event on the capture button
				$('.ip-capture').on('click', function() {
					webcam.snap(); // Send request to webcam.swf and recive response
				});
				
				// The webcam flash was loaded
				webcam.loaded = function() {
					$('.ip-capture').show(); // Show capture button
				};

				// Success response from webcam.swf
				webcam.complete = function(data) {
					if (data) {
						container.hide();
						$('.ip-capture').hide();
						cropper('data:image/png;base64,'+data); // Show cropper
					}
					else
						flashWebcam(); // Try again
				};

				//Webcam error
				webcam.error = function(error) {
					alertMessage('Webcam Error: '+error, 2);
				};
	        };

	    	
	    	// Start plugin here
            return this.each(function() {
				
            	if (options.customInline){

            		var fileInputElement = undefined;
            		
            		if (options.fileInputId)
            			fileInputElement = $(options.fileInputId);
            		else
            			fileInputElement = $('.ip-file', this);
            		
            		fileInputElement.on('change', function() {
					
						var img = $(options.el);
						
						var cropWnd = $(options.customInline);
	            		
	            		if (!cropWnd) return;
	            		
	            		removeModal();
	            		
	            		var template = customInlineTemplate(); // Inline template
	            		//var template = inlineTemplate();
						$(options.inline).append(template);
	            		            		
	            		if (is_touch_device())
	            			$('.imgPicker').addClass('touch');
	            		
	            		var ua = navigator.userAgent.toLowerCase();
						if (ua.indexOf('msie 7.0') >= 0)
							$('.imgPicker').addClass('isIE7');
	            		
						$('.noButton', cropWnd).on('click', function(e) {
							cropWnd.fadeOut(function(){
								removeModal();
							});
							
							if (options.frontModal) $(options.frontModal).modal('show');
							
							e.preventDefault();
						});
						
						cropWnd.fadeIn();
						
						if (options.frontModal) $(options.frontModal).modal('hide');
						
						
						reset();
						
						$(options.yesButton).off("");
						

						if (window.File && window.FileReader 
						 	&& window.FileList && window.Blob)
						 	html5Upload( $(this) );
						else 
						 	iframeUpload( $(this) );
		            });

            		return;
            	}
            	
				$(this).on('click', function() {
					// Check if the image exists
					var img = $(options.el);
					
					removeModal(); // Remove previous modal
					if (options.inline) {
						var template = inlineTemplate(); // Inline template
						$(options.inline).append(template);
					}else {
						var template = modalTemplate(); // Modal template
						$('body').append(template); // Append to body
						$('.ip-dialog').css({width: options.width, marginLeft: - options.width / 2}); // Add width/height
					}	

					// Add .touch class for touch devices
					if (is_touch_device())
						$('.imgPicker').addClass('touch');

					// Check if is IE7
					var ua = navigator.userAgent.toLowerCase();
					if (ua.indexOf('msie 7.0') >= 0)
						$('.imgPicker').addClass('isIE7');

					// Show
					$('.imgPicker').fadeIn();

					// Close/Cancel button event
			    	$('.ip-close, .ip-cancel').on('click', function(e) {
			    		$('.imgPicker').fadeOut(function(){
							removeModal();
						});
						e.preventDefault();
					});

			    	// Upload file event
					$('.ip-upload .ip-file').on('change', function() {
						reset();

						if (window.File && window.FileReader 
						 	&& window.FileList && window.Blob)
						 	html5Upload( $(this) );
						else 
						 	iframeUpload( $(this) );
		            });

					// Webcam event
		            $('.ip-webcam').on('click', function() {
		            	reset();

		            	if (hasGetUserMedia())
		            	 	html5Webcam();
		            	else
		            		flashWebcam();
		            });

		            if (options.open) {
		            	if (options.open == 'upload') 
							$('.ip-upload .ip-file').trigger('click');
						else if (options.open == 'webcam')
							$('.ip-webcam').trigger('click');
					}
				});
    		});
    	}
	});
})(jQuery);

// JPEGCam by Joseph Huckaby - https://code.google.com/p/jpegcam/
// (just the basic functions are used) 
window.webcam = {
	_loaded: false,
	loaded: null,
	complete: null,
	error: null,

	// Return html to embed webcam.swf flash
	get_html: function(swf, w, h, sw, sh) {
		return '<object id="webcam_movie" type="application/x-shockwave-flash" data="'+swf+'" width="'+w+'" height="'+h+'"><param name="wmode" value="transparent"></param><param name="movie" value="'+swf+'"/><param name="FlashVars" value="width='+w+'&height='+h+'&server_width='+(sw||w)+'&server_height='+(sh||h)+'"/><param name="allowScriptAccess" value="always"/></object>';
	},

	// Send request to webcam.swf
	snap: function() {
		if (!this._loaded) 
			return alert('ERROR: Movie is not loaded yet');
		var movie = document.getElementById('webcam_movie');
		if (!movie) 
			alert('ERROR: Cannot locate movie webcam_movie in DOM');

		movie._snap();
	},
		
	// webcam.swf will call this function
	notify: function(type, msg) {
		switch (type) {
			case 'loaded':
				this._loaded = true;
				this.loaded();
			break;

			case 'error':
				this.error(msg);
			break;

			case 'success':
				this.complete(msg);
			break;
		}
	}
};

/*
Support:

	Desktop:
		Chrome, Firefox, Opera (html5)
		Safari (flash webcam & iframe upload)
		Safari 7 (flash webcam & html5 upload) (not tested)
		IE7/8 (flash webcam & iframe upload - a little buggy)
		IE9 (flash webcam & iframe upload)
		IE10, IE11 (flash webcam & html5 upload)
		
	Mobile:
		Chrome, Firefox, Safari (html5)
		Opera mobile - only upload (html5)
		Safari - only upload (iframe upload) (not tested)
		Safari 6-7 only upload (html5 upload) (not tested)
		Dolphin Browser - only upload (iframe upload)
*/