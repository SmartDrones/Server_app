var restify = require('restify');
var socketio = require('socket.io');

log.info("Setting up the webserver...");
var server = restify.createServer({name:"Smart Drones"});
this.server = server;

// Allow JSON over Cross-origin resource sharing 
log.info("Configuring cross-origin requests...");
server.use(
    function crossOrigin(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
    }
);

server.listen(8080, function() {
    log.info(server.name+ ' listening at '+ server.url);
});

// Define a route for serving static files
// This has to be defined after all the other routes, or it plays havoc with things
server.get(/.*/, restify.serveStatic({
	//directory: './static'
	directory: './static',
	default: 'index.html'
}));


var clients_limit = 4;
var nb_clients=0;

function connect(socket) {

	log.debug("new_client for the app");
	nb_clients++;
	if (nb_clients<=clients_limit){ // avoid too many connection on the server.
		socket.emit("id",(socket.id));
		socket.on('client_order',function(data){
				socket.emit("command",data);
//				for(var i in data.drone)
//				{
//					send_command(data.cmd,data.drone[i]);
//				}
			});

	}
	socket.on('disconnect', function() {
		log.debug("client disconnected");
		nb_clients--;
	});
}

function send_command(data_cmd,id_drone)
{

}

	var io = socketio.listen(server.server);
	io.on('connection', connect);

