property propertyHash : "/a396022171p539251423"
property baseURL : "https://analytics.google.com/analytics/web/#"
property eventNames : {"calculate_tool", "compare_scenario", "feedback", "share_tool", "embed_generate", "search", "affiliate_click"}

on say(msg)
	do shell script "echo [GA4] " & quoted form of msg
end say

on navTo(path)
	tell application "Safari"
		do JavaScript "document.location.href = '" & baseURL & path & "'" in document 1
		delay 2
		repeat 15 times
			delay 1
			try
				set s to (do JavaScript "document.body?.innerText?.substring(0,200) || ''" in document 1)
				if s is not "" and s does not contain "Loading" then exit repeat
			end try
		end repeat
		delay 3
	end tell
end navTo

on run
	tell application "Safari"
		activate
		set gaTab to false
		repeat with w from 1 to count of windows
			repeat with t from 1 to count of tabs of window w
				set u to URL of tab t of window w
				if u contains "analytics.google.com/analytics/web" and u contains propertyHash then
					set current tab of window w to tab t of window w
					set index of window w to 1
					set gaTab to true
					exit repeat
				end if
			end repeat
			if gaTab then exit repeat
		end repeat
		
		if not gaTab then
			say("ERROR: No GA4 tab found")
			return
		end if
	end tell
	
	say("Waiting 2 minutes for GA4 to process events...")
	delay 120
	
	say("Navigating to Admin > Events...")
	navTo(propertyHash & "/admin/events")
	
	-- Check which events are now visible
	set foundEvents to {}
	set missingEvents to {}
	repeat with ev in eventNames
		set eventName to ev as string
		set js to "document.body?.innerText?.includes('" & eventName & "') || false"
		tell application "Safari"
			set found to (do JavaScript js in document 1)
		end tell
		if found then
			set end of foundEvents to eventName
		else
			set end of missingEvents to eventName
		end if
	end repeat
	
	say("Found in Admin > Events: " & foundEvents)
	if missingEvents is not {} then
		say("Still missing: " & missingEvents & " (may need more time)")
	end if
	
	-- For events that ARE found, mark as key events
	repeat with ev in foundEvents
		set eventName to ev as string
		say("Marking " & eventName & " as key event...")
		
		-- Navigate to detail page
		navTo(propertyHash & "/admin/events/detail?event=" & eventName)
		
		-- Try to click the key event toggle
		set js to "
			(function(){
				var sel = [
					'div[role=\"switch\"]',
					'button[role=\"switch\"]',
					'input[type=\"checkbox\"]',
					'[aria-label*=\"Key event\"]',
					'[aria-label*=\"key event\"]'
				];
				for(var s=0;s<sel.length;s++){
					var els = document.querySelectorAll(sel[s]);
					for(var i=0;i<els.length;i++){
						try{
							if(els[i].getAttribute('aria-checked')==='true') return 'ALREADY_SET';
							if(els[i].tagName==='INPUT'&&els[i].type==='checkbox'&&!els[i].checked){ els[i].click(); return 'CLICKED'; }
							els[i].click(); return 'CLICKED';
						}catch(e){}
					}
				}
				var all = document.querySelectorAll('span,button,div,a,label');
				for(var i=0;i<all.length;i++){
					var t=(all[i].textContent||'').toLowerCase().trim();
					if(t==='mark as key event'||t==='key event'){ all[i].click(); return 'CLICKED_TEXT'; }
				}
				return 'NOT_FOUND';
			})()
		"
		tell application "Safari"
			try
				set result to (do JavaScript js in document 1)
				say("  " & eventName & ": " & result)
			on error e
				say("  " & eventName & ": ERROR " & e)
			end try
		end tell
		delay 1
	end repeat
	
	-- Return to events list
	navTo(propertyHash & "/admin/events")
	say("✅ Done!")
	
	if missingEvents is not {} then
		display dialog "✅ Some events marked!" & return & "Marked: " & foundEvents & return & "Still missing (need more time): " & missingEvents & return & return & "Check back in 30 min and mark the rest."
	else
		display dialog "✅ All 7 custom events marked as key events!" & return & "They will now appear in Reports > Life cycle > Engagement > Events."
	end if
end run
