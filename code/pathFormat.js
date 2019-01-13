inlets = 1;
outlets = 1;

function anything(){
		
	var a = arrayfromargs(messagename, arguments);
	var path = a[0];
	var file = a[1] + ".wav" 
	
	var search = "autoSampler"
	var index = path.indexOf(search)+search.length;
	var format = path.substring(0,index) + "/samples/";

	outlet(0,format);

}