///////// Importation du module express /////////
const express=require("express")

//////// Le port sur lequel nous allons le serveur va écouter /////
const port =3000;

///// Création de l'application express //////////

const app=express();

///// Iportation du fichier contenant les éléments de connection à la base de données /////

const config=require("./config");

////////Imporations du module mysql2 pour la base de données /////
const mysql=require("mysql2");

/////// Création de la connction à la base de données //////

const dbCon=mysql.createConnection(config)

dbCon.connect(err=>{

    if(err){

        return console.log("Problème lors de la connection à la base de données",err)
    }
    console.log("La connection a été bien établie avec la base de données !!")
})


/////// Midillwares ////////////

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


////// La route pour affiche tous les films ///////

app.get("/films",(req,resp)=>{

    resp.send(" Tous les films sont là !")
})

/////////// La route POST pour ajouter un film /////

app.post("/ajoute/film",(req,resp)=>{

    let sql=" INSERT INTO film(nom,titre,acteur,duree) VALUES(?,?,?,?)"
    
    const {nom,titre,acteur,duree}=req.body

    if(!nom || !titre || !acteur || !duree){

        return resp.json({"erreur":"Données manquantes"})
    }
    dbCon.query(sql,[nom,titre,acteur,duree],(err,result)=>{

        if(err){

            return resp.status(500).json({"error":err})
        }

        resp.status(201).json({"Film ajouté avec succès":{

            "id":result.insertId,
            "nom":nom,
            "titre":titre,
            "acteur":acteur,
            "duree":duree
        }}
        )
    })
})
/////// La route PUT pour la mise à jour des films //////
/*
app.put("/modifie/film/:id",(req,resp)=>{

    console.log(req.body)

     const id=parseInt(req.params['id'])

     //// const { nom,titre,acteur,duree }=req.body

     let sql=" SELECT * FROM film WHERE id=?"
     

    dbCon.query(sql,[id],(err,result)=>{
     
        if(err){

            return resp.status(500).json({"erreur":err})
        }

        resp.status(200).json({result})

        console.log(req.body)


    
})







})
*/



app.put("/modifie/film/:id", (req, resp) => {
    console.log("Body reçu :", req.body);

    const id = parseInt(req.params.id);
    const { nom, titre, acteur, duree } = req.body;

    // Vérifie que les champs sont fournis
    if (!nom || !titre || !acteur || !duree) {
        return resp.status(400).json({ erreur: "Données manquantes" });
    }

    // Vérifie si le film existe
    let sqlSelect = "SELECT * FROM film WHERE id = ?";
    dbCon.query(sqlSelect, [id], (err, result) => {
        if (err) {
            return resp.status(500).json({ erreur: err.message });
        }

        if (result.length === 0) {
            return resp.status(404).json({ erreur: "Film non trouvé" });
        }

        // Si le film existe → on le met à jour
        let sqlUpdate = "UPDATE film SET nom = ?, titre = ?, acteur = ?, duree = ? WHERE id = ?";
        dbCon.query(sqlUpdate, [nom, titre, acteur, duree, id], (err2) => {
            if (err2) {
                return resp.status(500).json({ erreur: err2.message });
            }

            resp.status(200).json({ message: "Film modifié avec succès !" });
        });
    });
});





app.listen(port,()=>{

    console.log(`This server is running on:http://localhost:${port}`);
})