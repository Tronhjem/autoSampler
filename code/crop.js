outlets = 2;
intlet = 2;


var buffer = new Buffer("sampleBuffer");


var threshold = 0.001;

var progress = 0;
var sampleChunk = 1;
var sampleRate = 44100;
var fadeInTime = 5;
var fadeOutTime = 100;

declareattribute("samplerate");

var bufferLength = buffer.length();
var endCrop = bufferLength;
var bufferLengthSamples = buffer.framecount();


var sampleRateMS = sampleRate / 1000;


function msg_float(v)
{
	endCrop = v;
	endCropSamples = endCrop * sampleRateMS;
}

function bang()
{
	var progress = 0;


	while (progress < bufferLengthSamples)
	{
		var frame = buffer.peek(1, progress, sampleChunk);
		
		if (frame > threshold)
		{
			var saToMs = progress / sampleRateMS;
			post("cropping start " + saToMs + " and end " + endCrop + "\n")
			buffer.send("crop", saToMs, endCrop)
			
			
			break;
		}
		progress += sampleChunk;
	}

	bufferLengthSamples = buffer.framecount();
	var progress = bufferLengthSamples;

	while (progress > 0)
	{
		var frame = buffer.peek(1, progress, sampleChunk);
		
		if (frame > threshold)
		{
			var saToMs = progress / sampleRateMS;
			post("cropping end at " + saToMs + "\n")
			buffer.send("crop", 0, saToMs)
			
			break;
		}
		progress -= sampleChunk;
	}

	fade()
	post("crop and fade done!")
	outlet(1, 1)
}


function fade()
{
	var fadePrSample = 1/fadeInTime;
	var processSample = 0;

	// // fade start
	for (var i=0; i <= fadeInTime; i++)
	{
		processSample = buffer.peek(1, i, 1);
		fadeSample = processSample * (i * fadePrSample);
		buffer.poke(1, i , fadeSample)
		
		processSample = buffer.peek(2, i, 1);
		fadeSample = processSample * (i * fadePrSample);
		buffer.poke(2, i , fadeSample)

	}

	//fade end 
	var progress = 0;
	var processSample = 0;
	var fadePrSample = 1/fadeOutTime;

	var bufferLengthSamples = buffer.framecount();

	var endPos = bufferLengthSamples - fadeOutTime;

	for (var i = bufferLengthSamples; i >= endPos; i-= 1)
	{
		processSample = buffer.peek(1, i, 1);
		fadeSample = processSample * (progress * fadePrSample);
		buffer.poke(1, i, fadeSample)
		
		processSample = buffer.peek(2, i, 1);
		fadeSample = processSample * (progress * fadePrSample);
		buffer.poke(2, i, fadeSample)
		progress ++;
		// post(i, fadeSample, progress + "\n")
	}

}
