package com.example.spotify.data

import android.content.Context
import android.content.SharedPreferences
import com.example.spotify.data.model.Playlist
import com.example.spotify.data.model.Track
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.util.UUID

class SpotifyRepository(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences("spotify_prefs", Context.MODE_PRIVATE)
    private val json = Json { ignoreUnknownKeys = true; isLenient = true }

    private val _likedTracks = MutableStateFlow<List<Track>>(emptyList())
    val likedTracks: StateFlow<List<Track>> = _likedTracks.asStateFlow()

    private val _playlists = MutableStateFlow<List<Playlist>>(emptyList())
    val playlists: StateFlow<List<Playlist>> = _playlists.asStateFlow()

    private val _apiKey = MutableStateFlow<String>("")
    val apiKey: StateFlow<String> = _apiKey.asStateFlow()

    init {
        loadData()
    }

    private fun loadData() {
        val likedJson = prefs.getString("liked_tracks", null)
        if (!likedJson.isNullOrEmpty()) {
            try {
                _likedTracks.value = json.decodeFromString(likedJson)
            } catch (e: Exception) {
                _likedTracks.value = emptyList()
            }
        }

        val playlistsJson = prefs.getString("user_playlists", null)
        if (!playlistsJson.isNullOrEmpty()) {
            try {
                _playlists.value = json.decodeFromString(playlistsJson)
            } catch (e: Exception) {
                _playlists.value = emptyList()
            }
        } else {
            // Seed a starter playlist if empty
            val starter = Playlist(
                id = "my-favorites",
                name = "Today's Favorites",
                tracks = Catalog.ALL_TRACKS.take(5)
            )
            _playlists.value = listOf(starter)
            savePlaylists(_playlists.value)
        }

        _apiKey.value = prefs.getString("yt_api_key", "") ?: ""
    }

    fun isLiked(trackId: String): Boolean {
        return _likedTracks.value.any { it.id == trackId }
    }

    fun toggleLike(track: Track): Boolean {
        val current = _likedTracks.value.toMutableList()
        val index = current.indexOfFirst { it.id == track.id }
        val nowLiked: Boolean
        if (index >= 0) {
            current.removeAt(index)
            nowLiked = false
        } else {
            current.add(0, track)
            nowLiked = true
        }
        _likedTracks.value = current
        saveLiked(current)
        return nowLiked
    }

    fun createPlaylist(name: String): Playlist {
        val trimmed = name.trim()
        val existing = _playlists.value.find { it.name.equals(trimmed, ignoreCase = true) }
        if (existing != null) return existing

        val newPlaylist = Playlist(
            id = UUID.randomUUID().toString(),
            name = trimmed,
            tracks = emptyList()
        )
        val updated = _playlists.value + newPlaylist
        _playlists.value = updated
        savePlaylists(updated)
        return newPlaylist
    }

    fun deletePlaylist(playlistId: String) {
        val updated = _playlists.value.filterNot { it.id == playlistId }
        _playlists.value = updated
        savePlaylists(updated)
    }

    fun addTrackToPlaylist(playlistId: String, track: Track) {
        val updated = _playlists.value.map { playlist ->
            if (playlist.id == playlistId) {
                if (playlist.tracks.none { it.id == track.id }) {
                    playlist.copy(tracks = playlist.tracks + track)
                } else playlist
            } else playlist
        }
        _playlists.value = updated
        savePlaylists(updated)
    }

    fun removeTrackFromPlaylist(playlistId: String, trackId: String) {
        val updated = _playlists.value.map { playlist ->
            if (playlist.id == playlistId) {
                playlist.copy(tracks = playlist.tracks.filterNot { it.id == trackId })
            } else playlist
        }
        _playlists.value = updated
        savePlaylists(updated)
    }

    fun setApiKey(key: String) {
        val trimmed = key.trim()
        _apiKey.value = trimmed
        prefs.edit().putString("yt_api_key", trimmed).apply()
    }

    private fun saveLiked(list: List<Track>) {
        try {
            prefs.edit().putString("liked_tracks", json.encodeToString(list)).apply()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun savePlaylists(list: List<Playlist>) {
        try {
            prefs.edit().putString("user_playlists", json.encodeToString(list)).apply()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
