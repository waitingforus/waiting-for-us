import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { placeConverter, type Place, type UserProfile } from '../lib/types';
import { MapPin, Heart, X, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';

// Un bonito icono de corazón usando DivIcon de Leaflet
const heartIcon = new L.DivIcon({
  className: 'custom-heart-marker bg-transparent border-none',
  html: `<div style="font-size: 28px; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3)); line-height: 32px; text-align: center;">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32], // La punta del corazón apunta al lugar
  popupAnchor: [0, -32],
});

const draftIcon = new L.DivIcon({
  className: 'custom-draft-marker bg-transparent border-none',
  html: `<div style="font-size: 28px; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3)); line-height: 32px; text-align: center; opacity: 0.7;">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Componente para manejar clics en el mapa
function MapEvents({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e);
    },
  });
  return null;
}

export function MapScreen({ username, allUsers = {} }: { username: string, allUsers?: Record<string, UserProfile> }) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [draftLocation, setDraftLocation] = useState<L.LatLng | null>(null);
  
  // Formulario del nuevo lugar
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'places').withConverter(placeConverter));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const placesData = snapshot.docs.map(doc => doc.data());
      setPlaces(placesData);
    });
    return () => unsubscribe();
  }, []);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    // Si ya estamos guardando, ignorar clics
    if (isSaving) return;
    setDraftLocation(e.latlng);
    setTitle('');
    setDescription('');
  };

  const cancelDraft = () => {
    setDraftLocation(null);
    setTitle('');
    setDescription('');
  };

  const handleSavePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftLocation || !title.trim()) return;

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'places'), {
        title: title.trim(),
        description: description.trim(),
        lat: draftLocation.lat,
        lng: draftLocation.lng,
        createdBy: username,
        createdAt: serverTimestamp(),
      });
      setDraftLocation(null);
    } catch (error) {
      console.error("Error guardando el lugar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePlace = async (placeId: string) => {
    if (window.confirm("¿Seguro que quieres borrar este recuerdo?")) {
      try {
        await deleteDoc(doc(db, 'places', placeId));
      } catch (error) {
        console.error("Error borrando el lugar:", error);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pb-32 sm:pb-12 animate-fade-in mt-32">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-slate-800 drop-shadow-sm flex items-center justify-center gap-3">
          <MapPin className="w-10 h-10 text-brand-500" />
          Nuestros Lugares
        </h2>
        <p className="text-slate-600 mt-2 text-lg">Haz clic en cualquier parte del mapa para guardar un nuevo recuerdo.</p>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-xl border border-brand-100 overflow-hidden relative" style={{ height: '70vh', minHeight: '500px' }}>
        <MapContainer 
          center={[-12.0464, -77.0428]} // Lima, Perú por defecto
          zoom={6} 
          zoomControl={false}
          attributionControl={false}
          style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 10 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onMapClick={handleMapClick} />

          {/* Renderizar los lugares guardados */}
          {places.map((place) => {
            const creatorProfile = allUsers[place.createdBy];
            const displayName = creatorProfile?.firstName 
              ? creatorProfile.firstName.charAt(0).toUpperCase() + creatorProfile.firstName.slice(1)
              : place.createdBy;

            return (
              <Marker 
                key={place.id} 
                position={[place.lat, place.lng]} 
                icon={heartIcon}
              >
                <Popup className="custom-popup" closeButton={false}>
                  <div className="p-1 min-w-[200px]">
                    <h3 className="font-bold text-lg text-brand-700 mb-1 leading-tight">{place.title}</h3>
                    {place.description && (
                      <p className="text-sm text-slate-600 mb-3 leading-relaxed">{place.description}</p>
                    )}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        Por {displayName}
                      </span>
                    <button 
                      onClick={() => handleDeletePlace(place.id!)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                      title="Borrar recuerdo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )})}

          {/* Renderizar el marcador temporal que se está creando */}
          {draftLocation && (
            <Marker position={draftLocation} icon={draftIcon} />
          )}
        </MapContainer>

        {/* Modal/Formulario flotante cuando se hace clic en el mapa */}
        {draftLocation && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm animate-bounce-in">
            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border-2 border-brand-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-brand-700 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-current" /> Nuevo Recuerdo
                </h3>
                <button onClick={cancelDraft} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSavePlace} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Título especial</label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Donde nos conocimos"
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-brand-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">¿Qué pasó aquí? <span className="text-slate-400 font-normal">(Opcional)</span></label>
                  <textarea
                    maxLength={150}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Una tarde hermosa comiendo helado..."
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-brand-500 resize-none shadow-sm"
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" disabled={isSaving || !title.trim()} className="w-full rounded-xl shadow-md shadow-brand-500/20">
                    {isSaving ? 'Guardando...' : 'Guardar en el mapa'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
