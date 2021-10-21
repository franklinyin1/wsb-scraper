# WSB-Scraper

This is a tool used to scrape reddit.com/r/wallstreetbets for data. This tool tracks:
1. Trending stock tickers mentioned on r/wsb based on number of references
2. Postive (max of 1) and negative (min of -1) sentiment for each stock

In order to display the data, run "npm run start:dev" and navigate to localhost:8080

In order to run a script that continuously refreshes the data, run "npm run start". Every hour, this script will automatically scrape data from reddit.com/r/wallstreetbets. If you then navigate back to localhost:8080 and hit refresh, this will display the updated data.
