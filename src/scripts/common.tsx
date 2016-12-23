function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function packageData(sender:string,receiver:string,targetMethod:String,data: any): Object{
	let package :Object = {
		sender: sender,
		receiver: receiver,
		targetMethod:targetMethod,
		data: data
	};
 	return package;
}

function packageAndBroadcast(sender:string = sender,receiver:string,targetMethod:String,data: any){
		chrome.runtime.sendMessage(packageData(sender,receiver,targetMethod,data));
}