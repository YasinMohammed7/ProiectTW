import { useShallow } from "zustand/react/shallow";
import { useDirectionsStore } from "../store/directionsStore";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export const DirectionsScreen = () => {
  const {
    directions,
    isLoading,
    error,
    getDirections,
    createDirection,
    updateDirection,
    deleteDirection,
  } = useDirectionsStore(
    useShallow((state) => ({
      directions: state.directions,
      isLoading: state.isLoading,
      error: state.error,
      getDirections: state.getDirections,
      createDirection: state.createDirection,
      updateDirection: state.updateDirection,
      deleteDirection: state.deleteDirection,
    }))
  );

  const [startLocationName, setStartLocationName] = useState("");
  const [endLocationName, setEndLocationName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");

  useEffect(() => {
    getDirections();
  }, []);

  const handleCreate = async () => {
    if (!startLocationName.trim() || !endLocationName.trim()) return;
    await createDirection(startLocationName, endLocationName);
    setStartLocationName("");
    setEndLocationName("");
  };

  const handleEdit = (direction: any) => {
    setEditingId(direction._id);
    setEditStart(direction.startLocationName);
    setEditEnd(direction.endLocationName);
  };

  const handleUpdate = async () => {
    if (!editingId || !editStart.trim() || !editEnd.trim()) return;
    await updateDirection(editingId, editStart, editEnd);
    setEditingId(null);
    setEditStart("");
    setEditEnd("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditStart("");
    setEditEnd("");
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins}min`;
    }
    return `${mins} min`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Rutele Mele</h1>
        <p className="text-gray-500 mt-2">Gestionează rutele tale de cycling</p>
      </div>

      {/* Create Form */}
      <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-6 shadow-xl">
        <h2 className="text-white text-xl font-semibold mb-5">
          Adaugă Rută Nouă
        </h2>
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="flex-1">
            <label className="block text-white/90 text-sm font-medium mb-2">
              Locație Start
            </label>
            <input
              type="text"
              value={startLocationName}
              onChange={(e) => setStartLocationName(e.target.value)}
              placeholder="Ex: Piața Unirii, București"
              className="w-full px-4 py-3 rounded-lg bg-white/95 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <div className="flex-1">
            <label className="block text-white/90 text-sm font-medium mb-2">
              Locație Destinație
            </label>
            <input
              type="text"
              value={endLocationName}
              onChange={(e) => setEndLocationName(e.target.value)}
              placeholder="Ex: Parcul Herăstrău, București"
              className="w-full px-4 py-3 rounded-lg bg-white/95 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
        <button
          onClick={handleCreate}
          disabled={
            isLoading || !startLocationName.trim() || !endLocationName.trim()
          }
          className="w-full py-3 px-6 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Se încarcă..." : "Adaugă Rută"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Directions List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Rutele Tale ({directions?.length || 0})
        </h2>

        {isLoading && !directions ? (
          <div className="text-center py-10 text-gray-500">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-3"></div>
            <p>Se încarcă rutele...</p>
          </div>
        ) : directions?.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl">
            <p className="text-gray-600">Nu ai nicio rută salvată.</p>
            <p className="text-gray-400 text-sm mt-2">
              Adaugă prima ta rută folosind formularul de mai sus!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {directions?.map((direction: any) => (
              <div
                key={direction._id}
                className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                {editingId === direction._id ? (
                  // Edit Mode
                  <div>
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
                      <input
                        type="text"
                        value={editStart}
                        onChange={(e) => setEditStart(e.target.value)}
                        className="flex-1 w-full px-4 py-3 border-2 border-indigo-500 rounded-lg outline-none focus:border-indigo-600"
                        placeholder="Locație start"
                      />
                      <span className="text-indigo-500 text-xl hidden md:block">
                        <ArrowRightIcon className="w-6 h-6" />
                      </span>
                      <input
                        type="text"
                        value={editEnd}
                        onChange={(e) => setEditEnd(e.target.value)}
                        className="flex-1 w-full px-4 py-3 border-2 border-indigo-500 rounded-lg outline-none focus:border-indigo-600"
                        placeholder="Locație destinație"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleUpdate}
                        disabled={isLoading}
                        className="px-5 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        Salvează
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Anulează
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                        <span className="font-semibold text-gray-800">
                          {direction.startLocationName}
                        </span>
                        <span className="text-indigo-500 text-lg">{"->"}</span>
                        <span className="font-semibold text-gray-800">
                          {direction.endLocationName}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                          {formatDistance(direction.distance)}
                        </span>
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                          {formatDuration(direction.duration)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(direction)}
                        className="px-4 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        Editează
                      </button>
                      <button
                        onClick={() => deleteDirection(direction._id)}
                        className="px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Șterge
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
