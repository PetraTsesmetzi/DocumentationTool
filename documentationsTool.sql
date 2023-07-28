DROP DATABASE IF EXISTS docutool;
CREATE DATABASE IF NOT EXISTS docutool;
USE docutool;
CREATE TABLE chapter
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    category_Id   INT,
    chapterName   VARCHAR(100)
);
CREATE TABLE subchapter
(
    id               INT PRIMARY KEY AUTO_INCREMENT,
    chapter_Id       INT,
    subchapterName   VARCHAR(100)
);

CREATE TABLE article
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    articleNumber INT,
    subchapter_Id INT,
    articleName   VARCHAR(100)
);
CREATE TABLE code
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    article_Id INT,
    elementOrder INT,
    codeText   TEXT
);
CREATE TABLE description
(
    id                INT PRIMARY KEY AUTO_INCREMENT,
    article_Id        INT,
    elementOrder      INT,
    descriptionText   TEXT
);

INSERT INTO chapter(id,category_Id,chapterName)
VALUES (Null,1,'Javascript Fundamentals Part 1');
INSERT INTO chapter(id,category_Id,chapterName)
VALUES (Null,1,'Javascript Fundamentals Part 2');
INSERT INTO chapter(id,category_Id,chapterName)
VALUES (Null,2,'PHP Fundamenetals');

INSERT INTO subchapter(id,chapter_Id, subchapterName)
VALUES (NULL,1, 'Values und Variables');
INSERT INTO subchapter(id,chapter_Id, subchapterName)
VALUES (NULL,1, 'Basic Operators Mathoperators');
INSERT INTO subchapter(id,chapter_Id, subchapterName)
VALUES (NULL,1, 'String und Template literals');
INSERT INTO subchapter(id,chapter_Id, subchapterName)
VALUES (NULL,2, 'Fundamentals Part 2_1');
INSERT INTO subchapter(id,chapter_Id, subchapterName)
VALUES (NULL,2, 'Fundamentals Part 2_2');
INSERT INTO subchapter(id,chapter_Id, subchapterName)
VALUES (NULL,2, 'Fundamentals Part 2_3');

INSERT INTO article(id, articleNumber,subchapter_Id, articleName)
VALUES (NULL, 1,1, 'Variables');
INSERT INTO article(id, articleNumber,subchapter_Id, articleName)
VALUES (NULL, 2,1, 'Namenskonvention');
INSERT INTO article(id, articleNumber,subchapter_Id, articleName)
VALUES (NULL, 3,1, 'Datentypen');

INSERT INTO code(id, article_Id,elementOrder, codeText)
VALUES (NULL, 1,1, 'let firstName = "Matilda";\nconsole.log(firstName); //Matilda');
INSERT INTO code(id, article_Id,elementOrder, codeText)
VALUES (NULL, 1,3, 'console.log(40 + 8 + 23 - 10); //61');
INSERT INTO code(id, article_Id,elementOrder, codeText)
VALUES (NULL, 2,1, 'let myPerson = "otto";\nlet jonas_matilda = "JM";');
INSERT INTO code(id, article_Id,elementOrder, codeText)
VALUES (NULL, 2,3, 'javascriptIsFun = "YES!";');
INSERT INTO code(id, article_Id,elementOrder, codeText)
VALUES (NULL, 3,1, 'let age = 25;\nlet price = 9.99;');
INSERT INTO code(id, article_Id,elementOrder, codeText)
VALUES (NULL, 3,2, 'let name = "John";\nlet message = ''Hello, World!'';');
INSERT INTO code(id, article_Id,elementOrder, codeText)
VALUES (NULL, 3,4, 'let person = {name: "John",age: 25,isStudent: true};');

INSERT INTO description(id, article_Id,elementOrder, descriptionText)
VALUES (NULL, 1,0,
        'Variablen in JavaScript ermöglichen es, Werte oder Objekte zu speichern und sie während der Laufzeit des Programms zu verändern. Sie werden mit dem Schlüsselwort "var", "let" oder "const" deklariert.');
INSERT INTO description(id, article_Id,elementOrder, descriptionText)
VALUES (NULL, 1,2,
        'Sie können verschiedene Datentypen wie Zahlen, Zeichenketten oder boolesche Werte enthalten. Die Verwendung von Variablen ermöglicht eine flexible und dynamische Programmierung in JavaScript.');
INSERT INTO description(id, article_Id,elementOrder, descriptionText)
VALUES (NULL, 1,4, 'Das Schlüsselwort var ist allerdings depricated und sollte nicht verwendet werden');
INSERT INTO description(id, article_Id,elementOrder, descriptionText)
VALUES (NULL, 2,0,
        'In JavaScript wird üblicherweise das sogenannte "camelCase" für die Namenskonvention verwendet. Dabei beginnt der Name mit einem Kleinbuchstaben und jeder folgende Wortteil wird mit einem Großbuchstaben gestartet, ohne Leerzeichen oder Sonderzeichen.');
INSERT INTO description(id, article_Id,elementOrder, descriptionText)
VALUES (NULL, 2,2,
        'Es wird empfohlen, aussagekräftige und beschreibende Namen für Variablen zu wählen, um den Code leichter lesbar und verständlich zu machen. Vermeiden Sie abgekürzte oder kryptische Bezeichnungen.');
INSERT INTO description(id, article_Id, elementOrder,descriptionText)
VALUES (NULL, 3,0,
        'JavaScript hat verschiedene Datentypen, darunter Zahlen, Zeichenketten, boolesche Werte, Arrays, Objekte, "null" und "undefined". ');
INSERT INTO description(id, article_Id,elementOrder, descriptionText)
VALUES (NULL, 3,3,
        'Der Datentyp "number" speichert numerische Werte, während der Datentyp "string" für Text verwendet wird. Boolesche Werte repräsentieren logische Aussagen wie "true" oder "false". Arrays sind geordnete Sammlungen von Werten, während Objekte Eigenschaften durch Schlüssel-Wert-Paare darstellen.');

ALTER TABLE code
    ADD FOREIGN KEY (article_Id) REFERENCES article(id) ON DELETE CASCADE;

ALTER TABLE description
    ADD FOREIGN KEY (article_Id) REFERENCES article(id) ON DELETE CASCADE;

ALTER TABLE article
    ADD FOREIGN KEY (subchapter_Id) REFERENCES subchapter(id) ON DELETE CASCADE;

