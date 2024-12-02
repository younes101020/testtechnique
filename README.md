# Installation

```bash
git clone git@github.com:younes101020/testtechnique.git
yarn install
```

Créer un fichier .env à la racine du projet et y ajouter la variable DATABASE_URL. Assignez-lui les informations de connexion à votre base de données.

Puis
```bash
npx prisma db push
```

ensuite appliquer le fichier ./prisma/seed.sql dans votre base de donnée

# Note
 
J'ai initialement créé la structure de la base de données à l'aide du fichier ./prisma/schema.sql. Ensuite, j'ai généré un schéma prisma à partir de l'état de la base de données.
grâce à la commande `db pull`

# Verification

J'ai créer des test e2e qui couvre les pré-requis fournis

### Pré-requis fonctionnels

1. Un client (Customer) a la possibilité d'effectuer des locations (Rental) de films.
2. Chaque location est représentée par une date de début et une date de retour, qui peuvent être choisies par le client.
3. La durée d'une location est d'au minimum 1 semaine et ne doit pas excéder 3 semaines.
4. Les dates de début et de retour des locations sont définies en fonction du fuseau horaire (timezone) du client (les tables doivent être modifiées en conséquence).
5. Une location en cours n'est pas modifiable.

lancer les tests avec:
```bash
yarn test e2e
```