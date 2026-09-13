package com.example.spotify.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.spotify.data.model.Playlist
import com.example.spotify.data.model.Track
import com.example.spotify.ui.theme.DarkBackground
import com.example.spotify.ui.theme.DarkHighlight
import com.example.spotify.ui.theme.DarkSurfaceElevated
import com.example.spotify.ui.theme.LikedGradientEnd
import com.example.spotify.ui.theme.LikedGradientStart
import com.example.spotify.ui.theme.SpotifyGreen
import com.example.spotify.ui.theme.TextMuted
import com.example.spotify.ui.theme.TextPrimary
import com.example.spotify.ui.theme.TextSecondary

@Composable
fun LibraryScreen(
    likedTracks: List<Track>,
    playlists: List<Playlist>,
    onOpenLikedSongs: () -> Unit,
    onOpenPlaylist: (String) -> Unit,
    onCreatePlaylist: () -> Unit,
    onDeletePlaylist: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedFilter by remember { mutableStateOf<String?>("Playlists") }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(top = 16.dp)
            .testTag("library_screen"),
        contentPadding = PaddingValues(bottom = 90.dp)
    ) {
        // Top row with title and Add Playlist button
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Your Library",
                    color = TextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )

                IconButton(
                    onClick = onCreatePlaylist,
                    modifier = Modifier.testTag("lib_create_playlist_btn")
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "Create Playlist",
                        tint = TextPrimary,
                        modifier = Modifier.size(28.dp)
                    )
                }
            }
        }

        // Filter chips
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    FilterChip(
                        selected = selectedFilter == null,
                        onClick = { selectedFilter = null },
                        label = { Text("All") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = TextPrimary,
                            selectedLabelColor = Color.Black,
                            containerColor = DarkSurfaceElevated,
                            labelColor = TextPrimary
                        ),
                        shape = CircleShape
                    )
                }
                item {
                    FilterChip(
                        selected = selectedFilter == "Playlists",
                        onClick = { selectedFilter = if (selectedFilter == "Playlists") null else "Playlists" },
                        label = { Text("Playlists") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = TextPrimary,
                            selectedLabelColor = Color.Black,
                            containerColor = DarkSurfaceElevated,
                            labelColor = TextPrimary
                        ),
                        shape = CircleShape
                    )
                }
                item {
                    FilterChip(
                        selected = selectedFilter == "Liked",
                        onClick = { selectedFilter = if (selectedFilter == "Liked") null else "Liked" },
                        label = { Text("Liked") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = TextPrimary,
                            selectedLabelColor = Color.Black,
                            containerColor = DarkSurfaceElevated,
                            labelColor = TextPrimary
                        ),
                        shape = CircleShape
                    )
                }
            }
        }

        // Liked Songs item
        if (selectedFilter == null || selectedFilter == "Liked" || selectedFilter == "Playlists") {
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable(onClick = onOpenLikedSongs)
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                        .testTag("library_liked_songs"),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(LikedGradientStart, LikedGradientEnd)
                                )
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Favorite,
                            contentDescription = "Liked Songs",
                            tint = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Liked Songs",
                            color = TextPrimary,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Playlist • ${likedTracks.size} songs",
                            color = TextSecondary,
                            fontSize = 13.sp
                        )
                    }
                }
            }
        }

        // User Playlists
        if (selectedFilter == null || selectedFilter == "Playlists") {
            items(playlists) { playlist ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onOpenPlaylist(playlist.id) }
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                        .testTag("library_playlist_${playlist.id}"),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(DarkHighlight),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = playlist.name.firstOrNull()?.uppercase() ?: "P",
                            color = TextSecondary,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = playlist.name,
                            color = TextPrimary,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Playlist • ${playlist.tracks.size} songs",
                            color = TextSecondary,
                            fontSize = 13.sp
                        )
                    }
                }
            }
        }
    }
}
