import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhotoIcon } from '@heroicons/react/24/outline'

function CreateEvent() {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        setError('Billedet må maksimalt være 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Filen skal være et billede')
        return
      }

      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Opret FormData objekt til at sende både data og fil
      const formData = new FormData()
      formData.append('image', image)
      // Tilføj andre event data
      Object.keys(eventData).forEach(key => {
        formData.append(key, eventData[key])
      })

      const response = await fetch('/api/events/create', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }

      setSuccess('Event blev oprettet succesfuldt')
      setTimeout(() => {
        navigate('/admin')
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Opret nyt event
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Udfyld alle felter for at oprette et nyt event
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-5 flex flex-col items-center">
            <div className="text-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Titel
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  className="input-field pl-1 h-8 w-full bg-gray-100 rounded-md"
                  placeholder="Event titel"
                  value={eventData.title}
                  onChange={(e) => setEventData({...eventData, title: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <div className="text-center flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Dato
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    required
                    className="input-field pl-1 h-8 w-full bg-gray-100 rounded-md"
                    value={eventData.date}
                    onChange={(e) => setEventData({...eventData, date: e.target.value})}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="text-center flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Tidspunkt
                </label>
                <div className="mt-1">
                  <input
                    type="time"
                    required
                    className="input-field pl-1 h-8 w-full bg-gray-100 rounded-md"
                    value={eventData.time}
                    onChange={(e) => setEventData({...eventData, time: e.target.value})}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            
            <div className="text-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Lokation
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  className="input-field pl-1 h-8 w-full bg-gray-100 rounded-md"
                  placeholder="Event lokation"
                  value={eventData.location}
                  onChange={(e) => setEventData({...eventData, location: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="text-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Beskrivelse
              </label>
              <div className="mt-1">
                <textarea
                  required
                  rows="4"
                  className="input-field pl-1 w-full bg-gray-100 rounded-md resize-none"
                  placeholder="Event beskrivelse..."
                  value={eventData.description}
                  onChange={(e) => setEventData({...eventData, description: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="text-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Event billede
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-auto object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null)
                          setImagePreview(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <span className="sr-only">Fjern billede</span>
                        ×
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer"
                    >
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-green-500 hover:text-green-400"
                        >
                          <span>Upload et billede</span>
                          <input
                            ref={fileInputRef}
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={loading}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG op til 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="btn-primary bg-green-500 hover:bg-green-700 hover:text-white rounded-lg w-52 flex justify-center py-3"
              disabled={loading}
            >
              {loading ? 'Opretter...' : 'Opret Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEvent 