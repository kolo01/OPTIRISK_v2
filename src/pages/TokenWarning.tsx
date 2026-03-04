// TokenWarning.jsx (Version Purement Statique - Pour le design)

// Import des icônes à simuler si vous n'utilisez pas Lucide React ici.
// Pour la pureté de la demande, je les remplace par <span> "ICO".

const TokenWarning = () => {
    
    // --- Simulation des données ---
    // Nous allons simuler l'état où il reste 3 tokens (avertissement jaune).
    const remainingTokens = 3; 

    // Si on voulait simuler l'état épuisé (Rouge):
    // const remainingTokens = 0; 
    
    // Si tokens épuisés (Rouge)
    if (remainingTokens === 0) {
        return (
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                    <span className="w-5 h-5 text-red-500 mt-0.5">ICO</span>
                    <div className="flex-1">
                        <h3 className="font-medium text-red-900">Tokens IA épuisés</h3>
                        <p className="text-sm text-red-700 mt-1">
                            Vous avez utilisé tous vos tokens IA gratuits. Passez à un plan payant pour continuer à utiliser les fonctionnalités d'IA.
                        </p>
                        <button
                            // onClick est retiré
                            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition duration-200"
                        >
                            <span className="w-4 h-4">ICO</span>
                            <span>Passer à un plan payant</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Si tokens faibles (Jaune)
    if (remainingTokens > 0 && remainingTokens <= 5) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                    <span className="w-5 h-5 text-yellow-500 mt-0.5">ICO</span>
                    <div className="flex-1">
                        <h3 className="font-medium text-yellow-900">Tokens IA bientôt épuisés</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                            Il vous reste seulement {remainingTokens} tokens IA. Pensez à passer à un plan payant pour continuer à profiter des fonctionnalités d'IA.
                        </p>
                        <button
                            // onClick est retiré
                            className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition duration-200"
                        >
                            <span className="w-4 h-4">ICO</span>
                            <span>Découvrir nos plans</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Si plus de 5 tokens, ne rien afficher (return null dans la version originale)
    return null;
};

export default TokenWarning;