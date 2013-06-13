
window.onload = function () {

  var sipStack;
  var registerSession;
  var callSession;

  var eventsListener = function(e) {
    if(e.type == 'started'){
      console.log('Start session');
      registerSession = sipStack.newSession('register', {
        events_listener: { events: '*', listener: eventsListener }
      });
      registerSession.register();
    } 
    else if(e.type == 'i_new_message'){
      console.log('incoming message');
    }
    else if(e.type == 'i_new_call'){
      console.log('incoming call');
    }
    else if( e.type = 'connected' && e.session == registerSession ){
      makeCall();
    }
  }

  var makeCall = function(){
    callSession = sipStack.newSession('call-audio', {
      audio_remote: document.getElementById('audio-remote'),
      events_listener: { events: '*', listener: eventsListener } // optional: '*' means all events
    });
    callSession.call('1000');
  }
  
  var createSipStack = function() {
    sipStack = new SIPml.Stack({
      realm: '82.196.0.20',
      impi: 'bob',
      impu: 'sip:bob@82.196.0.20',
      password: 'mysecret',
      outbound_proxy_url: 'udp://82.196.0.20:4060',
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

