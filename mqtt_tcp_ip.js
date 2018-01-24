var mqtt = require('mqtt')
var net = require('net');
var client_mqtt  = mqtt.connect('mqtt://YOUR MQTT SERVER')
var server = net.createServer();  
var text =""
server.on('connection', handleConnection);

function handleConnection(conn) {  
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);

  conn.on('data', onConnData);
  conn.once('close', onConnClose);
  conn.on('error', onConnError);

  setInterval(function () { 
    conn.write(text);  // send message to every client 
    
  }, 1500); 
  
  function onConnData(d) { // client will send message to server we need to receive and respond 
    var messageTCP = d.toString().split("-") //แยกข้อความ
    console.log('connection data from %s: %s', remoteAddress, d);
    
    //conn.write("hello from server i'm from data");
    //console.log(d.toString().length)
    
  }

  function onConnClose() { // connect is close
    console.log('connection from %s closed', remoteAddress);
    
  }

  function onConnError(err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}

server.listen(8000, function() {  //ประกาศใช้งาน server
  console.log('server listening to %j', server.address());
});

client_mqtt.on('connect', function () {
  client_mqtt.subscribe('TEST TOPIC') // เป็นหัวข้อเดียวที่จะต้อง sub 
  //client_mqtt.publish('testtopic', 'Hello mqtt')
})
 
client_mqtt.on('message', function (topic, message) { 
  // message is Buffer
  console.log(message.toString()) // แสดงข้อความจาก mqtt
  text = message.toString()  // จะเปิด/ปิด ไฟเอง เพราะมีชุดคำสั่ง กับ ตำแหน่งอยู่แล้ว จะส่งมาแบบนี้ Ex. Bulb/1/true
})


