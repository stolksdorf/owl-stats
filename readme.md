
[owl api]/players -> all players -> player ids
[owl api]/schedule -> returns a massive schedule list
	- Use this to get match ids, and game ids
	- recrsively call the following
/stats/matches/21211/maps/3 - > returns the data we actually want
	- use the results here with the



------------



https://api.overwatchleague.com/stats/players?season_id=2019

- returns a bunch of stats per 10min and time played, with a _ton_ of decimal places
-


-------------



Offense/Flex
+2 points for a Kill
+2 points for getting the First Kill in a teamfight
-1 point for a Death
-2 points for suffering the First Death in a teamfight
+1 point for getting an Ultimate



Tank
+2 points for a Kill
+4 points for getting the First Kill in a teamfight
-1 point for a Death
-1 points for suffering the First Death in a teamfight
+3 points for getting an Ultimate


Support
+3 points for a Kill
+4 points for getting the First Kill in a teamfight
-1 point for a Death
-2 points for suffering the First Death in a teamfight
+3 points for getting an Ultimate
+1.5 points for Ressurecting a teammate (points will be rounded)


-----------------------


DPS
+4 per kill
-3 per death

Tank
+6 per kill
-2 per death

Support
+7 per kill
-3 per death
?? per healing


------------------

Storage: Store JUst the fantasy points, store the week on week stats, store the winston's lab stats?


- gist.api.js (loads and saves gist data)
- config
- owl.api.js
- winstonslab.api.js
- index.js -> combines all of the above

when run
- Pull data from gist, and parse it
- calculate week number (use Thursday as the pivot)
- Ping the owl api, process, then for each player find the previous entries (filter out current week), and minus off those values to get just this week
- Save those raw stats
- Loop through and make the fantasy chart based on the current mults

- Ping the WL api
- Create a new




------------


- OWL API returns Cumulative stats for each player for the whole season
- These stats are by 10min average, but you can request up to 9 decimal precision in each stat and time played, so I iterate over each stat to get it's absolute
- Since the stats are cumulative I have to record a snapshot each week of the cumulative stats
- I have to reliably calculate what week it is (this is where I am now). This might seen simple, but I'm planning on deploying this to a server that might run anywhere in the world and might run at anytime (it could pull data at 11:59:59, but then save it at 12:00:01, meaning it would earse last week's records, so I have to be smart).
- So to calculate the current week, I do a pull, then itreate over each previous snapshot, subtracting off each previous weeks value. This will give me the week's snapshot, which we save.
- Then I take the coefficients for the fantasy points and going over each week snapshot I have, calculate the fantasy points for each player each week.
- I put that into a TSV and also record that. This calculation is stateless, since it relies on the stability of the previous snapshots, so I actually can blow away all the fantasy point records whenever we like to re-gen them. This also gives us the ability to completely change the point coefficient and not lose any data. Awesome.
- So this needs to run automatically, so I'm wrapping everything in a serverless container to be deployed to AWS Lambda, and running it on a schedule (I'm planning on once a day for redundacy)
- Lastly the data needs to be easily accessible, so I need to generate a public access token for my gist's and the program will use a gists as the pseudo-database and presentation medium. So there should be a single url anyone can go to and simply copy the TSV for the points and paste it into the Coda.
- I will also store the week snapsnots and fantasy coefficietns there for easy tweaking, without needing to redeploy the code.