# IT2810 Prosjekt 3 - Gruppe 55

I prosjekt 3 ble vi utfordret til å lage en side hvor vi jobber med store datasett. Derfor har vi valgt å ha en nettside for søk i en sjakkspill-database, med mer enn 19000 partier sjakk å søke blant. Besøkende kan filtrere søket etter en rekke verdier, sortere resultatet som man ønsker, se mer info om hvert spill på en egen side, og legge igjen kommentarer på spill.

## Hvordan funksjonalitet ble oppfylt

### Frontend

Nettsiden består av to deler: “søkesiden” og “spillsiden”. Søkesiden er det første man ser når man besøker nettsiden, og inneholder en form for å skrive inn søkeparametre som brukernavn, vinner og gyldige rekkevidder for verdier som rangering og antall trekk, og en opprinnelig tom resultattabell under.

Etter å ha lagt inn et søk, kommer resultatet i form av en dynamisk tabell med en graf ovenfor. Grafen viser fordelingen av spillerrangering for hele resultatsettet - dette er vår “avanserte visning” som gir en viss oversikt man ikke får ved å se gjennom en lang tabell. Resultattabellen har “infinite scrolling” og laster inn flere og flere resultater etter hvert som brukeren scroller nedover. Kolonnenavnene ved toppen av tabellen kan klikkes på for å sortere tabellen etter kolonneverdiene.

Hvert sjakkspill i tabellen har en lenke spillsiden for det spillet, hvor man får tilgang til mer detaljert informasjon, og et kommentarfelt hvor brukeren kan lese hva andre har skrevet om spillet og legge inn sine egne tanker. Kommentarene lagres i databasen vår og er persistente mellom besøk. Disse spillsidene kan også besøkes direkte via URLen deres, uten å besøke hovedsiden først.


### Backend

Backenden til nettsiden vår består av en Express-webserver og en MySQL database-server. Frontend bruker REST-APIet til Express-serveren vår for alle funksjoner som har med databasen å gjøre, og de forskjellige metodene ligger tilgjengelig på /api/ på nettsiden. Når disse kalles, sender Express-serveren diverse SQL-queries til MySQL-serveren vår.

MySQL-serveren vår har vi hatt kjørende på vår virtuelle maskin gjennom hele utviklingen. Vi hentet datasettet vårt fra https://www.kaggle.com/datasnaek/chess/data, som består av over 19000 sjakkpartier fra nettstedet lichess.org. 19000+ elementer er nok til å utfordre løsningene våre for hvordan dataene skal vises på frontend. SQL CREATE INDEX statements brukte vi på hovedsøkeparametrene for raskere å hente data.

## Hvordan teknologikrav ble oppfylt

### Frontend

#### Statistikk-graf

Grafen vår som viser spillerrangering-statistikk for et resultatsett visualiseres med node-pakken “victory”. Denne består av en rekke React-komponenter for datavisualisering. I Graph.jsx hentes data fra Redux-store og sendes til VictoryBar-komponenten som rendrer en kolonnegraf.

#### Infinite scrolling

For å implementere infinite scrolling laster vi rett og slett inn flere resultat når vinduet er nært nok bunnen av søkesiden. ResultBox-komponenten binder en event-listener til window som sjekker om vinduet er nært nok bunnen hver gang brukeren scroller, og hvis den er det, dispatcher det en “fetchMoreSearchResults”-action. Når de nye resultatene legges i state rendrer komponenten automatisk de nye resultatene, og listen forlenges.

#### Ruting i React

For å håndtere det å ha flere sider med mange forskjellige URLer i én og samme React-app, brukte vi biblioteket react-router. Det gjør at man kan laste inn riktig side-komponent ved å besøke en bestemt URL (som /game/[gameID]), eller via å klikke på en Link-komponent som tar deg til siden uten å laste inn React-applikasjonen på nytt.

#### State management med React-Redux

For å bli kjent med en veldig populær teknologi valgte vi å bruke Redux for state management. All state i React-applikasjonen vår (utenom “ignoreColors”-variabelen i SearchBox, siden denne ikke trenger ligge i global state) er lagret i én felles Redux-store.

Filene som brukes for Redux er organisert slik innenfor /frontend/src/-mappen vår:
- store.js instansierer og eksporterer store
- /actions/action-types.js inneholder konstantverdiene vi bruker i våre actions
- /actions/index.js inneholder alle actions-generatorene våre
- /reducers/ inneholder reducerne for våre tre deler av state - searchResultsReducer.js, gameReducer.js, commentsReducer.js - som samles i en felles rootReducer i index.js

