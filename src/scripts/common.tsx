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
	console.log("commonjs","Sending data:",data,"Sender:",sender,"targetMethod:",targetMethod);
}

chrome.runtime.onMessage.addListener((request: any, sender: Function) => {
	console.log("commonjs","request coming:",request,"Sender:",sender)
	eval(request.targetMethod)(request.data);
});