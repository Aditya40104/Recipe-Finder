import { useState, useEffect } from 'react'
import { Search, Clock, Users } from 'lucide-react'
import RecipeCard from '../components/RecipeCard'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchRecipes = async (query) => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipes')
      }

      const data = await response.json()
      setRecipes(data.meals || [])
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.')
      console.error('Error fetching recipes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    searchRecipes(searchTerm)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Delicious Recipes
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Search thousands of recipes and save your favorites
        </p>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for recipes (e.g., pasta, chicken, curry...)"
              className="block w-full pl-10 pr-3 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full sm:w-auto px-8 py-4 bg-orange-500 text-white text-lg font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search Recipes'}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* No Results */}
      {!loading && recipes.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No recipes found for "{searchTerm}". Try a different search term.
          </p>
        </div>
      )}

      {/* Results Grid */}
      {recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>
      )}

      {/* Featured Section (when no search) */}
      {!searchTerm && !loading && (
        <div className="text-center py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <Search className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Search Recipes
              </h3>
              <p className="text-gray-600">
                Find recipes by ingredient, cuisine, or dish name
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Save Time
              </h3>
              <p className="text-gray-600">
                Get detailed instructions and ingredient lists
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Save Favorites
              </h3>
              <p className="text-gray-600">
                Create an account to save your favorite recipes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
