import { Categorie } from "./categorie"
import { Utilisateur } from "./utilisateur"

export interface Campagne {
    idCampagne: string
    titre: string
    description: string
    montantCible: number
    montantActuel: number
    pourcentage: number
    dateLimite: string
    jourRestant: string
    lieu: string
    dateModif: string
    imageUrl: string
    validee: boolean
    dateCreation: string
    createur: Utilisateur
    categorie: Categorie
    active: boolean
}
