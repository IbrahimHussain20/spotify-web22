package com.example.spotify.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.spotify.data.Catalog
import com.example.spotify.data.SpotifyRepository
import com.example.spotify.data.YouTubeSearchService
import com.example.spotify.data.model.Playlist
import com.example.spotify.data.model.RepeatMode
import com.example.spotify.data.model.Track
import com.example.spotify.player.AudioPlayerManager
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class Screen {
    data object Home : Screen()
    data object Search : Screen()
    data object Library : Screen()
    data class PlaylistDetail(val playlistId: String) : Screen()
    data object LikedDetail : Screen()
}

class SpotifyViewModel(
    val repository: SpotifyRepository,
    val playerManager: AudioPlayerManager
) : ViewModel() {

    private val searchService = YouTubeSearchService(repository)

    // Playback state
    val currentTrack: StateFlow<Track?> = playerManager.currentTrack
    val isPlaying: StateFlow<Boolean> = playerManager.isPlaying
    val isLoading: StateFlow<Boolean> = playerManager.isLoading
    val currentTimeSeconds: StateFlow<Float> = playerManager.currentTimeSeconds
    val durationSeconds: StateFlow<Float> = playerManager.durationSeconds
    val queue: StateFlow<List<Track>> = playerManager.queue
    val queueIndex: StateFlow<Int> = playerManager.queueIndex
    val isShuffle: StateFlow<Boolean> = playerManager.isShuffle
    val repeatMode: StateFlow<RepeatMode> = playerManager.repeatMode
    val volume: StateFlow<Float> = playerManager.volume
    val isMuted: StateFlow<Boolean> = playerManager.isMuted

    // Repository state
    val likedTracks: StateFlow<List<Track>> = repository.likedTracks
    val playlists: StateFlow<List<Playlist>> = repository.playlists
    val apiKey: StateFlow<String> = repository.apiKey

    // Search state
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _searchResults = MutableStateFlow<List<Track>>(emptyList())
    val searchResults: StateFlow<List<Track>> = _searchResults.asStateFlow()

    private val _isSearching = MutableStateFlow(false)
    val isSearching: StateFlow<Boolean> = _isSearching.asStateFlow()

    // Navigation and Modals
    private val _currentScreen = MutableStateFlow<Screen>(Screen.Home)
    val currentScreen: StateFlow<Screen> = _currentScreen.asStateFlow()

    private val _isFullScreenPlayerOpen = MutableStateFlow(false)
    val isFullScreenPlayerOpen: StateFlow<Boolean> = _isFullScreenPlayerOpen.asStateFlow()

    private val _isQueueOpen = MutableStateFlow(false)
    val isQueueOpen: StateFlow<Boolean> = _isQueueOpen.asStateFlow()

    private val _trackForMenu = MutableStateFlow<Track?>(null)
    val trackForMenu: StateFlow<Track?> = _trackForMenu.asStateFlow()

    private val _trackForPlaylistAdd = MutableStateFlow<Track?>(null)
    val trackForPlaylistAdd: StateFlow<Track?> = _trackForPlaylistAdd.asStateFlow()

    private val _isCreatePlaylistDialogOpen = MutableStateFlow(false)
    val isCreatePlaylistDialogOpen: StateFlow<Boolean> = _isCreatePlaylistDialogOpen.asStateFlow()

    private val _isSettingsDialogOpen = MutableStateFlow(false)
    val isSettingsDialogOpen: StateFlow<Boolean> = _isSettingsDialogOpen.asStateFlow()

    private var searchJob: Job? = null

    fun navigateTo(screen: Screen) {
        _currentScreen.value = screen
    }

    fun playTrack(track: Track, contextList: List<Track> = listOf(track)) {
        playerManager.playTrack(track, contextList)
    }

    fun togglePlayPause() {
        playerManager.togglePlayPause()
    }

    fun nextTrack() {
        playerManager.nextTrack()
    }

    fun previousTrack() {
        playerManager.previousTrack()
    }

    fun seekTo(seconds: Float) {
        playerManager.seekTo(seconds)
    }

    fun toggleShuffle() {
        playerManager.toggleShuffle()
    }

    fun toggleRepeat() {
        playerManager.toggleRepeat()
    }

    fun setVolume(vol: Float) {
        playerManager.setVolume(vol)
    }

    fun toggleMute() {
        playerManager.toggleMute()
    }

    fun addToQueue(track: Track) {
        playerManager.addToQueue(track)
    }

    fun playFromQueue(index: Int) {
        playerManager.playFromQueue(index)
    }

    fun isLiked(trackId: String): Boolean {
        return repository.isLiked(trackId)
    }

    fun toggleLike(track: Track) {
        repository.toggleLike(track)
    }

    fun createPlaylist(name: String): Playlist {
        return repository.createPlaylist(name)
    }

    fun deletePlaylist(playlistId: String) {
        repository.deletePlaylist(playlistId)
        if (_currentScreen.value is Screen.PlaylistDetail &&
            (_currentScreen.value as Screen.PlaylistDetail).playlistId == playlistId) {
            _currentScreen.value = Screen.Library
        }
    }

    fun addTrackToPlaylist(playlistId: String, track: Track) {
        repository.addTrackToPlaylist(playlistId, track)
    }

    fun removeTrackFromPlaylist(playlistId: String, trackId: String) {
        repository.removeTrackFromPlaylist(playlistId, trackId)
    }

    fun setApiKey(key: String) {
        repository.setApiKey(key)
        // Refresh search if on search screen
        if (_searchQuery.value.isNotEmpty()) {
            onSearchQueryChange(_searchQuery.value)
        }
    }

    fun onSearchQueryChange(query: String) {
        _searchQuery.value = query
        searchJob?.cancel()

        if (query.isBlank()) {
            _searchResults.value = emptyList()
            _isSearching.value = false
            return
        }

        searchJob = viewModelScope.launch {
            _isSearching.value = true
            delay(350)
            val results = searchService.search(query)
            _searchResults.value = results
            _isSearching.value = false
        }
    }

    fun openFullScreenPlayer() {
        _isFullScreenPlayerOpen.value = true
    }

    fun closeFullScreenPlayer() {
        _isFullScreenPlayerOpen.value = false
    }

    fun openQueue() {
        _isQueueOpen.value = true
    }

    fun closeQueue() {
        _isQueueOpen.value = false
    }

    fun openTrackMenu(track: Track) {
        _trackForMenu.value = track
    }

    fun closeTrackMenu() {
        _trackForMenu.value = null
    }

    fun openAddToPlaylist(track: Track) {
        _trackForPlaylistAdd.value = track
    }

    fun closeAddToPlaylist() {
        _trackForPlaylistAdd.value = null
    }

    fun openCreatePlaylistDialog() {
        _isCreatePlaylistDialogOpen.value = true
    }

    fun closeCreatePlaylistDialog() {
        _isCreatePlaylistDialogOpen.value = false
    }

    fun openSettingsDialog() {
        _isSettingsDialogOpen.value = true
    }

    fun closeSettingsDialog() {
        _isSettingsDialogOpen.value = false
    }
}
