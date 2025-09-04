import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const Favorites = () => {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFavorites(data || [])
    } catch (err) {
      setError('Failed to load favorites')
      console.error('Error fetching favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (recipeId) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)

      if (error) throw error
      
      setFavorites(favorites.filter(fav => fav.recipe_id !== recipeId))
    } catch (error) {
      console.error('Error removing favorite:', error)
      alert('Error removing favorite. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Favorite Recipes
        </h1>
        <p className="text-gray-600">
          {favorites.length === 0
            ? 'You haven\'t saved any favorite recipes yet.'
            : `You have ${favorites.length} favorite recipe${favorites.length === 1 ? '' : 's'}.`}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start searching for recipes and click the heart icon to save them here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <Link to={`/recipe/${favorite.recipe_id}`}>
                <img
                  src={favorite.recipe_image}
                  alt={favorite.recipe_name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              
              <div className="p-4">
                <Link to={`/recipe/${favorite.recipe_id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-orange-600 transition-colors">
                    {favorite.recipe_name}
                  </h3>
                </Link>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    Added {new Date(favorite.created_at).toLocaleDateString()}
                  </span>
                  
                  <button
                    onClick={() => removeFavorite(favorite.recipe_id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
