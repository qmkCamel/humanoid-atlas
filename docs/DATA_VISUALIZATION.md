# Data Visualization — Phased Implementation Plan

Atlas Data Brokerage supports 16 sensor modalities across physical AI datasets. The sample preview system must render each modality appropriately so buyers can evaluate data quality before purchasing.

## Current State

- `SampleGallery` renders **all** samples as an HTML5 `<video>` element (`DataBrokerage.tsx:120-134`)
- `SampleUploader` accepts `video/*, image/*, .parquet, .hdf5, .rosbag, .mcap` (`DataBrokerage.tsx:974`)
- Sample metadata includes `content_type` and `duration_seconds` but neither is used for rendering
- No modality-aware upload validation — a listing tagged `audio` can upload `.parquet` with no guidance

## Architecture: Two-Level Dispatch

Sample rendering is determined by a two-level lookup:

1. **Layer 1 — Content type / file extension** (resolves most formats unambiguously)
2. **Layer 2 — Listing modality tags** (resolves ambiguous formats like `.parquet` and `.hdf5`)

```
Sample file arrives → check content_type / extension
  │
  ├── video/*              → HTML5 <video> player
  ├── image/*              → HTML5 <img> tag
  ├── audio/*              → HTML5 <audio> player
  ├── .rosbag / .mcap      → Rerun web viewer
  ├── .rrd                 → Rerun web viewer (native format)
  ├── .json                → JSON / text viewer
  ├── .parquet / .hdf5     → Layer 2: check listing modality
  │     ├── 3D-spatial modalities
  │     │   (lidar, radar, point_cloud, motion_capture,
  │     │    event_camera, rgbd, depth)
  │     │                  → Rerun web viewer
  │     ├── time-series modalities
  │     │   (imu, force_torque, proprioception, tactile)
  │     │                  → Time-series chart
  │     ├── text modalities
  │     │   (language_annotations)
  │     │                  → JSON / text viewer
  │     └── other          → Download link
  └── anything else        → Download link with file metadata
```

## Modality-Aware Upload Validation

When a provider uploads a sample, the system should validate file type against the listing's modality tags and surface guidance. This is a **soft validation** (warn, don't block) since edge cases exist.

### Recommended file types by modality

| Modality | Recommended uploads | Accept filter |
|---|---|---|
| `rgb` | `.mp4`, `.webm`, `.mov`, `.png`, `.jpg` | `video/*,image/*` |
| `rgbd` | `.rosbag`, `.mcap`, `.rrd`, `.hdf5`, `.mp4` | `video/*,.rosbag,.mcap,.rrd,.hdf5` |
| `depth` | `.png`, `.hdf5`, `.rosbag`, `.mcap`, `.rrd` | `image/*,.hdf5,.rosbag,.mcap,.rrd` |
| `lidar` | `.rosbag`, `.mcap`, `.rrd`, `.parquet`, `.hdf5` | `.rosbag,.mcap,.rrd,.parquet,.hdf5` |
| `radar` | `.rosbag`, `.mcap`, `.rrd`, `.parquet`, `.hdf5` | `.rosbag,.mcap,.rrd,.parquet,.hdf5` |
| `point_cloud` | `.rosbag`, `.mcap`, `.rrd`, `.parquet`, `.hdf5` | `.rosbag,.mcap,.rrd,.parquet,.hdf5` |
| `motion_capture` | `.rrd`, `.parquet`, `.hdf5`, `.mcap` | `.rrd,.parquet,.hdf5,.mcap` |
| `tactile` | `.parquet`, `.hdf5`, `.mp4`, `.png`, `.rrd` | `video/*,image/*,.parquet,.hdf5,.rrd` |
| `force_torque` | `.parquet`, `.hdf5`, `.rosbag`, `.rrd` | `.parquet,.hdf5,.rosbag,.rrd` |
| `proprioception` | `.parquet`, `.hdf5`, `.rosbag`, `.rrd` | `.parquet,.hdf5,.rosbag,.rrd` |
| `imu` | `.parquet`, `.hdf5`, `.rosbag`, `.rrd` | `.parquet,.hdf5,.rosbag,.rrd` |
| `audio` | `.wav`, `.mp3`, `.flac`, `.ogg` | `audio/*` |
| `language_annotations` | `.json`, `.parquet` | `.json,.parquet,application/json` |
| `thermal` | `.mp4`, `.png`, `.hdf5`, `.rrd` | `video/*,image/*,.hdf5,.rrd` |
| `event_camera` | `.hdf5`, `.rosbag`, `.mcap`, `.rrd` | `.hdf5,.rosbag,.mcap,.rrd` |
| `other` | Any | `*` |

When a listing has **multiple modalities**, the accept filter is the union of all applicable filters.

### Validation behavior

- **Dynamic accept filter**: The `<input type="file" accept="...">` attribute should be computed from the listing's modality tags
- **Soft warning**: If a provider uploads a file that doesn't match recommended types, show a yellow warning (not a hard block): *"This file type is uncommon for [modality] datasets. Buyers may not be able to preview it. Consider uploading a .rrd preview alongside your data files."*
- **Encourage .rrd**: For any non-video/image modality, show a tip suggesting providers generate `.rrd` preview files using the Rerun Python SDK

## Phase 1: Content-Type Dispatcher + Native Formats

**Goal**: Replace the monolithic `<video>` player with a component that picks the right renderer based on file type.

### Changes

1. **Update `SampleGallery` to accept `content_type` in sample objects**
   - Currently: `samples: Array<{ id: string; url: string; filename: string }>`
   - After: `samples: Array<{ id: string; url: string; filename: string; content_type: string }>`
   - The Listing interface already has `content_type` on samples — just thread it through

2. **Create `SampleRenderer` dispatcher component**
   ```
   function SampleRenderer({ sample, modalities }) {
     const ext = getExtension(sample.filename);
     const ct = sample.content_type;

     if (ct.startsWith('video/'))  return <video ...>;
     if (ct.startsWith('image/'))  return <img ...>;
     if (ct.startsWith('audio/'))  return <audio ...>;
     if (ext === 'json')           return <JsonViewer ...>;
     // Phase 2: Rerun
     // Phase 3: Charts
     return <DownloadLink ...>;
   }
   ```

3. **Add `<audio>` player styling** (minimal — native controls with consistent border/radius)

4. **Add `<img>` display** with click-to-zoom or lightbox

5. **Add download link fallback** showing filename, file size, and content type

6. **Update `SampleUploader` accept filter** to be modality-aware (dynamic)

### Dependencies
- None (all native HTML elements)

### Estimated scope
- ~150 lines of new component code
- Update SampleGallery props threading
- Update SampleUploader file input

## Phase 2: Rerun Web Viewer Integration

**Goal**: Embed Rerun's WASM viewer for 3D/spatial data and robotics container formats.

### Changes

1. **Install `@rerun-io/web-viewer-react`** (v0.31.1+)
   ```
   pnpm add @rerun-io/web-viewer-react
   ```

2. **Add `.rrd` to accepted upload formats** in SampleUploader

3. **Create `RerunViewer` wrapper component**
   ```
   import WebViewer from "@rerun-io/web-viewer-react";

   function RerunViewer({ url }: { url: string }) {
     return (
       <div style={{ width: '100%', height: 500 }}>
         <WebViewer rrd={url} width="100%" height="100%" hide_welcome_screen />
       </div>
     );
   }
   ```

4. **Wire into `SampleRenderer` dispatcher**
   - `.rrd` files → RerunViewer (always)
   - `.rosbag` / `.mcap` files → RerunViewer (always)
   - `.parquet` / `.hdf5` with 3D-spatial modalities → RerunViewer

5. **Add provider guidance in SampleUploader**
   - For non-video modalities, show tip: "For best preview quality, upload a .rrd file generated with the Rerun Python SDK"
   - Link to Rerun docs for generating .rrd files

6. **Update ProviderDocs** with instructions for generating .rrd preview files:
   ```python
   import rerun as rr
   rr.init("my_dataset_preview")
   rr.save("preview.rrd")
   # Log your data (point clouds, images, IMU, etc.)
   ```

### Dependencies
- `@rerun-io/web-viewer-react` npm package (~16MB WASM bundle)
- Browser WebGL/WebGPU support (fallback handled by Rerun)

### Considerations
- WASM bundle size: lazy-load the Rerun viewer (dynamic import) so it doesn't bloat initial page load
- Large .rrd files: recommend providers keep preview files under 50MB for fast web loading
- MCAP support is experimental in Rerun — test with representative files

## Phase 3: Time-Series Charts

**Goal**: Render interactive charts for numeric sensor data (IMU, force/torque, proprioception, tactile).

### Changes

1. **Install a lightweight chart library** (options):
   - `recharts` — most React-idiomatic, good for moderate data sizes
   - `uPlot` — best performance for large time-series (100K+ points)
   - Decision: start with `recharts`, switch to `uPlot` if performance is an issue

2. **Server-side preview generation** (recommended approach):
   - At upload time, if the file is `.parquet` with a time-series modality, the backend generates a small JSON summary (first N rows, column names, basic stats)
   - Store the JSON summary alongside the sample in R2
   - The chart component loads the JSON summary, not the full parquet file
   - This avoids client-side parquet parsing (which requires `parquet-wasm` and is heavy)

3. **Alternative: Client-side parquet reading** (heavier, more flexible):
   - Install `parquet-wasm` for in-browser parquet reading
   - Read first 1000 rows client-side and render as chart
   - Pro: no backend changes. Con: adds ~2MB WASM to bundle

4. **Create `TimeSeriesChart` component**
   - Renders multi-line chart with time on X axis
   - Auto-detects column names from data
   - Supports zoom/pan for exploring data ranges
   - Shows basic stats (min, max, mean, sample rate)

5. **Wire into `SampleRenderer` dispatcher**
   - `.parquet` / `.hdf5` with time-series modalities → TimeSeriesChart

### Dependencies
- Chart library (recharts or uPlot)
- Either server-side JSON preview generation OR `parquet-wasm`

## Phase 4: Enhanced Gallery UX

**Goal**: Improve the overall sample browsing experience.

### Changes

1. **Thumbnail previews in catalog browse view**
   - Show `thumbnail_url` (already on Listing interface) in catalog rows
   - For video samples, generate poster frame server-side at upload time
   - For image samples, use the image itself as thumbnail

2. **Multi-format sample strip**
   - Replace numbered buttons (1, 2, 3) with format-aware thumbnails
   - Show file type icon + filename snippet for each sample
   - Group samples by type (video samples, data samples, etc.)

3. **Fullscreen / expanded view**
   - Click-to-expand for Rerun viewer (needs more space for 3D data)
   - Lightbox for images
   - Theater mode for video

4. **Sample metadata display**
   - Show file size, duration (for video/audio), row count (for parquet)
   - Show content type badge next to each sample

## Phase 5: Provider Tooling

**Goal**: Make it easy for providers to generate high-quality previews.

### Changes

1. **Rerun preview generation CLI/guide**
   - Publish a Python script / notebook that providers can run:
     ```python
     # atlas-preview-generator
     # Reads .rosbag/.mcap/.parquet and produces a trimmed .rrd preview
     import rerun as rr
     rr.init("preview")
     # ... load and log first 10 seconds of data
     rr.save("preview.rrd")
     ```
   - Host in a separate repo or as a downloadable script from provider docs

2. **Auto-preview generation** (stretch goal)
   - When a provider uploads a `.rosbag` or `.mcap`, the backend automatically generates a `.rrd` preview
   - Requires server-side Rerun SDK (Python) or a conversion worker
   - Would eliminate the need for providers to generate previews manually

3. **Preview quality scoring**
   - Show providers a "preview quality" indicator on their listings
   - Listings with video/Rerun previews rank higher in catalog search
   - Encourage richer previews to drive buyer conversion

## File Format Reference

### Formats that render natively in browser
| Format | Renderer | Notes |
|---|---|---|
| `.mp4`, `.webm`, `.mov` | `<video>` | Most universal |
| `.png`, `.jpg`, `.webp` | `<img>` | Including depth maps stored as 16-bit PNG |
| `.wav`, `.mp3`, `.ogg`, `.flac` | `<audio>` | Native browser support |
| `.json` | JSON viewer | Pretty-printed, collapsible |

### Formats requiring Rerun viewer
| Format | Notes |
|---|---|
| `.rrd` | Rerun native recording — best quality, any modality |
| `.rosbag` | ROS bag — Rerun loads standard message types |
| `.mcap` | MCAP container — experimental Rerun support (v0.25+) |
| `.parquet` / `.hdf5` (3D data) | Requires conversion to `.rrd` at upload time |

### Formats requiring server-side processing
| Format | Processing | Output |
|---|---|---|
| `.parquet` (time-series) | Extract first N rows → JSON | Chart-ready summary |
| `.hdf5` (time-series) | Extract first N rows → JSON | Chart-ready summary |
| `.parquet` / `.hdf5` (3D) | Convert to `.rrd` | Rerun-ready preview |

## Implementation Priority

| Phase | Effort | Impact | Dependencies |
|---|---|---|---|
| **Phase 1**: Content-type dispatcher | Small | High — fixes broken display for images, audio | None |
| **Phase 2**: Rerun integration | Medium | High — enables 3D/spatial data preview | `@rerun-io/web-viewer-react` |
| **Phase 3**: Time-series charts | Medium | Medium — covers IMU/F-T/proprioception | Chart library + backend or parquet-wasm |
| **Phase 4**: Enhanced gallery UX | Medium | Medium — improves browsing experience | Phases 1-2 |
| **Phase 5**: Provider tooling | Large | High long-term — improves data quality | Phases 1-3, Rerun Python SDK |
