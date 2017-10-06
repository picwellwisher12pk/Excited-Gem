  function packagedData(sender,receiver,targetMethod,data): Object{
      let pack :Object = {
          sender: sender,
          receiver: receiver,
          targetMethod:targetMethod,
          data: data
      };
       return pack;
  }

  function packagedAndBroadcast(sender = sender,receiver,targetMethod,data){
          chrome.runtime.sendMessage(packagedData(sender,receiver,targetMethod,data));
  }
