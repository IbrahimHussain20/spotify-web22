package com.example.spotify.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Shuffle
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.spotify.data.model.Playlist
import com.example.spotify.data.model.Track
import com.example.spotify.ui.components.TrackRow
import com.example.spotify.ui.theme.DarkBackground
import com.example.spotify.ui.theme.DarkHighlight
import com.example.spotify.ui.theme.LikedGradientEnd
import com.example.spotify.ui.theme.LikedGradientStart
import com.example.spotify.ui.theme.SpotifyGreen
import com.example.spotify.ui.theme.SpotifyGreenBright
import com.example.spotify.ui.theme.TextMuted
import com.example.spotify.ui.theme.TextPrimary
import com.example.spotify.ui.theme.TextSecondary

@Composable
fun PlaylistDetailScreen(
    title: String,
    tracks: List<Track>,
    isLikedPlaylist: Boolean = false,
    currentTrack: Track?,
    isPlaying: Boolean,
    onBack: () -> Unit,
    onPlayTrack: (Track, List<Track>) -> Unit,
    onPlayAll: () -> Unit,
    onShuffleAll: () -> Unit,
    onTrackMore: (Track) -> Unit,
    onDeletePlaylist: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(DarkBackground)
            .testTag("playlist_detail_screen"),
        contentPadding = PaddingValues(bottom = 90.dp)
    ) {
        // Back Navigation Bar
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack, modifier = Modifier.testTag("playlist_back_btn")) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = TextPrimary
                    )
                }

                if (onDeletePlaylist != null && !isLikedPlaylist) {
                    IconButton(onClick = onDeletePlaylist, modifier = Modifier.testTag("playlist_delete_btn")) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete Playlist",
                            tint = TextSecondary
                        )
                    }
                }
            }
        }

        // Playlist Hero Header
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 8.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .size(160.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(
                            if (isLikedPlaylist) {
                                Brush.linearGradient(listOf(LikedGradientStart, LikedGradientEnd))
                            } else {
                                Brush.linearGradient(listOf(Color(0xFF282828), Color(0xFF181818)))
                            }
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    if (isLikedPlaylist) {
                        Icon(
                            imageVector = Icons.Default.Favorite,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(68.dp)
                        )
                    } else {
                        Text(
                            text = title.firstOrNull()?.uppercase() ?: "P",
                            color = TextSecondary,
                            fontSize = 68.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                Text(
                    text = title,
                    color = TextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = "${tracks.size} songs",
                    color = TextSecondary,
                    fontSize = 13.sp
                )
            }
        }

        // Action Buttons Row: Shuffle toggle + Circular Play FAB
        if (tracks.isNotEmpty()) {
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = onShuffleAll,
                        modifier = Modifier.testTag("playlist_shuffle_btn")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Shuffle,
                            contentDescription = "Shuffle",
                            tint = SpotifyGreenBright,
                            modifier = Modifier.size(28.dp)
                        )
                    }

                    FloatingActionButton(
                        onClick = onPlayAll,
                        shape = CircleShape,
                        containerColor = SpotifyGreen,
                        contentColor = Color.Black,
                        modifier = Modifier
                            .size(54.dp)
                            .testTag("playlist_play_fab")
                    ) {
                        val isThisPlaylistPlaying = isPlaying && tracks.any { it.id == currentTrack?.id }
                        Icon(
                            imageVector = if (isThisPlaylistPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                            contentDescription = "Play",
                            modifier = Modifier.size(32.dp)
                        )
                    }
                }
            }
        }

        // Track List
        if (tracks.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 40.dp, bottom = 40.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = if (isLikedPlaylist) "Songs you like will appear here." else "No songs in this playlist yet.",
                            color = TextPrimary,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Find songs from Search and add them.",
                            color = TextSecondary,
                            fontSize = 12.sp
                        )
                    }
                }
            }
        } else {
            itemsIndexed(tracks) { index, track ->
                TrackRow(
                    track = track,
                    index = index,
                    isCurrentPlaying = currentTrack?.id == track.id,
                    onClick = { onPlayTrack(track, tracks) },
                    onMoreClick = { onTrackMore(track) }
                )
            }
        }
    }
}
