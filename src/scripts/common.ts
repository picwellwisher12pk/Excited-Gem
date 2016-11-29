function packageData(sender:String,receiver:String,targetMethod:String,data: any): Object{
	let package :Object = {
		sender: sender,
		receiver: receiver,
		targetMethod:targetMethod,
		data: data
	};
 	return package;
}

function packageAndBroadcast(senderName:String = sender,receiver:String,targetMethod:String, data: any){
	chrome.runtime.sendMessage(packageData(senderName,receiver,targetMethod,data));
}

chrome.runtime.onMessage.addListener((request: any, sender: Function) => {
	eval(request.targetMethod)(request.data);
});