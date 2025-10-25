///////// Importation du module express /////////
const express=require("express")

//////// Le port sur lequel nous allons le serveur va écouter /////
const port =5000;

///// Importation du module cors ////

const cors=require('cors')
///// Création de l'application express //////////

const app=express();

///// Iportation du fichier contenant les éléments de connection à la base de données /////

const config=require("./config");

////////Imporations du module mysql2 pour la base de données /////
const mysql=require("mysql2");

/////// Création de la connction à la base de données //////
const dbCon=mysql.createConnection({
    host:config.myHost,
    user:config.myUser,
    password:config.myPassword,
    database:config.myDatabase,
    port :config.myPort
})

dbCon.connect(err=>{

    if(err){

        return console.log("Problème lors de la connection à la base de données",err)
    }
    console.log("La connection a été bien établie avec la base de données !!")
})


/////// Midillwares ////////////
app.use(cors())
app.use(express.json())


////// La route pour affiche tous les films ///////

app.get("/films",(req,resp)=>{

    let sql= "SELECT * FROM film"

    dbCon.query(sql,(err,result)=>{

        if(err){

            return resp.status(500).json({"Erreur":err.message})
        }
        resp.status(200).json({"Les film disponibles :":result})
    })

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
app.put("/modifie/film/:id",(req,resp)=>{

     const id=parseInt(req.params['id'])

      const { nom,titre,acteur,duree }=req.body

      if(!nom || !titre || !acteur || !duree){

        return resp.json({"erreur":"Données manquantes"})
    }

     let sql=" SELECT * FROM film WHERE id=?"
     

    dbCon.query(sql,[id],(err,result)=>{
     
        if(err){

            return resp.status(500).json({"erreur":err})
        }
        if(result.length===0){

            return resp.status(404).json("Auncun film n'est trouvé")
        }
       let sqlPut="UPDATE film SET nom=?,titre=?,acteur=?,duree=? WHERE id=?";

        dbCon.query(sqlPut,[nom,titre,acteur,duree,id],(erro,results)=>{


            if(erro){

                return resp.status(500).json({"erreur":erro})
            }
            resp.status(200).json({"Le film à été mis à jour":{
             "id":id,
             "nom":nom,
             "titre":titre,
             "acteur":acteur,
             "duree":duree
            
            }})

        })       
    })
})

/** La route de suppression de films */

app.delete('/supprime/film/:id',(req,resp)=>{

    let id=parseInt(req.params['id'])

    let sql=" DELETE FROM film WHERE id=?";

    dbCon.query(sql,[id],(err,result)=>{

        if(err){

            return resp.status(404).json({"Aucun film trouvré":err.message})
        }
        if(result.affectedRows===0){

            return resp.status(404).json("Aucun film trouvé")
        }
        resp.status(200).json({"Film supprimé avec succès":result})
    })

})

app.listen(port,()=>{

    console.log(" Server is running !!!");
})