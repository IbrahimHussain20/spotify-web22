package com.example.spotify.ui

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LibraryMusic
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.LibraryMusic
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.spotify.ui.components.AddToPlaylistDialog
import com.example.spotify.ui.components.CreatePlaylistDialog
import com.example.spotify.ui.components.FullScreenPlayer
import com.example.spotify.ui.components.MiniPlayer
import com.example.spotify.ui.components.QueueSheet
import com.example.spotify.ui.components.SettingsDialog
import com.example.spotify.ui.components.TrackMenuSheet
import com.example.spotify.ui.screens.HomeScreen
import com.example.spotify.ui.screens.LibraryScreen
import com.example.spotify.ui.screens.PlaylistDetailScreen
import com.example.spotify.ui.screens.SearchScreen
import com.example.spotify.ui.theme.DarkBackground
import com.example.spotify.ui.theme.DarkSurfaceElevated
import com.example.spotify.ui.theme.SpotifyGreen
import com.example.spotify.ui.theme.TextMuted
import com.example.spotify.ui.theme.TextPrimary
import com.example.spotify.ui.theme.TextSecondary

@Composable
fun MainScreen(viewModel: SpotifyViewModel) {
    val currentScreen by viewModel.currentScreen.collectAsState()
    val currentTrack by viewModel.currentTrack.collectAsState()
    val isPlaying by viewModel.isPlaying.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val currentTime by viewModel.currentTimeSeconds.collectAsState()
    val duration by viewModel.durationSeconds.collectAsState()
    val isShuffle by viewModel.isShuffle.collectAsState()
    val repeatMode by viewModel.repeatMode.collectAsState()
    val volume by viewModel.volume.collectAsState()
    val isMuted by viewModel.isMuted.collectAsState()

    val likedTracks by viewModel.likedTracks.collectAsState()
    val playlists by viewModel.playlists.collectAsState()
    val apiKey by viewModel.apiKey.collectAsState()

    val searchQuery by viewModel.searchQuery.collectAsState()
    val searchResults by viewModel.searchResults.collectAsState()
    val isSearching by viewModel.isSearching.collectAsState()

    val isFullScreenPlayerOpen by viewModel.isFullScreenPlayerOpen.collectAsState()
    val isQueueOpen by viewModel.isQueueOpen.collectAsState()
    val trackForMenu by viewModel.trackForMenu.collectAsState()
    val trackForPlaylistAdd by viewModel.trackForPlaylistAdd.collectAsState()
    val isCreatePlaylistOpen by viewModel.isCreatePlaylistDialogOpen.collectAsState()
    val isSettingsOpen by viewModel.isSettingsDialogOpen.collectAsState()

    // Handle back button for sub-screens
    BackHandler(enabled = currentScreen !is Screen.Home) {
        when (currentScreen) {
            is Screen.PlaylistDetail, Screen.LikedDetail -> viewModel.navigateTo(Screen.Library)
            is Screen.Search, Screen.Library -> viewModel.navigateTo(Screen.Home)
            Screen.Home -> {}
        }
    }

    Scaffold(
        containerColor = DarkBackground,
        bottomBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.Transparent)
            ) {
                // Mini Player (docked above bottom nav)
                if (currentTrack != null) {
                    val progress = if (duration > 0) currentTime / duration else 0f
                    val isLiked = viewModel.isLiked(currentTrack!!.id)

                    MiniPlayer(
                        track = currentTrack,
                        isPlaying = isPlaying,
                        isLoading = isLoading,
                        progress = progress,
                        isLiked = isLiked,
                        onExpand = { viewModel.openFullScreenPlayer() },
                        onPlayPause = { viewModel.togglePlayPause() },
                        onNext = { viewModel.nextTrack() },
                        onLikeToggle = { currentTrack?.let { viewModel.toggleLike(it) } }
                    )
                }

                // Bottom Navigation Bar
                NavigationBar(
                    containerColor = DarkSurfaceElevated,
                    contentColor = TextPrimary,
                    tonalElevation = 0.dp
                ) {
                    val isHome = currentScreen is Screen.Home
                    val isSearch = currentScreen is Screen.Search
                    val isLibrary = currentScreen is Screen.Library ||
                            currentScreen is Screen.PlaylistDetail ||
                            currentScreen is Screen.LikedDetail

                    NavigationBarItem(
                        selected = isHome,
                        onClick = { viewModel.navigateTo(Screen.Home) },
                        icon = {
                            Icon(
                                imageVector = if (isHome) Icons.Filled.Home else Icons.Outlined.Home,
                                contentDescription = "Home",
                                modifier = Modifier.size(24.dp)
                            )
                        },
                        label = { Text("Home", fontSize = 11.sp) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = TextPrimary,
                            selectedTextColor = TextPrimary,
                            unselectedIconColor = TextMuted,
                            unselectedTextColor = TextMuted,
                            indicatorColor = Color.Transparent
                        ),
                        modifier = Modifier.testTag("nav_home")
                    )

                    NavigationBarItem(
                        selected = isSearch,
                        onClick = { viewModel.navigateTo(Screen.Search) },
                        icon = {
                            Icon(
                                imageVector = if (isSearch) Icons.Filled.Search else Icons.Outlined.Search,
                                contentDescription = "Search",
                                modifier = Modifier.size(24.dp)
                            )
                        },
                        label = { Text("Search", fontSize = 11.sp) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = TextPrimary,
                            selectedTextColor = TextPrimary,
                            unselectedIconColor = TextMuted,
                            unselectedTextColor = TextMuted,
                            indicatorColor = Color.Transparent
                        ),
                        modifier = Modifier.testTag("nav_search")
                    )

                    NavigationBarItem(
                        selected = isLibrary,
                        onClick = { viewModel.navigateTo(Screen.Library) },
                        icon = {
                            Icon(
                                imageVector = if (isLibrary) Icons.Filled.LibraryMusic else Icons.Outlined.LibraryMusic,
                                contentDescription = "Your Library",
                                modifier = Modifier.size(24.dp)
                            )
                        },
                        label = { Text("Your Library", fontSize = 11.sp) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = TextPrimary,
                            selectedTextColor = TextPrimary,
                            unselectedIconColor = TextMuted,
                            unselectedTextColor = TextMuted,
                            indicatorColor = Color.Transparent
                        ),
                        modifier = Modifier.testTag("nav_library")
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (val screen = currentScreen) {
                is Screen.Home -> {
                    HomeScreen(
                        currentTrack = currentTrack,
                        isPlaying = isPlaying,
                        onTrackPlay = { track, contextList ->
                            viewModel.playTrack(track, contextList)
                        },
                        onNavigateToSearch = { viewModel.navigateTo(Screen.Search) },
                        onOpenSettings = { viewModel.openSettingsDialog() }
                    )
                }

                is Screen.Search -> {
                    SearchScreen(
                        searchQuery = searchQuery,
                        searchResults = searchResults,
                        isSearching = isSearching,
                        currentTrack = currentTrack,
                        onQueryChange = { viewModel.onSearchQueryChange(it) },
                        onTrackPlay = { track, contextList ->
                            viewModel.playTrack(track, contextList)
                        },
                        onTrackMore = { viewModel.openTrackMenu(it) }
                    )
                }

                is Screen.Library -> {
                    LibraryScreen(
                        likedTracks = likedTracks,
                        playlists = playlists,
                        onOpenLikedSongs = { viewModel.navigateTo(Screen.LikedDetail) },
                        onOpenPlaylist = { id -> viewModel.navigateTo(Screen.PlaylistDetail(id)) },
                        onCreatePlaylist = { viewModel.openCreatePlaylistDialog() },
                        onDeletePlaylist = { id -> viewModel.deletePlaylist(id) }
                    )
                }

                is Screen.LikedDetail -> {
                    PlaylistDetailScreen(
                        title = "Liked Songs",
                        tracks = likedTracks,
                        isLikedPlaylist = true,
                        currentTrack = currentTrack,
                        isPlaying = isPlaying,
                        onBack = { viewModel.navigateTo(Screen.Library) },
                        onPlayTrack = { track, contextList -> viewModel.playTrack(track, contextList) },
                        onPlayAll = {
                            if (likedTracks.isNotEmpty()) {
                                viewModel.playTrack(likedTracks.first(), likedTracks)
                            }
                        },
                        onShuffleAll = {
                            if (likedTracks.isNotEmpty()) {
                                val shuffled = likedTracks.shuffled()
                                viewModel.playTrack(shuffled.first(), shuffled)
                            }
                        },
                        onTrackMore = { viewModel.openTrackMenu(it) }
                    )
                }

                is Screen.PlaylistDetail -> {
                    val pl = playlists.find { it.id == screen.playlistId }
                    if (pl != null) {
                        PlaylistDetailScreen(
                            title = pl.name,
                            tracks = pl.tracks,
                            isLikedPlaylist = false,
                            currentTrack = currentTrack,
                            isPlaying = isPlaying,
                            onBack = { viewModel.navigateTo(Screen.Library) },
                            onPlayTrack = { track, contextList -> viewModel.playTrack(track, contextList) },
                            onPlayAll = {
                                if (pl.tracks.isNotEmpty()) {
                                    viewModel.playTrack(pl.tracks.first(), pl.tracks)
                                }
                            },
                            onShuffleAll = {
                                if (pl.tracks.isNotEmpty()) {
                                    val shuffled = pl.tracks.shuffled()
                                    viewModel.playTrack(shuffled.first(), shuffled)
                                }
                            },
                            onTrackMore = { viewModel.openTrackMenu(it) },
                            onDeletePlaylist = { viewModel.deletePlaylist(pl.id) }
                        )
                    } else {
                        viewModel.navigateTo(Screen.Library)
                    }
                }
            }
        }
    }

    // Full Screen Player overlay
    AnimatedVisibility(
        visible = isFullScreenPlayerOpen,
        enter = slideInVertically(initialOffsetY = { it }),
        exit = slideOutVertically(targetOffsetY = { it })
    ) {
        val isLiked = currentTrack?.let { viewModel.isLiked(it.id) } ?: false

        FullScreenPlayer(
            track = currentTrack,
            isPlaying = isPlaying,
            isLoading = isLoading,
            currentTimeSeconds = currentTime,
            durationSeconds = duration,
            isShuffle = isShuffle,
            repeatMode = repeatMode,
            volume = volume,
            isMuted = isMuted,
            isLiked = isLiked,
            onDismiss = { viewModel.closeFullScreenPlayer() },
            onPlayPause = { viewModel.togglePlayPause() },
            onNext = { viewModel.nextTrack() },
            onPrevious = { viewModel.previousTrack() },
            onSeek = { viewModel.seekTo(it) },
            onToggleShuffle = { viewModel.toggleShuffle() },
            onToggleRepeat = { viewModel.toggleRepeat() },
            onVolumeChange = { viewModel.setVolume(it) },
            onToggleMute = { viewModel.toggleMute() },
            onToggleLike = { currentTrack?.let { viewModel.toggleLike(it) } },
            onOpenQueue = { viewModel.openQueue() },
            onOpenMenu = { currentTrack?.let { viewModel.openTrackMenu(it) } }
        )
    }

    // Queue Sheet
    if (isQueueOpen) {
        val queue by viewModel.queue.collectAsState()
        val queueIndex by viewModel.queueIndex.collectAsState()

        QueueSheet(
            queue = queue,
            queueIndex = queueIndex,
            currentTrack = currentTrack,
            onTrackSelect = { viewModel.playFromQueue(it) },
            onDismiss = { viewModel.closeQueue() }
        )
    }

    // Track Context Menu Sheet
    if (trackForMenu != null) {
        val track = trackForMenu!!
        val isLiked = viewModel.isLiked(track.id)

        TrackMenuSheet(
            track = track,
            isLiked = isLiked,
            onPlayNow = { viewModel.playTrack(track) },
            onAddToQueue = { viewModel.addToQueue(track) },
            onAddToPlaylist = { viewModel.openAddToPlaylist(track) },
            onToggleLike = { viewModel.toggleLike(track) },
            onDismiss = { viewModel.closeTrackMenu() }
        )
    }

    // Add to Playlist Dialog
    if (trackForPlaylistAdd != null) {
        AddToPlaylistDialog(
            track = trackForPlaylistAdd,
            playlists = playlists,
            onDismiss = { viewModel.closeAddToPlaylist() },
            onPlaylistSelected = { playlistId ->
                trackForPlaylistAdd?.let { viewModel.addTrackToPlaylist(playlistId, it) }
            },
            onCreateNewClicked = {
                viewModel.openCreatePlaylistDialog()
            }
        )
    }

    // Create Playlist Dialog
    if (isCreatePlaylistOpen) {
        CreatePlaylistDialog(
            onDismiss = { viewModel.closeCreatePlaylistDialog() },
            onCreate = { name ->
                val newPl = viewModel.createPlaylist(name)
                // If we were trying to add a track, add it now
                trackForPlaylistAdd?.let {
                    viewModel.addTrackToPlaylist(newPl.id, it)
                    viewModel.closeAddToPlaylist()
                }
                viewModel.closeCreatePlaylistDialog()
            }
        )
    }

    // Settings Dialog
    if (isSettingsOpen) {
        SettingsDialog(
            currentApiKey = apiKey,
            onSaveApiKey = { viewModel.setApiKey(it) },
            onDismiss = { viewModel.closeSettingsDialog() }
        )
    }
}
