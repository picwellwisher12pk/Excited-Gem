   const menu = document.querySelector('#context-menu');
    let menuVisible = false;

    const toggleMenu = command => {
      menu.style.display = command === 'show' ? 'block' : 'none';
      menuVisible = !menuVisible;
    };

    const setPosition = ({ top, left }) => {
      menu.style.left = `${left}px`;
      menu.style.top = `${top}px`;
      toggleMenu('show');
    };

    window.addEventListener('click', () => {
      if (menuVisible) toggleMenu('hide');
    });

    window.addEventListener('contextmenu', e => {
      e.preventDefault();
      const origin = {
        left: e.pageX,
        top: e.pageY,
      };
      setPosition(origin);
      return false;
    });
