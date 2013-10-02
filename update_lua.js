// Exports
var UpdateLua = UpdateLua || {};

(function(M) {
	//
	function Request (message, action, data)
	{
		var xhr = new XMLHttpRequest()

		xhr.onreadystatechange = function()
		{
			if (xhr.readyState === 4)
			{
				if (xhr.status === 200) action(true, xhr.responseText)

				else action(false, xhr.status)
			}
		}

		if (data) message += "?data=" + data // This makes Node happy, but wasn't really how anything else suggests doing it... :/
		
		xhr.open(data ? "POST" : "GET", message, true)
		xhr.send(null)
	}

	//
	function UpdateProgress (payload, state, callback)
	{
		var progress = payload.split(",") // Payload = string of form "STREAM_POS,FILE_INDEX"

		// Since requests are asynchronous, we may receive outdated progress reports;
		// ignore these. Otherwise, update the "last received" position.
		if (parseInt(progress[0]) < state.ipos) return 

		state.ipos = parseInt(progress[0])

		// Update the busy state if it is showing.
		if (state.busy === "show")
		{
			var ifile = parseInt(progress[1])
			var offset = state.offsets[ifile], next

			if (ifile + 1 < state.files.length) next = state.offsets[ifile + 1]
			
			else next = state.total_size

			callback("busy_update", {
				pos : state.ipos, size : state.total_size,
				byte_index : state.ipos - offset, byte_count : next - offset,
				file_index : ifile, file_count : state.files.length,
				file_name : state.files[ifile]
			})
		}

		// After a certain number of frames, check if a busy state should kick in.
		else if (state.busy === "no")
		{
			++state.count

			if (state.count === 3)
			{
				state.busy = "never_mind" // TODO: Right now, assumes uniform rate of progress... How to make it adaptive?

				// If the rate of progress suggests the pack will still take a while, kick off the busy state.
				if (2 * state.ipos < state.total_size) // Less than 50% done?
				{
					state.busy = "show"

					callback("busy")
				}
			}
		}
	}
	
	// !!!
	M.BringUpToDate = function (callback)
	{
		// If we're not testing locally (and don't have the pack server), assume we're up
		// to date. Otherwise, ask the pack server.
		if (location.hostname !== "localhost") callback("done") // TODO: too brittle? (could have modified hosts file, etc.)

		else Request("out_of_date", function(ok, text) {
			if (!ok) callback("error", text)

			// Out of date: put the pack machinery in machine.
			else if (text === "YES")
			{
				Request("file_list", function(ok, text) {
					if (ok)
					{
						var list = text.split(";"), files = [], offsets = [], total_size = 0
						
						for (var i = 0; i < list.length; ++i)
						{
							var packet = list[i].split(",")

							files.push(packet[0])
							offsets.push(total_size)

							total_size += parseInt(packet[1])
						}
console.log(offsets.toString())
						// 
						Request("pack", function(ok) {
							if (ok)
							{
								var check, state = { count : 0, ipos : -1, busy : "no", files : files, offsets : offsets, total_size : total_size }

								//
								check = setInterval(function() {
									Request("progress", function(ok, payload) {
										if (!ok || payload === "DONE")
										{
											clearInterval(check)

											if (state.busy === "show") callback("busy_done")

											state.ipos = state.total_size + 1
											
											callback("done", ok)
										}

										else UpdateProgress(payload, state, callback)
									})
								}, 250)
							}
						}, '"' + files.join('", "') + '"')
					}
				})
			}

			// Up to date: we're done.
			else callback("done")
		})
	}
})(UpdateLua)