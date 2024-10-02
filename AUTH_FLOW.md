1. Fare una richiesta a {backend_url}/auth/42
2. Questa richiesta andra' a rispondere con un json formato cosi' { redirect_url: "some url" }
3. Reindirizzare l'utente a questa pagina dove andra' ad eseguire l'autenticazione con l'API 42
4. L'utente dopo l'autenticazione tornera' sul sito in una pagina che mi devi dire (attualmente {frontend_url}/42_auth )
   con diversi parametri GET
5. Mandare una richiesta a {backend_url}/42/callback con tutti i parametri GET arrivati
6. Ti rispondera' con un JSON formato cosi' { access_token: "something", refresh_token: "something"}, sono da salvare
   entrambi da qualche parte
7. Per tutte le altre richieste devi aggiungere l'header Authorization con il valore "Bearer <access_token>"