function packagedData(sender, receiver, targetMethod, data) {
  let pack = {
    sender: sender,
    receiver: receiver,
    targetMethod: targetMethod,
    data: data
  }
  return pack
}

export default function packagedAndBroadcast(
  sender = sender,
  receiver,
  targetMethod,
  data
) {
  browser.runtime.sendMessage(
    packagedData(sender, receiver, targetMethod, data)
  )
}
