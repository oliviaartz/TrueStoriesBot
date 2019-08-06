var fs = require('fs'),
	path = require('path'),
	Twit = require('twit'),
	config = require(path.join(__dirname, 'config.js'))

var T = new Twit(config)

function random_from_array(images){
	return images[Math.floor(Math.random() * images.length)]
}

function upload_random_image(images){
	console.log('Opening an image...')
	var image_path = path.join(__dirname, '/frames/' + random_from_array(images)),
		b64content = fs.readFileSync(image_path, { encoding: 'base64' })
  
	console.log('Uploading an image...')
  
	T.post('media/upload', { media_data: b64content }, function (err, data, response) {
		if (err){
			console.log('ERROR:')
			console.log(err)
		}
		else{
			console.log('Image uploaded!')
			console.log('Now tweeting it...')
  
			T.post('statuses/update', {
					media_ids: new Array(data.media_id_string)
				},
				function(err, data, response) {
					if (err){
						console.log('ERROR:')
						console.log(err)
					}
					else{
						console.log('Posted an image!')
					}
				}
			)
		}
	})
}

const debug = false

fs.readdir(__dirname + '/frames', function(err, files) {
	if (err){
	  	console.log(err)
	}
	else{
	  	var images = []
	  	files.forEach(function(f) {
			images.push(f)
		})
  
		// Do it once now
		upload_random_image(images)

		setInterval(function(){
			upload_random_image(images)
		// debug mode tweets every twenty seconds (20s * 1000ms = 20,000ms)
		//  if off, it tweets every nine hours (9h * 60m * 60s * 1000ms = 32,400,000)
		}, debug ? 20000 : 32400000)
	}
})