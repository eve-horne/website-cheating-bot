import requests
import sys
from googlesearch import search
from bs4 import BeautifulSoup
# https://quizlet.com/417658325/cs-352-usabilityosu-cs352-quiz-1-flash-cards/


query = sys.argv[1]
urlList = []
matchlist = ["quizlet", "chegg", "coursehero"]
for j in search(query, tld="com", num=10, stop=10, pause=2): 
    if any(x in j for x in matchlist):
        urlList.append(j)
print(urlList)

#Old Code
# termText = "SetPageTerm-wordText"
# defText = "SetPageTerm-definitionText"

# print("Please enter the URL to scrape (PROTOTYPE - Quizlet URLS only): ")
# URL = input()

# page = requests.get(URL, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'})
# soup = BeautifulSoup(page.content, 'html.parser')
# cards = soup.find_all('span', class_="TermText notranslate lang-en")

# print(f'Found {len(cards)} terms and corresponding definitions on page:\n')

# for i in range(len(cards)):
#     print(cards[i].text)