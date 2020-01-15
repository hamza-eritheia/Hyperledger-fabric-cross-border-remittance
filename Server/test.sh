curl -H 'Content-Type: application/json' -X POST -d '{"name": "Top 10 ES6 Features every Web Developer must know", "url": "https://webapplog.com/es6", "text": "This essay will give you a quick introduction to ES6. If you don’t know what is ES6, it’s a new JavaScript implementation.", "comments": [{"text": "No comments"}]}'  "http://localhost:3000/posts"; echo
curl "http://localhost:3000/posts"; echo; echo
# curl -H 'Content-Type: application/json' -X PUT -d '{"name": "Hamza", "url": "https://demunchi.com/", "text": "This is a property dealing website", "comments": [{"text": "Nice Website"}]}'  "http://localhost:3000/posts/0"; echo
# curl "http://localhost:3000/posts"; echo; echo
# curl -X DELETE "http://localhost:3000/posts/0"; echo
# curl "http://localhost:3000/posts"; echo; echo
curl -H 'Content-Type: application/json' -X POST -d '{"text": "Yeah Baby!"}'  "http://localhost:3000/posts/1/comments"; echo
curl "http://localhost:3000/posts/1/comments"; echo; echo
curl -H 'Content-Type: application/json' -X PUT -d '{"text": "Gucci"}'  "http://localhost:3000/posts/0/comments/0"; echo
curl "http://localhost:3000/posts/0/comments"; echo; echo
curl -X DELETE "http://localhost:3000/posts/1/comments/1"; echo
curl "http://localhost:3000/posts/1/comments"; echo; echo

curl -H 'Content-Type: application/json' -X POST -d '{"from": "mcb", "to": "BankOfChina", "sender": "Guru Jee", "reciever": "Osama", "tx": "Tx #2", "txDate": "21 Dec", "amount": "100", "fx": "1.0", "final": "1"}' "http://localhost:3000/transactions/1"