const player = {
    power: 0,  
    stamina: 0,       // actual state of HP
    staminaMax : 0,   // max stamina possible for hero, used to check if not trying to 'over-heal', will increase with leveling
    luck: 0,          // will be used for critical hits and avoiding dangers 
    mana: 4,          // for casting spells, will increase with leveling
    attackModificator: 6,  // random in range of this will add to power during combat to determine if attack succeded, will change with changing weapons, 
    fireboltLevel: 1,  // for shooting fire damage, level adds to damage roll
    healLevel: 1,       // like firebolt but healing
} 

const opponent = {
    power: 10,
    stamina: 18,
    attackModificator: 0,
}

const obstacle = [
    0,0,0,0,0,19,0,0,0,0,1
];

const eventMsg = [
    "",
    "Setting i ogolne info, taki a'la wstep: jakies zadupie stylizowane na XVII wiek, jako synek ubogiego szlachetki zostales wyslany do bogatszego magnata na sluzbe i wychowanie. Tam uczyli cie machania szabelka, laciny i ogolnego funkcjonowania. Pewnego razu kazali posprzatac zabudowania gospodarskie i lamusy, gdzie znalazles starodawne zakurzone i pozolkniete ksiegi o magu-wojowniku, autorstwa niejakiego Zapkovskiego. Z ksiag tych dowiedziales sie wiele o czasach sprzed 'strasznej sniezycy', zwanej rowniez 'bialym zimnem'. O tym mroznym okresie slyszales juz wczesniej bo to opowiesc przekazywana z dziada pradziada. Teraz jednak posiadles wiedze o wszystkich strzygach, zjawach i innych potworach zyjacych wsrod ludzi. Wyczytales tez jak sporzadzic dekokt leczniczy oraz substancje prowokujaca zaplon z proszku zwanego mana oraz ogolnie dostepnych skladnikow. Bogatszy o te wiedze i posiadajac wczesniej zdobyte umiejetnosci postanowiles zostac samozwanczym Srexerem. A pewnego dnia udales sie do karczmy...<br> Siedzisz w karczmie, wpada banda, robi chlew. Co robisz?",
    "Postanowiles obserwowac dalszy rozwoj sytuacji",
    "Herszt bandy podchodzi i stwierdza, ze siedzisz jak ta pizda i masz wypierdalac. Co robisz?",
    "Wychodzisz grzecznie z poczuciem, ze rzeczywiscie jestes pipa i miekka faja. Game over.",
    "Podchodzisz do bandy i zamawiasz u karczmarza kolejke jurajskiej przepalanej. Proponujesz by przestali robic burde. Sprawdzmy twoje zdolnosci przekonywania.",
    "Brawo, jakims cudem zabrzmiales na tyle groznie i przekonujaco, ze sie wystraszyli i poszli. Uratowales karczme, bohaterze!",
    "Niestety nie masz sily przekonywania. Mozesz zaatakowac ich z zaskoczenia lub zaproponowac pojedynek z hersztem.",
    "Dowodca bandy bylby miekkim fiutem gdyby odmowil, walczcie.",
    "Postanowiles zaatakowac z zaskoczenia, mozesz sprobowac wystrzelic ogniem wykorzystujac przewage, lub od razu siegnac po szable.",
    "Jeden z bandziorow tez ma niezly refleks, dobyl krocicy zza pasa i strzela z ramienia. Rzuc aby sprawdzic czy udalo ci sie uniknac postrzalu.",
    "Musisz teraz stawic czola czterem przeciwnikom jednoczesnie, to bedzie ciezka przeprawa.",
    "Postanawiasz bez dyskusji rzucic sie na nich z szabla, w koncu jestes Srexerem. Do walki!",
    "Masz farta, uniknales postrzalu.",
];

