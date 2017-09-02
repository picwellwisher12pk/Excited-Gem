  function packageData(sender:string,receiver:string,targetMethod:String,data: any): Object{
      let pack :Object = {
          sender: sender,
          receiver: receiver,
          targetMethod:targetMethod,
          data: data
      };
       return pack;
  }

  function packageAndBroadcast(sender:string = sender,receiver:string,targetMethod:String,data: any){
          chrome.runtime.sendMessage(packageData(sender,receiver,targetMethod,data));
  }
