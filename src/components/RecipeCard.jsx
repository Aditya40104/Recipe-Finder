import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Clock, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const RecipeCard = ({ recipe }) => {
  const { user } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggleFavorite = async (e) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please log in to save favorites')
      return
    }

    setLoading(true)

    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipe.idMeal)

        if (error) throw error
        setIsFavorited(false)
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            recipe_id: recipe.idMeal,
            recipe_name: recipe.strMeal,
            recipe_image: recipe.strMealThumb,
          })

        if (error) throw error
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Error saving favorite. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <Link to={`/recipe/${recipe.idMeal}`}>
        <div className="relative">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-48 object-cover"
          />
          {user && (
            <button
              onClick={toggleFavorite}
              disabled={loading}
              className={`absolute top-2 right-2 p-2 rounded-full ${
                isFavorited
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-400 hover:text-red-500'
              } shadow-md transition-colors`}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {recipe.strMeal}
          </h3>
          
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
              {recipe.strCategory}
            </span>
            {recipe.strArea && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs ml-2">
                {recipe.strArea}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-3">
            {recipe.strInstructions?.substring(0, 120)}...
          </p>
        </div>
      </Link>
    </div>
  )
}

export default RecipeCard
