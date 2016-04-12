var context = new webkitAudioContext();

function playSound(buffer, freq, vol)   // buffer, sampleRate, 0-100
{
    var mBuffer = context.createBuffer(1, buffer.length, freq);

    var dataBuffer = mBuffer.getChannelData(0);
    var soundBuffer = buffer;
    var i, n = buffer.length;
    for (i=0;i<n;i++)
        dataBuffer[i] = soundBuffer[i];

    var node = context.createBufferSource();
    node.buffer = mBuffer;
    node.gain.value = 0.5 * vol/100.0;
    node.connect(context.destination);
    node.noteOn(0);
}

ws = new WebSocket("ws://localhost:8080");
ws.onmessage = function(evt){
	playSound(evt.data, 44100, 100);
	//playSound(evt.data.toString("binary"));
}
