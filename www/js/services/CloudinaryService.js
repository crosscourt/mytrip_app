angular.module('myApp').service('CloudinaryService', function ($http) {
  
	// create SHA1 HEX digest for
	// "public_id=sample&timestamp=1315060510abcd"
	var api_sign_request = function(params_to_sign, api_secret) {
		var to_sign = [];
		for (var k in params_to_sign) {
			var v = params_to_sign[k];
			if (v) {
				to_sign.push("" + k + "=" + (build_array(v).join(",")));
			}
		}
		to_sign.sort();
		return "" + CryptoJS.SHA1(to_sign.join("&") + api_secret);
	};

	function build_array(arg) {
		if (!arg) {
		  return [];
		} else if ($.isArray(arg)) {
		  return arg;
		} else { 
		  return [arg];
		}
	}

	var timestamp = function() {
		return Math.floor(new Date().getTime() / 1000);
	};

	var build_eager = function(transformations) {
		transformations = build_array(transformations);
		var results = [];
		for (var _i = 0, _len = transformations.length; _i < _len; _i++) {
			var transformation = transformations[_i];
			transformation = _.clone(transformation);
			results.push(_.filter([$.cloudinary.transformation_string(transformation), transformation.format], present).join("/"));
		}
		return results.join("|");
	};

	var build_custom_headers = function(headers) {
		if (!(headers != null)) {
			return undefined;
		} else if (_.isArray(headers)) {
			return headers.join("\n");
		} else if (_.isObject(headers)) {      
			var _results = [];
			for (var k in headers) {
				_results.push(k + ": " + headers[k]);
			}
			return _results.join("\n");
		} else {
			return headers;
		}
	};

	var build_upload_params = function(options) {
		var params;
		params = {
			transformation: $.cloudinary.transformation_string(options),
			public_id: options.public_id,
			callback: options.callback,
			format: options.format,
			backup: options.backup,
			faces: options.faces,
			exif: options.exif,
			image_metadata: options.image_metadata,
			colors: options.colors,
			type: options.type,
			eager: build_eager(options.eager),
			headers: build_custom_headers(options.headers),
			use_filename: options.use_filename,
			discard_original_filename: options.discard_original_filename,
			notification_url: options.notification_url,
			eager_notification_url: options.eager_notification_url,
			eager_async: options.eager_async,
			invalidate: options.invalidate,
			proxy: options.proxy,
			folder: options.folder,
			tags: options.tags && build_array(options.tags).join(",")
		};
		return params;
	};

	var build_api_url = function(action, options) {
		if (action == null) { action = 'upload'; }
		if (options == null) { options = {}; }
		var cloudinary = options.upload_prefix || $.cloudinary.config().upload_prefix || "https://api.cloudinary.com";
		var cloud_name = options.cloud_name || $.cloudinary.config().cloud_name;
		if (!cloud_name) throw "Must supply cloud_name";
		var resource_type = options.resource_type || "image";

		// https://api.cloudinary.com/v1_1/cloud_name/image/upload
		return [cloudinary, "v1_1", cloud_name, resource_type, action].join("/");
	};

	var call_api = function(action, callback, options, get_params) {
		options = _.clone(options);
		var api_key = options.api_key || $.cloudinary.config().api_key;
		if (!api_key) throw "Must supply api_key";

		var tmp_params = get_params.call();
		var params = tmp_params[0];
		var unsigned_params = tmp_params[1];
		var file = tmp_params[2];
		
		if (options.signature && options.timestamp) {
			params.signature = options.signature;
			params.timestamp = options.timestamp;
		} else {
			var api_secret = options.api_secret || $.cloudinary.config().api_secret;
			if (!api_secret) throw "Must supply api_secret";
			params.timestamp = timestamp();
			params.signature = api_sign_request(params, api_secret);
		}
		
		params.api_key = $.cloudinary.config().api_key;
		params = _.extend(params, unsigned_params);

		var api_url = build_api_url(action, options); // + "?";

    /*
    for (var key in params) {
      var value = params[key];
      if (_.isArray(value)) {
        for (var _i = 0, _len = value.length; _i < _len; _i++) {
          api_url += encodeURIComponent(key+"[]") + "=" + encodeURIComponent(value[_i]) + "&";
        }
      } else if (present(value)) {
        api_url += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
      }
    }

    api_url += "api_key=" + api_key;
    var files = null;
    if (file) {
      file.name = "file";
      files = [file];
    } 
    */

		if (file.lastIndexOf("file", 0) === 0)
		{
			upload_file_using_fileTransfer(api_url, file, params);
		}
		else {
			upload_file_using_http(api_url, file, params);
		}
		
		return true;
	};
	
	var upload_file_using_fileTransfer = function(api_url, fileURI, params) {
		var uploadOptions = new FileUploadOptions();
		uploadOptions.fileKey = "file";
		uploadOptions.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
		uploadOptions.mimeType = "image/jpeg";
		uploadOptions.params = params; // if we need to send parameters to the server request
		
		var ft = new FileTransfer();
		ft.upload(fileURI, encodeURI(api_url), 
			function(r) {
				alert(r);
				callback(r);
				console.log("Code = " + r.responseCode);
				console.log("Response = " + r.response);
				console.log("Sent = " + r.bytesSent);
			},
			function(error) {
				alert("An error has occurred: Code = " + error.code);
			}, 
			uploadOptions);
	}

	var upload_file_using_http = function(api_url, fileURL, params) {
		var base64 = getBase64Image(fileURL);
			
		$http({
			method: 'POST',
			url: api_url,
			//headers: {
            //    'Content-Type': 'multipart/form-data'
            //},
			data: {
                file: base64,
				api_key: params.api_key,
				timestamp: params.timestamp,
				signature: params.signature,
				tags: []
            }
		}); 
			
		/*
		forge.request.ajax({
		  type: 'POST',
		  url: api_url,
		  dataType: 'json',
		  data: {},
		  files: files,
		  timeout: options.timeout || 60000,
		  success: function(data) {
			return callback(data);
		  },
		  error: function(error) {
			var result;
			if (_.include(["400", "401", "500"], error.statusCode)) {
			  try {
				result = JSON.parse(error.content);
			  } catch (e) {
				result = { error: { message: "Server return invalid JSON response. Status Code " + res.statusCode } };
			  }
			  if (result["error"]) {
				result["error"]["http_code"] = error.statusCode;
			  }
			  return callback(result);
			} else {
			  return callback({ error: { message: "Server returned unexpected status code - " + error.statusCode + " " + error.message, http_code: error.statusCode } });
			}
		  }
		});
		*/
	}
	
	function getBase64Image(imageUrl) {
		var img = document.createElement("img");
		img.src = imageUrl;
		
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		var dataURL = canvas.toDataURL("image/png");
		//return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		return dataURL;
	}
	
	var api_call_success = function(r) {
		alert(r);
		console.log("Code = " + r.responseCode);
		console.log("Response = " + r.response);
		console.log("Sent = " + r.bytesSent);
	}

	var api_call_fail = function(error) {
		alert("An error has occurred: Code = " + error.code);
	}

  var upload2 = function(file) {
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {}; // if we need to send parameters to the server request
    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI("http://host/upload"), win, fail, options);
  }

	// file:///Users/Anthony/Library/Application_Support/IphoneSimulator/...
	var upload = function(file, callback, options) {
		if (options == null) {
			options = {}; 
		}
	
		return call_api("upload", callback, options, function() {
			var params = build_upload_params(options);
		
			/*
			if (_.isString(file) && file.match(/^https?:|^s3:|^data:[^;]*;base64,([a-zA-Z0-9\/+\n=]+)$/)) {
				return [params, {file: file}];
			} else {
				return [params, {}, file];
			}*/
			
			return [params, {}, file];
		});
	};

	var explicit = function(public_id, callback, options) {
		if (options == null) { options = {}; }
		return call_api("explicit", callback, options, function() {
			return [
			{
				type: options.type,
				public_id: public_id,
				callback: options.callback,
				eager: build_eager(options.eager),
				headers: build_custom_headers(options.headers),
				tags: options.tags && build_array(options.tags).join(",")
			}
			];
		});
	};

	var destroy = function(public_id, callback, options) {
		if (options == null) { options = {}; }
		return call_api("destroy", callback, options, function() {
			return [
				{
				type: options.type,
				invalidate: options.invalidate,
				public_id: public_id
				}
			];
			});
	};

	return {
  
		uploadImage: function(image, callback) {
		  try {
			upload(image, callback, null);
		  }
		  catch(err)
		  {
			alert(err);
		  }
		},
    
		somethingelse: function(){
		}
  
	}  
});