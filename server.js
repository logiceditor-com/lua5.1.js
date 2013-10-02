// Modules
var dive = require("dive")
var express = require("express")
var fs = require("fs")
var http = require("http")
var http_proxy = require("http-proxy")
var querystring = require("querystring")
var url = require("url")

// Imports
var execFile = require("child_process").execFile

// Static file server for regular stuff
var app = express()

app.configure(function(){
    app.use("/", express.static(__dirname))
})

app.listen(9000)

// Most requests get proxied
var proxy = new http_proxy.HttpProxy({ 
  target: {
    host: "localhost",
    port: 9000
  }
})

//
function GetLuaDir ()
{
	return process.cwd() + "/lua"
}

//
function Respond (res, text)
{
	res.writeHead(200, { "Content-Type": "text/plain" })
	res.end(text)
}

//
function OnFiles (callback)
{
	var dir = GetLuaDir()
	var len = (dir + "/").length
	var nfiles = 0, is_done = false

	dive(dir, function(err, file) {
		if (err)
		{
			console.log(err)
			callback("error", err)
		}

		else
		{
			//
			++nfiles

			fs.stat(file, function(err, stat) {
				if (err)
				{
					console.log(err)
					callback("error", err)
				}

				else callback("file", "lua/" + file.substr(len), stat)

				//
				--nfiles

				if (is_done && nfiles === 0) callback("done")
			})
		}
	}, function() {
		is_done = true		
	})
}

//
function GetFileList (res)
{
	var files = [], size = 0

	OnFiles(function(how, file, stat) {
		switch (how)
		{
		case "error":
			files = false

			break

		case "file":
			if (files !== false) files.push(file + "," + stat.size)

			break

		case "done":
			Respond(res, files ? files.join(";") : "")
		}
		
	})
}

//
var progress = "DONE"

//
function GetProgress (res)
{
	Respond(res, progress)
}

function IsOutOfDate (res)
{
	fs.exists("packed.js", function(exists) {
		if (!exists) Respond(res, "YES")

		else fs.stat("packed.js", function(err, pstat) {
			if (err) console.log("ERR: " + err)
			
			else
			{
				var out_of_date = "NO"

				OnFiles(function(how, file, stat) {
					switch (how)
					{
					case "done":
						return Respond(res, out_of_date)

					case "file":
						if (stat && pstat.mtime < stat.mtime) out_of_date = "YES"
					}
				})
			}
		})
	})
}

//
function PackFiles (res, body)
{
	progress = "0,0"

	var packer = execFile("luajit", ["-e", 'do\n' + 
		'local file = loadfile("packer.lua")\n' +
		'local ok, err = pcall(file, "--as-binary", "packed.js", "/", "lua/", ' + querystring.unescape(body).replace(/\\/g, "/") + ')\n' +
		'if not ok then io.stderr:write(err) end\n' +
	'end'], function (err, stdout, stderr) {
		if (err) console.log("ERR: " + err)
		if (stderr) console.log("Errors: " + stderr)

		progress = "DONE"
	})

	packer.stdout.on("data", function (data) {
		progress = data
	})

	Respond(res, "OK")
}

// Main server
http.createServer(function(req, res) {
	var parsed = url.parse(req.url)

	switch (parsed.pathname)
	{
	// File list request.
	// TODO: could be long-running? (Incorporate progress...)
	case "/file_list":
		return GetFileList(res)

	// Out of date query request.
	case "/out_of_date":
		return IsOutOfDate(res)

	// Progress request.
	case "/progress":
		return GetProgress(res)

	// Pack request. Performs a pack if some scripts are out of date.
	case "/pack":
		return PackFiles(res, parsed.query.split("=")[1])

	// Proxy normal request.
	default:
		proxy.proxyRequest(req, res)
	}
}).listen(8080)