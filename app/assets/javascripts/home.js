
window.onload = function () {

  var userName;
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
    else if('i_new_message' == e.type){
      console.log('incoming message');
    }
    else if('i_new_call' == e.type){
      console.log('incoming call');
      e.newSession.accept({ audio_remote: document.getElementById('audio-remote'),
                            events_listener: { events: '*', listener: eventsListener }
                          });
    }
    else if( 'connected' == e.type && e.session == registerSession ){
      console.log('Connected');
      if( 'iceking' == userName ){
        callGhunter();
      }
    }
  }

  var callGhunter = function() {
    callSession = sipStack.newSession('call-audio', {
      audio_remote: document.getElementById('audio-remote'),
      events_listener: { events: '*', listener: eventsListener }
    });
    callSession.call('ghunter');
  }
  
  var createSipStack = function() {
    return new SIPml.Stack({
      realm: '82.196.0.20',
      impi: userName,
      impu: 'sip:' + userName + '@82.196.0.20',
      password: 'mysecret',
      outbound_proxy_url: 'udp://82.196.0.20:4060',
      websocket_proxy_url: 'ws://82.196.0.20:8088/ws',
      events_listener: { events: '*', listener: eventsListener },
    });
  }

  var readyCallback = function(e) {
    console.log('The engine is ready');
  };
  
  var errorCallback = function(e) {
    console.error('Failed to initialize the engine: ' + e.message);
  };

  var upAndGo = function(name) {
    userName = name;
    sipStack = createSipStack();
    SIPml.init(readyCallback, errorCallback);
    sipStack.start();
  }

  document.getElementById('ghunter').onclick = function() {
    upAndGo('ghunter');
  }

  document.getElementById('iceking').onclick = function() {
    upAndGo('iceking');
  }
}

