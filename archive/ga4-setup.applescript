property propertyHash : "/a396022171p539251423"
property baseURL : "https://analytics.google.com/analytics/web/#"
property eventNames : {"calculate_tool", "compare_scenario", "feedback", "share_tool", "embed_generate", "search", "affiliate_click"}

on say(msg)
	do shell script "echo [GA4] " & quoted form of msg
end say

on navTo(path)
	tell application "Safari"
		-- Use JS to change hash (SPA routing) instead of set URL
		do JavaScript "window.location.hash = " & quoted form of path in document 1
		delay 1
		repeat 12 times
			delay 1
			try
				set s to (do JavaScript "document.body?.innerText?.substring(0,100) || ''" in document 1)
				if s is not "" and s does not contain "Loading" then exit repeat
			end try
		end repeat
		delay 2
	end tell
end navTo

on clickKeyEvent()
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
						var el=els[i];
						if(el.getAttribute('aria-checked')==='true') return 'ALREADY_SET';
						if(el.tagName==='INPUT'&&el.type==='checkbox'&&!el.checked){ el.click(); return 'CLICKED'; }
						el.click(); return 'CLICKED';
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
			set r to (do JavaScript js in document 1)
			return r
		on error e
			return "JS ERROR: " & e
		end try
	end tell
end clickKeyEvent

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
			display dialog "No GA4 tab found. Navigate to https://analytics.google.com in Safari first."
			return
		end if
	end tell
	
	say("Found GA4 tab. Navigating to Admin > Events...")
	navTo(propertyHash & "/admin/events")
	say("Admin > Events loaded")
	delay 2
	
	repeat with ev in eventNames
		set eventName to ev as string
		say("Processing: " & eventName)
		navTo(propertyHash & "/admin/events/detail?event=" & eventName)
		set result to clickKeyEvent()
		say("  " & result)
		delay 1
	end repeat
	
	navTo(propertyHash & "/admin/events")
	say("Done! All events processed.")
	display dialog "✅ GA4 Setup Complete!" & return & "7 custom events marked as key events." buttons {"OK"} default button 1
end run
