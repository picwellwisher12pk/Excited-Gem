import MainCard from "../components/homePage/MainCard";
import "./Popup.css";
const styles = {
  button: {
    padding: 5
  }
}
export default function () {
  const initiateCapture = (area: 'visible' | 'all' | 'selection') => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tab) => {
      console.log(tab[0].id, 'area:', area);
      chrome.runtime.sendMessage({
        method: 'capture',
        area: area,
        tabId: tab[0].id
      }, (response) => {
        console.log('response', response);
        // window.close();
      });
    });

  }

  return (
    <section className='flex items-center justify-center min-h-screen'>
      <MainCard />
    </section>
  )
}
