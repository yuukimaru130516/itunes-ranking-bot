#! /usr/bin/env python3
# iTunesストアのトップソングのRSSを取得する

import xml.etree.ElementTree as ET
import urllib.request
import urllib.parse
import csv
import pandas as pd
import datetime

# 時間の取得
dt_now = datetime.datetime.now()
dt_int = int(dt_now.strftime('%Y%m%d%H%M'))

# 読み込むファイル(xml形式)
xmlns = "{http://www.w3.org/2005/Atom}"
url = "https://itunes.apple.com/jp/rss/topsongs/limit=5/xml"
req = urllib.request.Request(url)

# ファイルの保存先
path_w = f'/home/vagrant/workspace/itunes-ranking-bot/save_csv/{dt_int}.csv'

# 変換を行う関数
def convert():
  titles = []
  root = ET.fromstring(xml_read)
  tree = ET.ElementTree(element=root)

  # entryより下の階層を取り出す(title)
  for entry in root.findall(f'{xmlns}entry'):
    title = entry.find(f'{xmlns}title').text
    titles.append(title)

  for i in range(0, 5):
    print(f"{i + 1}位：{titles[i]}")

  # データフレームに変換して、csvファイルに書き込む
  titles_df = pd.DataFrame({'ranking':titles})
  titles_df.to_csv(path_w, header=False, index=False)

try:
  with urllib.request.urlopen(req) as response:
    xml_read = response.read()
    convert()
except urllib.error.HTTPError as err:
  print(err.code)
except urllib.error.URLError as err:
  print(err.reason)


