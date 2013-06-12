
window.onload = function () {

  var sipStack;
  var session;

  var eventsListener = function(e) {
    if(e.type == 'started'){
      console.log('Start session');
      session = sipStack.newSession('register', {
        events_listener: { events: '*', listener: eventsListener }
      });
      session.register();
    } 
    else if(e.type == 'i_new_message'){
      console.log('incoming message');
    }
    else if(e.type == 'i_new_call'){
      console.log('incoming call');
    }
  }
  
  var createSipStack = function() {
    sipStack = new SIPml.Stack({
      realm: '82.196.0.20',
      impi: 'bob',
      impu: 'sip:bob@82.196.0.20',
      password: 'mysecret',
      outbound_proxy_url: 'udp://192.168.0.12:5060',
      events_listener: { events: '*', listener: eventsListener },
    });
  }

  var readyCallback = function(e) {
    createSipStack();
  };
  
  var errorCallback = function(e) {
    console.error('Failed to initialize the engine: ' + e.message);
  };
  
  SIPml.init(readyCallback, errorCallback);
  sipStack.start();
}

