import { ref } from 'vue';
export function useSendMessage (fn) {
  let canSendCount = ref(60);
  let isSending = ref(false);
  let canSendCheck = () => {
    return isSending.value && canSendCount.value !== 0;
  }
  
  const time = (fn) => {
    var timer = setTimeout(() => {
      canSendCount.value--;
      if (canSendCount.value === 0) {
        fn();
        clearTimeout(timer);
        return;
      }
      time(fn);
    }, 1000);
  }
  
  const sendMessageCode = () => {
    isSending.value = true;
    sendCode();
    time(() => {
      isSending.value = false; 
      canSendCount.value = 60;
    });
  }

  const sendCode = () => {
    fn();
  }

  return {
    canSendCount,
    isSending,
    sendMessageCode,
    canSendCheck
  }
}