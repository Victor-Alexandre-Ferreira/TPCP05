## Liste requête SQL

```SQL
-- toutes les promos, dans l'ordre alphabétique
SELECT * FROM "promo" ORDER BY "name";
```

```SQL
/* 
tous les étudiants, 
dans l'ordre alphabétique des noms de famille
*/
SELECT * FROM "student" ORDER BY "last_name";
```

```SQL
-- tous les étudiants de la promo 135
SELECT * FROM "student" WHERE "promo_id" = 135;
```

```SQL
-- les étudiants dont le nom ou le prénom ressemble à "max"
-- Le % est un caractère Joker, il ser a représenté n'importe quel série de caractère
-- LIKE est l'opérateur de comparaison qui permet de rechercher une série de caractère dans une chaîne de caractère, mais il a une particularité, c'est qu'il est sensible à la casse.
-- Afin de faire une recherche insensible à la casse on peut utiliser ILIKE
SELECT * FROM "student" WHERE "last_name" ILIKE 'max%' OR "first_name" ILIKE 'max%';
-- Si on devait avoir cette requête en SQL standard on écrirais plutôt :
SELECT * FROM "student" WHERE LOWER("last_name") LIKE 'max%' OR LOWER("first_name") LIKE 'max%';
-- LOWER est une des fonctions disponible en SQL, elle permet de transfomer une chaîne de caractère, qui comprendrais des majuscule, en minuscule. C'est l'équivalent de .toLowerCase() en JS
```

```SQL
-- Insérer dans la table "student" un étudiant qui s'appelle "Chuck Norris" appartenant à la promo 5
INSERT INTO "student" ("first_name","last_name", "promo_id") VALUES ('Chuck','Norris', 5);
-- ou
INSERT INTO "student" ("first_name","last_name", "github_username","profile_picture_url", "promo_id") VALUES ('Chuck','Norris', NULL, NULL, 5);
```

```SQL
-- Insérer dans la table "promo" une promo qui s'appelle "César" et ne possède pas d'orga
INSERT INTO "promo" ("id", "name") VALUES (1000, 'César');
-- ou

INSERT INTO "promo" ("id", "name", "github_organization") VALUES (1000, 'César', NULL);
```

```SQL
-- Mettre à jour la promo 5 pour la renommer "Cleo"
UPDATE "promo" SET "name" = 'Cleo' WHERE "id" = 5;
```

```SQL
-- Supprimer la promo 123
DELETE FROM "student" WHERE "promo_id" = 123;
DELETE FROM "promo" WHERE "id" = 123;
```
