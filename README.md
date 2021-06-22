# mp_leitstellenspiel_extras
Addons für Leitstellenspiel

## Infos
Kleine Helferlein die im LSSM (noch) nicht enthalten sind werden hier aktiviert.

## Verfügbare Features
Die Features sind schon verfügbar:

* **Einsatz-Geschwindigkeit** wird immer beim Einsatz-Filter angezeigt, nicht nur, wenn Pause ist
* **Bereitstellungsraum** bessere Auswahl: alle Fahrzeuge von einzelnen Wachen auswählen, um sie nach Hause zu schicken (Anhänger auch extra, damit sie nicht im Status 9 hängen bleiben)
* **Personal-Anheuern** wenn der Spieler keinen Premium-Status hat, werden alle 2 Tage alle Wache auf 3 Tage Personal-Annheuern gestellt (läuft im Hintergrund, in der [Browser-Console (unten auf der Seite steht, wie man sie öffnen kann)](https://www.w3schools.com/js/js_debugging.asp) zu sehen)
* **Krankenhaus-Info** im Fenster Sprechwunsch bearbeiten, werden mehr Infos zum Krankenhaus per Moveover angezeigt (Inhaber und Stufe) - beim Klick auf Info öffnet sich das Krankenhaus im neuen Tab/Fenster
* **Personal-Übersicht** alles Personal kann in einer Liste sehen (unter Menü Profil->Angestellte) - mit Ausbildung und Fahrzeug-Bindung
* **Einsatz-Filter** die Einsatzliste kann nach Credits gefiltert werden
* **Info und Config Dialog** ist jetzt unter Profil ganz unten zu erreichen - wird bei Verions-Update einmalig pro Browser eingeblendet
* **Chat history highlighting** im Chatverlauf werden eigene Nachrichten oder mit Nennung des Spielernamens hervorgehoben
* **Gebäude zuklappen** es können in der Gebäude-Liste die Gebäude einzeln zu- und aufgeklappt werden - für alle ist noch in Arbeit

## Installation
Zum einfachen Betrieb des Script empfiehlt sich der Einsatz von [TamperMonkey](https://www.tampermonkey.net/). Dort einfach ein neues Skript hinzufügen und den Inhalt von [mp_loader.js](../mp_loader.js) reinsetzen.


## Features im Aufbau
Folgende Feature werden aktuell noch aufgebaut:
* **Gebäude zuklappen** toggle für alle - Problem sind noch nicht geladene Fahrzeuge

## Feature Ideen
* **Globaler Cache** Personal-Daten und andere gespeicherte Daten in die Cloud speichern, damit die nicht in jedem Browser erneut geladen werden müssen ??? **Datenschutz prüfen**

## Kontakt
Wenn Fehler auftreten, oder Änderungswünsche bestehen, bitte gerne einen Issue Request eröffnen

## Rechtliches
Dies sind freie Skripte zur Erweiterung des Browser-Spiels leitstellenspiel - es besteht keinerlei Anspruch auf Vollständigkeit oder Fehlerfreiheit oder Support - jegliche Haftung wird ausgeschlossen - **Einsatz auf eigene Gefahr**. 

> WARNUNG: Der Rechte-Inhaber des Spiels untersagt ausdrücklich den Einsatz von automatisierten Skripten (hier das Anheuern) und droht mit sofortiger Kündigung des Spieler-Accounts!

Die Skripte loggen beim Aufruf lediglich die Spieler-ID und die aktiven Skripte (also welche Module geladen werden) mit - sonst werden keinerlei Daten erhoben.
