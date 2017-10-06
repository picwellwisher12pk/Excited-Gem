  function packageData(sender,receiver,targetMethod,data){
      let pack = {
          sender: sender,
          receiver: receiver,
          targetMethod:targetMethod,
          data: data
      };
       return pack;
  }

  function packageAndBroadcast(sender = sender,receiver,targetMethod,data){
          chrome.runtime.sendMessage(packageData(sender,receiver,targetMethod,data));
  }
