import { Campagne } from "./campagne"
import { Utilisateur } from "./utilisateur"

export interface Contribution {
    idContribution: string
    montant: number
    pieceJustificative: string
    description: string
    dateContribution: string
    dateModif: string
    contributeur: Utilisateur
    campagne: Campagne
}
