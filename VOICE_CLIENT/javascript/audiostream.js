var wss = null;
wss = new WebSocket('ws://localhost:8080/');
function ready() {
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
//    this.wss = new WebSocket('ws://localhost:8080/');
//    this.wss.onmessage = this._socketData.bind(this);
//    this.wss.onerror = this._error.bind(this);
}

function _pcmTol16(input) {
    var output = new ArrayBuffer(input.length * 2),
    view = new DataView(output),
    offset = 0;

    for (var it = 0; it < input.length; it += 1, offset += 2) {
        var s = Math.max(-1, Math.min(1, input[it]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    this.wss.send(output);
    //    this.wss.send(input);
}
function _getStream(stream) {
    var audioContext = window.AudioContext || window.webkitAudioContext,
    context = new audioContext(),
    audioInput;

    console.log('sample rate: '  + context.sampleRate);
    audioInput = context.createMediaStreamSource(stream);
    this.recorder = context.createScriptProcessor(this.bufferSize, 1, 1);
    this.recorder.onaudioprocess = function (buffer) {
        if (this.calling === false)
            return;
        buffer = buffer.inputBuffer.getChannelData(0);
        this._pcmTol16(buffer);
    }.bind(this);
    audioInput.connect(this.recorder);
    this.recorder.connect(context.destination);
}

function call() {
    if (this.initialized === false)
        this._initialize();
    this.wss.send('start google fr-FR audio/l16;rate=44100');
    
    _initialize();
    wss.onmessage = function(data) {
	console.log(JSON.parse(data.data).message.result[0].alternative[0].transcript);
	document.body.innerHTML += JSON.parse(data.data).message.result[0].alternative[0].transcript + "<br/>";
    }

    //    this.wss.send('start ' + 'google' + ' '  + 'fr-FR' + ' audio/l16;rate=44100');
    //    this.calling = true;
    //    this.$.languages.disabled = true;
}

function _initialize() {
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia({audio: true}, this._getStream.bind(this), this._error.bind(this));
    this.initialized = true;
}

function _socketData(data) {
    if (this.calling === true) {
        data = JSON.parse(data.data);
        if (this.messages.length !== 0 && this.messages[this.messages.length - 1].final === false)
            this.splice('messages', this.messages.length - 1, 1);
        this.push('messages', {message: data.message, final: data.final});
        this.async(function () {
            this.$.messages.scrollTop = this.$.messages.scrollHeight;
        }.bind(this));
    }
}
function _error(e) {
    console.log(e);
    this.fire('error', e);
}


wss.onopen = function(){call();}
