outlets = 1;

var val = 0;

function msg_float(v) 
{
	
	if (val < v) 
	{
		val = v;
		//post(val + "\n");
		outlet(0, val);
	}
}

function bang()
{
	val = 0;
	//post(val + "\n")
}

