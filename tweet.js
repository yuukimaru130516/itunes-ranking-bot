#! /usr/bin/env node
'use strict'
const Twitter = require('twitter-lite');
const cron  = require('node-cron');
const fs = require('fs');
const csv = require('csv');
const parse = require('csv-parse/lib/sync');

// 時間の取得(衝突を防ぐために1分後に実行)
require('date-utils')
let dt = new Date();
let formatted = dt.toFormat("YYYYMMDDHH24MI") - 1;

// 自分のbotのAPIキーに書き換える
const twitter = new Twitter({
  consumer_key: ${consumer_key},
  consumer_secret: ${consumer_secret},
  access_token_key: ${access_token_key},
  access_token_secret: ${access_token_secret}
});

let choice_text = [];
let contents = [];
let tweetText = [];

fs.createReadStream(`/home/vagrant/workspace/itunes-ranking-bot/save_csv/${formatted}.csv`)
.pipe(csv.parse((err, data) => {
  for(let i = 0; i < 5; i++){
    choice_text.push(data[i]);
  }
  arrangeRanking();
  postTweet(tweetText);
}));

// ツイートする関数
function postTweet(tweetText) {
  twitter.post('statuses/update', {
    status: `現在のiTunesトップ５はこちら！\n今日も1日頑張ろう(^^)/\n \n${tweetText}`
  }).then((tweet) => {
    console.log(tweet);
  }).catch((err) => {
    console.error(err);
    console.log(twitter)
  });
}
// ツイート文の体裁を整える関数
function arrangeRanking() {
  for(let v = 1; v <= 5; v++){
    contents.push(`${v}位：${choice_text[v-1]}\n`); 
  }
  tweetText = contents.join("");
}



