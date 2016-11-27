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

chrome.runtime.onMessage.addListener((request: any, sender: Function) => {
	eval(request.targetMethod)(request.data);
});