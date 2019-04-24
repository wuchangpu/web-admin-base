import store from '@/store'

export default {
  inserted (el, { value }) {
    console.log(store.state);
    const permission = store.state.permission.resMenu.permissions;

    let timer = setTimeout(function timeout() {
      if (permission.length) {
        
        if (!permission.includes(value)) {
          console.log(el);
          el.parentNode.removeChild(el);
        }
      } else {
        timer = setTimeout(timeout, 200);
      }

    }, 200);
  }
};