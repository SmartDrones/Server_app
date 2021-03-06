var restify = require('restify');
var socketio = require('socket.io');

console.log("Setting up the webserver...");
var server = restify.createServer({name:"Smart Drones"});
this.server = server;

// Allow JSON over Cross-origin resource sharing 

server.listen(8080, function() {
    console.log(server.name+ ' listening at '+ server.url);
});

// Define a route for serving static files
// This has to be defined after all the other routes, or it plays havoc with things
server.get(/.*/, restify.serveStatic({
	//directory: './static'
	directory: './static',
	default: 'index.html'
}));

var tab_clients = [];
var clients_limit = 5;
var nb_clients=0;

function connect(socket) {

	console.log("new_client for the app");
	nb_clients++;
	if (nb_clients<=clients_limit){ // avoid too many connection on the server.
		socket.emit("id",(socket.id));
		//socket.emit('command',{"id_drones":[0,1,2],cmd:"takeoff"});
		console.log('client id : '+socket.id);
		tab_clients.push(socket.id);
		//socket.emit('command',{id_drones:[],cmd:"takeoff"});
		socket.broadcast.emit("drones_ids",tab_clients);

		// received an order from the web interface, broadcast it to other clients.
		socket.on('client_order',function(data){
				socket.broadcast.emit("server_cmd",data);
			});

		socket.on('message',function(data){
			socket.emit("event",{"cmd":"coucou"});
		});
	}
	socket.on('disconnect', function() {
		tab_clients.pop(socket.id);
		console.log("client disconnected");
		nb_clients--;
	});
}
	var io = socketio.listen(server.server);
	io.on('connection', connect);