For å hente state-verdiene som behøves i React-komponenter, og for å la dem sende actions til store, bruker vi vi connect()-funksjonen fra “react-redux”. Mange komponenter bruker mapStateToProps og mapDispatchToProps for å knytte komponenten opp mot delene av store som komponenten behøver.

Siden nettsiden vår må jobbe asynkront opp mot en server, og dataene som sendes og mottas henger tett sammen med tilstanden til nettsiden, har det vært en utfordring å designe actions og reducers på en “ren”, Redux-idiomatisk måte. Den beste måten ville vært å bruke Redux-middleware som “redux-thunk” som er godt egnet for denne oppgaven. Vi ønsket ikke å bruke middleware fordi vi ville bli kjent med Redux før vi la på enda et lag med kompleksitet på toppen av actions, reducers, og map(State/Dispatch)ToProps. I stedet løste vi problemet på nest beste måte:

- Actions som henter eller poster data finnes i tre varianter: fetch[Data], fetch[Data]Failure, og fetch[Data]Success. fetch[Data] brukes for å starte hele prosessen.
- Når reduceren behandler en fetch[Data] action, kaller den fetch() før den går over til en isFetching-state hvor ingen andre requests kan behandles.
- Når fetch-requesten returnerer, dispatcher den fetch[Data]Failure hvis noe går galt, eller fetch[Data]Success hvis ikke.
- Begge disse actionene setter isFetching til false, og fetch[Data]Success bruker i tillegg resultatene til å oppdatere state.

Ulempen med denne løsningen er at vi har en reducer som forårsaker sideeffekter, og som indirekte dispatcher nye actions, som er fy-fy. Likevel ser det ut som om løsningen vår er svært stabil og grei å jobbe med.

### Backend

#### REST API og express

REST API er implementert med node/express. Express er integrert med MySQL.
Vi har brukt “Express Application Generator” som lager et hensiktsmessig Express skjelett. Denne lager en entry point fil “/bin/www” som har noe error håndtering samt laster app.js hvor vi setter opp applikasjonen med ulike requirements vi trenger, samt middleware. 

For å lage ruter har vi brukt express.Router som middleware fordi dette lar oss gruppere rutehåndterere. Dette er hensiktsmessig når vi har flere endepunkt med lik base URL struktur (i våres tilfelle ./games/) for å unngå unødig repetisjon i koden samt gruppere for en mer oversiktlig struktur (best practice: https://www.tutorialspoint.com/expressjs/expressjs_best_practices.htm )

API er RESTfult ved at koden er strukturert med en klient-server modell som gjør at klienten og server er uavhengig. Videre er APIet tilstandsløs ved at server ikke husker klientenes forespørsler og er uavhengig av tidligere forespørsler. Et eksempel på dette er sortering av datasettet. Her blir det sendt en ny GET request til server som er uavhengig av søkeresultat som allerede er mottatt av klient. Dette gjør da at hele det aktuelle datasettet blir sortert og ikke bare det som tilfeldigvis er lastet inn på klienten. Videre har APIet uniformt grensesnitt ved at data identifiseres i request (GET og POST med HTTP) gjennom URLer. Dataen er uavhengig av hva som leveres til klienten. Vi sender data i JSON format til klient fra database, men i databasen har den et annet format. 

Vi valgte å bruke MySQL som RDBMS da gruppen var kjent med syntaksen fra tidligere kurs. Ved bruk av ES6 destructuring av req.query i gameController.js konstruerer vi queryet som sendes til databasen og sender resultat hvis ikke error. 

Vi valgte å bruke REST API overfor graphQL fordi REST APIer er veldig utbredt og vi var nysgjerrige og ønsket å lære oss å lage et RESTfult API.


### Testing

For å teste koden vår har vi brukt Jest og Cypress. Med Jest har vi laget snapshot-tester som sjekker at innholdet i komponentene i koden laster inn, i tillegg for å få en oversikt over om komponentene har forandret seg siden siste test. Med Cypress testet vi om programflyten oppfører seg som forventet, ved å lage en automatisert end-to-end test der vi simulerer en bruker-interaksjon. For å kjøre testene i Jest bruker man kommandoen ‘npm test’ i ‘<rootDir>’, mens end-to-end-testen kjøres i ‘<rootDir>\frontend’ med kommandoen ‘node_modules\.bin\cypress open’. 
