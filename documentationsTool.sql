DROP DATABASE IF EXISTS docutool;
CREATE DATABASE IF NOT EXISTS docutool;
USE docutool;

CREATE TABLE article
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    articleNumber INT,
    articleName   VARCHAR(100)
);
CREATE TABLE code
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    article_Id INT,
    codeText   TEXT
);
CREATE TABLE description
(
    id                INT PRIMARY KEY AUTO_INCREMENT,
    article_Id        INT,
    descriptionText TEXT
);

INSERT INTO article(id, articleNumber, articleName)
VALUES (NULL, 1, 'Variables');
INSERT INTO article(id, articleNumber, articleName)
VALUES (NULL, 2, 'Namenskonvention');
INSERT INTO article(id, articleNumber, articleName)
VALUES (NULL, 3, 'Datentypen');

INSERT INTO code(id, article_Id, codeText)
VALUES (NULL, 1, 'let firstName = "Matilda";console.log(firstName); //Matilda');
INSERT INTO code(id, article_Id, codeText)
VALUES (NULL, 1, 'console.log(40 + 8 + 23 - 10); //61');
INSERT INTO code(id, article_Id, codeText)
VALUES (NULL, 2, 'let jonas_matilda = "JM"; let person = "otto";');
INSERT INTO code(id, article_Id, codeText)
VALUES (NULL, 2, 'javascriptIsFun = "YES!";');
INSERT INTO code(id, article_Id, codeText)
VALUES (NULL, 3, 'let age = 25;let price = 9.99;');
INSERT INTO code(id, article_Id, codeText)
VALUES (NULL, 3, 'let name = "John";let message = ''Hello, World!'';');
INSERT INTO code(id, article_Id, codeText)
VALUES (NULL, 3, 'let person = {name: "John",age: 25,isStudent: true};');

INSERT INTO description(id, article_Id, descriptionText)
VALUES (NULL, 1,
        'Variablen in JavaScript ermöglichen es, Werte oder Objekte zu speichern und sie während der Laufzeit des Programms zu verändern. Sie werden mit dem Schlüsselwort "var", "let" oder "const" deklariert.');
INSERT INTO description(id, article_Id, descriptionText)
VALUES (NULL, 1,
        'Sie können verschiedene Datentypen wie Zahlen, Zeichenketten oder boolesche Werte enthalten. Die Verwendung von Variablen ermöglicht eine flexible und dynamische Programmierung in JavaScript.');
INSERT INTO description(id, article_Id, descriptionText)
VALUES (NULL, 1, 'Das Schlüsselwort var ist allerdings depricated und sollte nicht verwendet werden');
INSERT INTO description(id, article_Id, descriptionText)
VALUES (NULL, 2,
        'In JavaScript wird üblicherweise das sogenannte "camelCase" für die Namenskonvention verwendet. Dabei beginnt der Name mit einem Kleinbuchstaben und jeder folgende Wortteil wird mit einem Großbuchstaben gestartet, ohne Leerzeichen oder Sonderzeichen. Beispiel: myVariableName.');
INSERT INTO description(id, article_Id, descriptionText)
VALUES (NULL, 2,
        'Es wird empfohlen, aussagekräftige und beschreibende Namen für Variablen zu wählen, um den Code leichter lesbar und verständlich zu machen. Vermeiden Sie abgekürzte oder kryptische Bezeichnungen.');
INSERT INTO description(id, article_Id, descriptionText)
VALUES (NULL, 3,
        'JavaScript hat verschiedene Datentypen, darunter Zahlen, Zeichenketten, boolesche Werte, Arrays, Objekte, "null" und "undefined". ');
INSERT INTO description(id, article_Id, descriptionText)
VALUES (NULL, 3,
        'Der Datentyp "number" speichert numerische Werte, während der Datentyp "string" für Text verwendet wird. Boolesche Werte repräsentieren logische Aussagen wie "true" oder "false". Arrays sind geordnete Sammlungen von Werten, während Objekte Eigenschaften durch Schlüssel-Wert-Paare darstellen.');
