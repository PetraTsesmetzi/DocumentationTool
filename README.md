# DocumentationTool
Das Hauptziel der App ist es, den bisher behandelten Programmier- oder Unterrichtsstoff systematisch zu dokumentieren
und einen geordneten Zugriff auf Codesnippets, Webtechnologien und Tutorials zu ermöglichen. Die Web-Anwendung ist auf
Unterkapitel und deren zugehörige Artikel reduziert. Die Artikelbearbeitung folgt dem CRUD-Prinzip und erlaubt das
Erstellen, Lesen, Aktualisieren und Löschen von Artikeln.


# LandingPage
## Navigation-Header
- Anzeige von Kategorien als statische Links in der oberen Navigations-Leiste(ohne Funktionalität)
- Bearbeiten Button für den Bearbeitungsmodus

## Navigation-Left
- Anzeige von Kapitel, Unterkapitel in der linken Navigationsleiste

## Content
- Im Content werden alle Artikel zu einem Unterkapitel geladen.

## Anforderung Bearbeitungsmodus
Über einen Button Bearbeiten gelangt man in den Bearbeitungsmodus.
Dort hat man die Möglichkeit über die Buttons Einfügen, Löschen und Ändern, neue Artikel zu erstellen, Artikel zu Löschen oder zu Ändern.

## Artikel Einfügen
Über den Button Einfügen gelangt man zu einem Formular. Dort wird man aufgefordert einen Artikelnamen, Beschreibungen und Codeblock einzufügen. Ein Code und Beschreibungsblock sind Pflichtbestandteil. Diese kann man nicht löschen.
Weiterhin gibt es dort über 2 Buttons die Möglichkeit weitere Codeblöcke und Beschreibungsblöcke in unterschiedlicher Reihenfolge hinzuzufügen oder zu löschen.

## Artikel Löschen
Durch das Drücken des Löschen Buttons wird der Artikel mit sämtlichen Code und Beschreibungsblöcken gelöscht.

## Artikel Ändern
Durch das Drücken des Ändern Buttons erscheint wieder ein Formular. Dieses ist diesmal vor ausgefüllt mit dem zuvor gewählten Artikel. Alle Code-Felder und Beschreibungsfelder bis auf die 2 obengenannten Pflichtfelder kann man  ändern oder entfernen.

## Umsetzung
Das Projekt wird mit Javascript 2022 (Frontend) und PHP 8.2(Backend) realisiert. Zur Kommunikation zwischen Frontend und Backend wird Ajax verwendet. Die gewählte Datenbank ist Maria DB 10.4.27.
