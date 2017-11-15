# Terve ryhmä tämä on meidän hieno projekti #

Seuraavaksi tarttis päättää kuka tekee mitäkin. Ite voin hoitaa serveri ja deployment jutut ja backia että mitäs muut tekee

### What is this repository for? ###

* Quick summary
* Älä poista linkkiä tossa alla että muistan miten markdownataan
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Asentakaa Docker, Löytyy wintoosan sivuilta docker for windows tai jottain
* Asentakaa pip löytyy pythonista tai sitten jostain muualta
* Asentakaa docker-compose komennolla ```pip install docker-compose```
* sitten vaan docker käymää testaatte että komento ```docker ps``` toimii ja antaa tyhjän sarakejutun
* ```docker volume create --name=mongodata``` Windows ei jaksa toimia asiallisesti suoraan kansioon joten pitää tehjä virtuaali asema
* kirjoita ```docker-compose build```
* ja viimestelläksesi koko maailman ```docker-compose up```
* jos valittaa et portti 80 o käytös ni ```NET stop HTTP``` voi koettaa commandlineen

### REST ###

> :3000/lights
* Jos ei o valoja käy osoitteessa
> :3000/general/haeValot
* jos on valoja käy osoitteessa
> :3000/congestions
* jos ei ole tietoja käy osoitteessa
> :3000/general/HaeData
* sitten taas kun dataakin löytyy voit hakea entrytjä
* osoitteesta
> :3000/congestions/getCongestion
* parametreilla
* lat long dist
* eli latitude londitude ja etäisyys siitä pisteestä kuin kaukaa haluu dataa

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact
