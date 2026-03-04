import { useEffect, useState } from "react";
import analysisService from "../../services/analysisService";
import { Plus } from "lucide-react";

export default function AnalysesTableau(){
    const [analyses, setAnalyses] = useState([]);
     const fetchAnalyses = async () => {
            const analyses = await analysisService.getAllAnalyses();
            setAnalyses(analyses);
        };
    useEffect(() => {
       
        fetchAnalyses();
    },[])


    const ShowAnalyse = (slug: string) => {
        // Logique pour afficher les détails de l'analyse
        console.log(`Afficher les détails de l'analyse avec le slug: ${slug}`);
    }

    const EditAnalyse = (slug: string) => {
        // Logique pour éditer l'analyse
        console.log(`Éditer l'analyse avec le slug: ${slug}`);
    }

    const DeleteAnalyse = (slug: string) => {
        // Logique pour supprimer l'analyse
        confirm("Êtes-vous sûr de vouloir supprimer cette analyse ?") && analysisService.deleteOneAnalyse(slug).then(() => fetchAnalyses());
    }


    return(
        <div className="ebios-card"> 
        <div className="justify-between">
            <h2 className="text-2xl font-bold mb-4">Mes Analyses</h2>
            <button onClick={() => {window.location.href = "/analysis-tab";}} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                <Plus /> Analyser
            </button>
        </div>
        <table className="w-full table-auto">
            <thead>
                <tr>
                    <th className="px-4 py-2 text-left">Titre</th>
                        <th className="px-4 py-2 text-left">Organization</th>
                        {/* <th className="px-4 py-2 text-left">Statut Analyse</th> */}
                        <th className="px-4 py-2 text-left">Statut</th>
                        <th className="px-4 py-2 text-left">Pourcentage</th>

                    </tr>
                </thead>
                <tbody>
                    {analyses.map((analyse: any) => (
                        <tr key={analyse.slug} className="border-t">
                            <td className="px-4 py-2">{analyse.name}</td>
                            <td className="px-4 py-2">{analyse.organization}</td>
                            {/* <td className="px-4 py-2">{analyse.status_analysis}</td> */}
                            <td className="px-4 py-2">{analyse.status_label}</td>
                            <td className="px-4 py-2">{analyse.progress_percentage}%</td>
                            <td className="px-4 py-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600" onClick={() => ShowAnalyse(analyse.slug)}>
                                    Voir
                                </button>
                                <button className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 ml-2" onClick={() => EditAnalyse(analyse.slug)}>
                                    Modifier
                                </button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2" onClick={() => DeleteAnalyse(analyse.slug)}>
                                    Supprimer
                                </button>
                            </td>   
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}