function rollDiceDx(Dx) { // basic dice rolling function
    min = Math.ceil(1);
    max = Math.floor(Dx);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRandomPlayer(){   // generating player stats on loading 'game'
    player.power = 6 + rollDiceDx(6);
    player.stamina = 12 + rollDiceDx(12);
    player.staminaMax = player.stamina;
    player.luck = rollDiceDx(4);
}

function setTeamOpponent(){
    opponent.power = 16;
    opponent.stamina = 28;
}

function obstacleTest(parNr){
    switch(parNr){
    case 5:
        modificator = rollDiceDx(20);
        if ((modificator + player.luck) > obstacle[parNr]){
            parNr = 6;
        }
        else if ((modificator + player.luck) < obstacle[parNr]){
            parNr = 7 
        }
        break;
    case 10:
        setTeamOpponent();
        if (player.mana > 0) {
            --player.mana;
            opponent.stamina -= 4;
        }
        break;
    case 11:
        modificator = rollDiceDx(20);
        check = modificator + player.luck;
        if (check < 6){
            document.getElementById("displayEventText").innerHTML = "Trafienie krytyczne!";
            displayGameOver();  
        }
        else {
        parNr = 13;
        }
        break;

    }
    displayer(parNr);
}

function displayer(parNr){
    displayMessage(parNr);
    clearButtons();
    displayButtons(parNr);
}

function displayPlayerStats(){
    document.getElementById("displayPlayerStats").innerHTML = 
    "Sila: "+player.power+"<br>"+"Wytrzymalosc: "+player.stamina+"<br>"+"Szczescie: "+player.luck+"<br>"+"Mana: "+player.mana;
}

function displayOpponent(){
    document.getElementById("opponentStats").innerHTML = 
    "Sila przeciwnika: "+opponent.power+"<br>"+"Wytrzymalosc przeciwnika: "+opponent.stamina;
}

function displayMessage(parNr){
    document.getElementById("displayEventText").innerHTML = eventMsg[parNr];
}

function hideCombatRelatedButtons(){  // hiding combat buttons when not in dungeon
    document.getElementById("combat").style.display = "none";
    document.getElementById("firebolt").style.display = "none";
    document.getElementById("heal").style.display = "none";
}
function showCombatRelatedButtons(){  // showing combat buttons in dungeon to handle encounter
    document.getElementById("combat").style.display = "block";
    document.getElementById("firebolt").style.display = "block";
    document.getElementById("heal").style.display = "block";
}

function isOpponentDead(){ // if opponent dead come back to 'menu'
    if (opponent.stamina <= 0){
        document.getElementById("opponentStats").innerHTML = "YOU WON"
        hideCombatRelatedButtons();
        document.getElementById("controls").innerHTML = "<button onclick=\"window.location.reload()\">Restart</button>";
    }  
}

function isPlayerDead(){ // if player dead game over
    if (player.stamina <= 0){
        displayGameOver();
        document.getElementById("controls").innerHTML = "<button onclick=\"window.location.reload()\">Restart</button>";
        hideCombatRelatedButtons();
    }
}

function combat(){
    playerCombat = player.power + rollDiceDx(player.attackModificator);
    opponentCombat = opponent.power + rollDiceDx(opponent.attackModificator);
    if (playerCombat > opponentCombat){
        opponent.stamina -= 2;
    }
    else if (playerCombat < opponentCombat){
        player.stamina -= 2;
    }
    displayUpdate();
    isPlayerDead();
    isOpponentDead();
}

function firebolt(){
    if (player.mana == 0){
        document.getElementById("displayEventText").innerHTML = "No mana !";
        return;
    }
    else {
        player.mana -= 1;
        fireboltShot = player.fireboltLevel + rollDiceDx(4);
        opponent.stamina -= fireboltShot;
        displayUpdate();
        isOpponentDead();
    }
}

function heal(){
    if (player.mana == 0){
        document.getElementById("displayEventText").innerHTML = "No mana !";
        return;
    }

    if (player.stamina == player.staminaMax){
        document.getElementById("displayEventText").innerHTML = "HP full, no need to heal!";
        return;
    }    

    else {
        player.mana -= 1;
        healing = player.healLevel + rollDiceDx(4);
        player.stamina += healing;
        if (player.stamina > player.staminaMax){
            player.stamina = player.staminaMax;
        }
        displayUpdate();
    }
}

function displayUpdate(){
    displayPlayerStats();
    displayOpponent();
}

function displayGameOver(){  
    document.getElementById("displayEventText").innerHTML = "GAME OVER !" 
}

function displayButtons(parNr){
    switch (parNr){
        case 1:
            document.getElementById("controls").innerHTML = "<button onclick=\"displayer(2)\">Nie reaguj</button><button onclick=\"displayer(5)\">Zaproponuj kolejke</button><button onclick=\"displayer(12)\">Zaatakuj z zaskoczenia</button>";
            break;
        case 2:
            document.getElementById("controls").innerHTML = "<button onclick=\"displayer(3)\">Kontynuujmy</button>";
            break;
        case 3:
            document.getElementById("controls").innerHTML = "<button onclick=\"displayer(4)\">Grzecznie wyjdz</button><button onclick=\"displayer(8), displayOpponent(), showCombatRelatedButtons()\">Zaproponuj pojedynek z bossem</button>";
            break;
        case 4:
            document.getElementById("controls").innerHTML = "<button onclick=\"window.location.reload()\">Restart</button>";
            break;
        case 5:
            document.getElementById("controls").innerHTML = "<button onclick=\"obstacleTest(5)\">Sprobuj przekonac</button>"; 
            break;
        case 6:
            document.getElementById("controls").innerHTML = "<button onclick=\"window.location.reload()\">Restart</button>";
            break;
        case 7:
            document.getElementById("controls").innerHTML = "<button onclick=\"displayer(8), displayOpponent(), showCombatRelatedButtons()\">Zaproponuj pojedynek z bossem</button><button onclick=\"displayer(9)\">Atak z zaskoczenia</button>"; 
            break;
        case 9:
            document.getElementById("controls").innerHTML = "<button onclick=\"obstacleTest(10)\">Strzel ogniem</button><button onclick=\"displayer(10)\">Atakuj od razu</button>"
            break;
        case 10:
            document.getElementById("controls").innerHTML = "<button onclick=\"obstacleTest(11)\">Sprobuj zrobic unik</button>"
            break;
        case 11:
            //document.getElementById("controls").innerHTML = "<button onclick=\"displayer(11), displayOpponent(), showCombatRelatedButtons()\">TEN BUTTON NIC NIE ROBI - DO POPRAWKI</button>";
            break;
        case 12: 
            setTeamOpponent();
            document.getElementById("controls").innerHTML = "<button onclick=\"displayer(11), displayOpponent(), showCombatRelatedButtons()\">WALKA</button>";
            break;
        case 13:
            document.getElementById("controls").innerHTML = "<button onclick=\"displayer(11), displayOpponent(), showCombatRelatedButtons()\">WALKA</button>";
            break;          
        }       
}

function clearButtons(){
    document.getElementById("controls").innerHTML = "";
}