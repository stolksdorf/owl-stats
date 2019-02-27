# owl-stats
A command line tool for generating stats and fantasy points for the Overwatch League.

[Gist with the 2019 OWFL stats](https://gist.github.com/stolksdorf/4dd79913ce181180f1e2107b5230ec6a)



### Fantasy Point Calculation
Using the historical stats from the 2018 season, we played with the following multipliers until the average point totals across the three role types so that the point delta between them was minimized.

##### offense
elims       : 2
deaths      : -2
damage      : 0.0011
healing     : 0
ults        : 0
final_blows : 0

##### tank
elims       : 1
deaths      : -1
damage      : 0.001
healing     : 0
ults        : 3
final_blows : 0

##### support
elims       : 1
deaths      : -1
damage      : 0.001
healing     : 0.00125
ults        : 1
final_blows : 1




### How it works

1) OWL API returns Cumulative stats for each player for the whole season
1) These stats are by 10min average, but you can request up to 9 decimal precision in each stat and time played, so I iterate over each stat to get it's absolute
1) Since the stats are cumulative I have to record a snapshot each week of the cumulative stats
1) I have to reliably calculate what week it is (this is where I am now). This might seen simple, but I'm planning on deploying this to a server that might run anywhere in the world and might run at anytime (it could pull data at 11:59:59, but then save it at 12:00:01, meaning it would earse last week's records, so I have to be smart).
1) So to calculate the current week, I do a pull, then itreate over each previous snapshot, subtracting off each previous weeks value. This will give me the week's snapshot, which we save.
1) Then I take the coefficients for the fantasy points and going over each week snapshot I have, calculate the fantasy points for each player each week.
1) I put that into a TSV and also record that. This calculation is stateless, since it relies on the stability of the previous snapshots, so I actually can blow away all the fantasy point records whenever we like to re-gen them. This also gives us the ability to completely change the point coefficient and not lose any data. Awesome.
1) So this needs to run automatically, so I'm wrapping everything in a serverless container to be deployed to AWS Lambda, and running it on a schedule (I'm planning on once a day for redundacy)
1) Lastly the data needs to be easily accessible, so I need to generate a public access token for my gist's and the program will use a gists as the pseudo-database and presentation medium. So there should be a single url anyone can go to and simply copy the TSV for the points and paste it into the Coda.
1) I will also store the week snapsnots and fantasy coefficients there for easy tweaking, without needing to redeploy the code.