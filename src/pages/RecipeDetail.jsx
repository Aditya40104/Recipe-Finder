import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, Clock, Users, ExternalLink } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const RecipeDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    fetchRecipe()
    if (user) {
      checkIfFavorited()
    }
  }, [id, user])

  const fetchRecipe = async () => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipe')
      }

      const data = await response.json()
      if (data.meals && data.meals.length > 0) {
        setRecipe(data.meals[0])
      } else {
        setError('Recipe not found')
      }
    } catch (err) {
      setError('Failed to load recipe')
      console.error('Error fetching recipe:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkIfFavorited = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', id)
        .single()

      if (data) {
        setIsFavorited(true)
      }
    } catch (error) {
      // Not favorited or error - either way, not favorited
      setIsFavorited(false)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      alert('Please log in to save favorites')
      return
    }

    setFavoriteLoading(true)

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', id)

        if (error) throw error
        setIsFavorited(false)
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            recipe_id: id,
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
      setFavoriteLoading(false)
    }
  }

  const getIngredients = () => {
    if (!recipe) return []
    
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`]
      const measure = recipe[`strMeasure${i}`]
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient,
          measure: measure ? measure.trim() : ''
        })
      }
    }
    return ingredients
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Recipe not found</p>
      </div>
    )
  }

  const ingredients = getIngredients()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Search
      </Link>

      {/* Recipe Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-64 md:h-80 object-cover"
          />
          {user && (
            <button
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              className={`absolute top-4 right-4 p-3 rounded-full ${
                isFavorited
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-400 hover:text-red-500'
              } shadow-lg transition-colors`}
            >
              <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {recipe.strMeal}
          </h1>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
              {recipe.strCategory}
            </span>
            {recipe.strArea && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {recipe.strArea}
              </span>
            )}
            {recipe.strSource && (
              <a
                href={recipe.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 inline-flex items-center"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Source
              </a>
            )}
          </div>

          {/* Ingredients */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Ingredients
              </h2>
              <ul className="space-y-2">
                {ingredients.map((item, index) => (
                  <li key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">{item.ingredient}</span>
                    <span className="text-gray-500 font-medium">{item.measure}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Instructions
              </h2>
              <div className="prose prose-gray max-w-none">
                {recipe.strInstructions.split('\n').map((step, index) => (
                  <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                    {step.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* YouTube Video */}
          {recipe.strYoutube && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Video Tutorial
              </h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${recipe.strYoutube.split('v=')[1]}`}
                  title={`${recipe.strMeal} Tutorial`}
                  className="w-full h-64 md:h-80 rounded-lg"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail
