#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
VURMZ LOGO 3D ANIMATION PIPELINE
================================================================================

Professional-grade 3D logo animation generator using Blender's Cycles engine.
Designed for premium web presentation with Apple-inspired aesthetics.

Outputs:
    - vurmz-logo-3d.glb          High-quality 3D model (Three.js/WebGL ready)
    - vurmz-logo-spin.mp4        Smooth showcase rotation (5s loop)
    - vurmz-logo-pulse.mp4       Subtle breathing animation (5s loop)
    - vurmz-logo-water.mp4       Reflective water surface effect (5s loop)
    - vurmz-logo-3d-render.png   Hero image with transparency

Usage:
    # Headless render (recommended for final output):
    blender --background --python scripts/blender-logo-animation.py

    # Interactive mode (for debugging/preview):
    blender --python scripts/blender-logo-animation.py

Requirements:
    - Blender 4.0+ with Cycles support
    - Metal GPU acceleration (macOS) or CUDA/OptiX (NVIDIA)
    - Source SVG: public/images/vurmz-logo-full.svg

Author: VURMZ Pipeline
Version: 2.0.0
================================================================================
"""

import bpy
import bmesh
import os
import sys
import math
from mathutils import Vector, Euler

# =============================================================================
# CONFIGURATION
# =============================================================================

class Config:
    """Central configuration for all render parameters."""

    # Paths (resolved at runtime)
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
    SVG_PATH = os.path.join(PROJECT_DIR, "public", "images", "vurmz-logo-full.svg")

    OUTPUT_PATHS = {
        "models": os.path.join(PROJECT_DIR, "public", "models"),
        "videos": os.path.join(PROJECT_DIR, "public", "videos"),
        "images": os.path.join(PROJECT_DIR, "public", "images"),
    }

    # Logo Geometry
    EXTRUDE_DEPTH = 0.06          # Subtle depth, not chunky
    BEVEL_DEPTH = 0.008           # Smooth chamfered edges
    BEVEL_SEGMENTS = 6            # High-quality bevel curve
    LOGO_TARGET_WIDTH = 3.0       # Final width in Blender units
    AUTO_SMOOTH_ANGLE = 35        # Degrees for edge smoothing

    # Material: Brushed Teal Anodized Metal
    MATERIAL = {
        "base_color": (0.416, 0.549, 0.549, 1.0),  # #6A8C8C VURMZ Teal
        "metallic": 0.95,
        "roughness": 0.18,          # Slightly brushed finish
        "specular": 0.6,
        "coat_weight": 0.5,         # Clear coat for polish
        "coat_roughness": 0.05,
        "emission_strength": 0.0,
    }

    # Lighting: Three-point + ambient (product photography style)
    LIGHTING = {
        "key": {
            "type": "AREA",
            "location": (2.5, -2.0, 3.5),
            "rotation": (45, 0, 35),  # degrees
            "energy": 600,
            "size": 3.5,
            "color": (1.0, 0.98, 0.96),  # Warm white
        },
        "fill": {
            "type": "AREA",
            "location": (-3.0, -1.5, 2.0),
            "rotation": (55, 0, -40),
            "energy": 200,
            "size": 5.0,
            "color": (0.96, 0.98, 1.0),  # Cool white
        },
        "rim": {
            "type": "AREA",
            "location": (0, 3.0, 2.5),
            "rotation": (130, 0, 0),
            "energy": 350,
            "size": 2.5,
            "color": (1.0, 1.0, 1.0),
        },
        "ambient": {
            "type": "AREA",
            "location": (0, 0, 5.0),
            "rotation": (0, 0, 0),
            "energy": 100,
            "size": 8.0,
            "color": (1.0, 1.0, 1.0),
        },
    }

    # Camera: Long lens for minimal distortion
    CAMERA = {
        "location": (0, -6.0, 1.2),
        "rotation": (82, 0, 0),  # degrees - nearly straight on
        "lens_mm": 105,          # Portrait/product lens
        "sensor_width": 36,      # Full frame equivalent
    }

    # Render: Cycles with high quality
    RENDER = {
        "engine": "CYCLES",
        "device": "GPU",
        "samples": 256,
        "use_denoising": True,
        "denoiser": "OPENIMAGEDENOISE",
        "resolution_x": 1920,
        "resolution_y": 1080,
        "film_transparent": False,  # White background for videos
        "fps": 30,
        "color_management": "Filmic",
        "look": "Medium High Contrast",
    }

    # Animation timing
    ANIMATION = {
        "duration_seconds": 5,
        "fps": 30,
    }

    @classmethod
    def frame_count(cls):
        return cls.ANIMATION["duration_seconds"] * cls.ANIMATION["fps"]


# =============================================================================
# LOGGING
# =============================================================================

class Logger:
    """Professional logging with visual formatting."""

    HEADER = "\033[95m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"

    @staticmethod
    def header(msg):
        print(f"\n{'='*70}")
        print(f"{Logger.BOLD}{Logger.CYAN}  {msg}{Logger.ENDC}")
        print(f"{'='*70}\n")

    @staticmethod
    def info(msg):
        print(f"{Logger.BLUE}[INFO]{Logger.ENDC} {msg}")

    @staticmethod
    def success(msg):
        print(f"{Logger.GREEN}[DONE]{Logger.ENDC} {msg}")

    @staticmethod
    def warning(msg):
        print(f"{Logger.YELLOW}[WARN]{Logger.ENDC} {msg}")

    @staticmethod
    def error(msg):
        print(f"{Logger.RED}[ERROR]{Logger.ENDC} {msg}")

    @staticmethod
    def progress(current, total, task=""):
        pct = (current / total) * 100
        bar_len = 40
        filled = int(bar_len * current / total)
        bar = "█" * filled + "░" * (bar_len - filled)
        print(f"\r{Logger.CYAN}[{bar}] {pct:5.1f}% {task}{Logger.ENDC}", end="", flush=True)
        if current == total:
            print()


# =============================================================================
# SCENE MANAGEMENT
# =============================================================================

class SceneManager:
    """Handles Blender scene setup and cleanup."""

    @staticmethod
    def clear_scene():
        """Remove all objects and orphan data."""
        Logger.info("Clearing scene...")

        # Delete all objects
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.delete(use_global=False)

        # Purge orphan data
        for block_type in [bpy.data.meshes, bpy.data.materials, bpy.data.curves,
                           bpy.data.lights, bpy.data.cameras, bpy.data.textures,
                           bpy.data.images, bpy.data.node_groups]:
            for block in block_type:
                if block.users == 0:
                    block_type.remove(block)

        # Reset frame
        bpy.context.scene.frame_set(1)

    @staticmethod
    def ensure_directories():
        """Create output directories if they don't exist."""
        for name, path in Config.OUTPUT_PATHS.items():
            os.makedirs(path, exist_ok=True)
            Logger.info(f"Output directory ready: {name}/")

    @staticmethod
    def setup_render_settings():
        """Configure Cycles render engine with optimal settings."""
        Logger.info("Configuring render engine...")

        scene = bpy.context.scene
        cfg = Config.RENDER

        # Engine
        scene.render.engine = cfg["engine"]

        # GPU acceleration
        cycles_prefs = bpy.context.preferences.addons['cycles'].preferences

        # Try Metal first (macOS), then CUDA, then OptiX
        for device_type in ['METAL', 'CUDA', 'OPTIX', 'NONE']:
            try:
                cycles_prefs.compute_device_type = device_type
                cycles_prefs.get_devices()
                for device in cycles_prefs.devices:
                    device.use = True
                if device_type != 'NONE':
                    Logger.info(f"GPU acceleration: {device_type}")
                    break
            except:
                continue

        scene.cycles.device = cfg["device"]
        scene.cycles.samples = cfg["samples"]
        scene.cycles.use_denoising = cfg["use_denoising"]

        # Try to set denoiser (API varies by version)
        try:
            scene.cycles.denoiser = cfg["denoiser"]
        except:
            pass

        # Resolution
        scene.render.resolution_x = cfg["resolution_x"]
        scene.render.resolution_y = cfg["resolution_y"]
        scene.render.resolution_percentage = 100
        scene.render.film_transparent = cfg["film_transparent"]

        # Frame rate
        scene.render.fps = cfg["fps"]

        # Color management
        scene.view_settings.view_transform = cfg["color_management"]
        try:
            scene.view_settings.look = cfg["look"]
        except:
            pass

        # Performance
        scene.render.use_persistent_data = True


# =============================================================================
# LOGO CREATION
# =============================================================================

class LogoBuilder:
    """Handles SVG import and 3D logo construction."""

    def __init__(self):
        self.logo_object = None
        self.material = None

    def import_and_build(self):
        """Import SVG and convert to premium 3D mesh."""
        Logger.header("BUILDING 3D LOGO")

        self._import_svg()
        self._convert_to_mesh()
        self._apply_geometry_settings()
        self._create_and_apply_material()
        self._center_and_scale()

        return self.logo_object

    def _import_svg(self):
        """Import the VURMZ SVG logo."""
        Logger.info(f"Importing SVG: {Config.SVG_PATH}")

        if not os.path.exists(Config.SVG_PATH):
            Logger.error(f"SVG file not found: {Config.SVG_PATH}")
            sys.exit(1)

        bpy.ops.import_curve.svg(filepath=Config.SVG_PATH)

        curves = [obj for obj in bpy.context.scene.objects if obj.type == 'CURVE']
        Logger.info(f"Imported {len(curves)} curve paths (V, U, RM ligature, Z)")

    def _convert_to_mesh(self):
        """Convert curves to 3D mesh with extrusion and bevel."""
        Logger.info("Converting to 3D mesh...")

        curves = [obj for obj in bpy.context.scene.objects if obj.type == 'CURVE']
        meshes = []

        for curve in curves:
            # Set extrusion parameters on curve before conversion
            curve.data.extrude = Config.EXTRUDE_DEPTH
            curve.data.bevel_depth = Config.BEVEL_DEPTH
            curve.data.bevel_resolution = Config.BEVEL_SEGMENTS
            curve.data.fill_mode = 'BOTH'

            # Select and convert
            bpy.ops.object.select_all(action='DESELECT')
            curve.select_set(True)
            bpy.context.view_layer.objects.active = curve
            bpy.ops.object.convert(target='MESH')

            meshes.append(bpy.context.active_object)

        # Join all meshes into single object
        if len(meshes) > 1:
            bpy.ops.object.select_all(action='DESELECT')
            for mesh in meshes:
                mesh.select_set(True)
            bpy.context.view_layer.objects.active = meshes[0]
            bpy.ops.object.join()

        self.logo_object = bpy.context.active_object
        self.logo_object.name = "VURMZ_Logo"

        Logger.success(f"Mesh created: {len(self.logo_object.data.polygons)} faces")

    def _apply_geometry_settings(self):
        """Apply smooth shading and auto-smooth normals."""
        Logger.info("Optimizing geometry...")

        obj = self.logo_object

        # Smooth shading
        bpy.ops.object.shade_smooth()

        # Auto-smooth for clean edges (API changed in Blender 4.0)
        try:
            # Blender 4.1+ uses modifier
            mod = obj.modifiers.new(name="AutoSmooth", type='SMOOTH')
            if hasattr(mod, 'use_angle'):
                mod.use_angle = True
                mod.angle = math.radians(Config.AUTO_SMOOTH_ANGLE)
        except:
            try:
                # Blender 3.x
                obj.data.use_auto_smooth = True
                obj.data.auto_smooth_angle = math.radians(Config.AUTO_SMOOTH_ANGLE)
            except:
                pass  # Skip if not available

        # Recalculate normals (ensure consistent facing)
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.normals_make_consistent(inside=False)
        bpy.ops.object.mode_set(mode='OBJECT')

    def _create_and_apply_material(self):
        """Create premium brushed metal material."""
        Logger.info("Creating material: Brushed Teal Metal...")

        mat_cfg = Config.MATERIAL
        mat = bpy.data.materials.new(name="VURMZ_BrushedMetal")
        mat.use_nodes = True

        nodes = mat.node_tree.nodes
        links = mat.node_tree.links
        nodes.clear()

        # Output
        output = nodes.new('ShaderNodeOutputMaterial')
        output.location = (500, 0)

        # Principled BSDF - the workhorse shader
        bsdf = nodes.new('ShaderNodeBsdfPrincipled')
        bsdf.location = (200, 0)

        # Set parameters
        bsdf.inputs['Base Color'].default_value = mat_cfg["base_color"]
        bsdf.inputs['Metallic'].default_value = mat_cfg["metallic"]
        bsdf.inputs['Roughness'].default_value = mat_cfg["roughness"]

        # Specular/IOR (API changed in Blender 4.0)
        if 'Specular IOR Level' in bsdf.inputs:
            bsdf.inputs['Specular IOR Level'].default_value = mat_cfg["specular"]
        elif 'Specular' in bsdf.inputs:
            bsdf.inputs['Specular'].default_value = mat_cfg["specular"]

        # Clear coat (API varies)
        if 'Coat Weight' in bsdf.inputs:
            bsdf.inputs['Coat Weight'].default_value = mat_cfg["coat_weight"]
            bsdf.inputs['Coat Roughness'].default_value = mat_cfg["coat_roughness"]
        elif 'Clearcoat' in bsdf.inputs:
            bsdf.inputs['Clearcoat'].default_value = mat_cfg["coat_weight"]
            bsdf.inputs['Clearcoat Roughness'].default_value = mat_cfg["coat_roughness"]

        # Add subtle anisotropy for brushed metal look
        if 'Anisotropic' in bsdf.inputs:
            bsdf.inputs['Anisotropic'].default_value = 0.3
            bsdf.inputs['Anisotropic Rotation'].default_value = 0.25

        links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

        # Apply to logo
        self.logo_object.data.materials.clear()
        self.logo_object.data.materials.append(mat)
        self.material = mat

        Logger.success("Material applied")

    def _center_and_scale(self):
        """Center logo at origin and scale to target size."""
        Logger.info("Centering and scaling...")

        obj = self.logo_object

        # Set origin to geometry center
        bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')

        # Move to world origin
        obj.location = (0, 0, 0)

        # Scale to target width
        current_width = obj.dimensions.x
        if current_width > 0:
            scale_factor = Config.LOGO_TARGET_WIDTH / current_width
            obj.scale = (scale_factor, scale_factor, scale_factor)

        # Apply transformations
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

        dims = obj.dimensions
        Logger.success(f"Final size: {dims.x:.2f} x {dims.y:.2f} x {dims.z:.3f}")


# =============================================================================
# LIGHTING
# =============================================================================

class LightingRig:
    """Professional three-point lighting setup."""

    def __init__(self):
        self.lights = []

    def setup(self):
        """Create all lights for product photography look."""
        Logger.header("SETTING UP LIGHTING")

        for name, cfg in Config.LIGHTING.items():
            light = self._create_light(name, cfg)
            self.lights.append(light)

        self._setup_world_environment()
        Logger.success(f"Created {len(self.lights)} lights")

    def _create_light(self, name, cfg):
        """Create a single light from configuration."""
        light_data = bpy.data.lights.new(name=f"Light_{name.title()}", type=cfg["type"])
        light_data.energy = cfg["energy"]
        light_data.color = cfg["color"]

        if cfg["type"] == "AREA":
            light_data.size = cfg["size"]
            light_data.shape = 'RECTANGLE'
            light_data.size_y = cfg["size"] * 0.8

        light_obj = bpy.data.objects.new(f"Light_{name.title()}", light_data)
        bpy.context.scene.collection.objects.link(light_obj)

        light_obj.location = cfg["location"]
        light_obj.rotation_euler = Euler([math.radians(r) for r in cfg["rotation"]])

        Logger.info(f"  {name.title()} light: {cfg['energy']}W @ {cfg['size']}m")
        return light_obj

    def _setup_world_environment(self):
        """Create subtle studio environment for reflections."""
        Logger.info("Setting up environment...")

        world = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
        bpy.context.scene.world = world
        world.use_nodes = True

        nodes = world.node_tree.nodes
        links = world.node_tree.links
        nodes.clear()

        # Gradient background for studio look
        output = nodes.new('ShaderNodeOutputWorld')
        output.location = (400, 0)

        background = nodes.new('ShaderNodeBackground')
        background.location = (200, 0)
        background.inputs['Strength'].default_value = 1.0

        # Mix white and light gray based on vertical gradient
        mix = nodes.new('ShaderNodeMix')
        mix.location = (0, 0)
        mix.data_type = 'RGBA'
        mix.inputs['A'].default_value = (1.0, 1.0, 1.0, 1.0)  # White
        mix.inputs['B'].default_value = (0.92, 0.93, 0.94, 1.0)  # Light gray

        gradient = nodes.new('ShaderNodeTexGradient')
        gradient.location = (-200, 0)
        gradient.gradient_type = 'LINEAR'

        coord = nodes.new('ShaderNodeTexCoord')
        coord.location = (-400, 0)

        separate = nodes.new('ShaderNodeSeparateXYZ')
        separate.location = (-300, 0)

        links.new(coord.outputs['Generated'], separate.inputs['Vector'])
        links.new(separate.outputs['Z'], mix.inputs['Factor'])
        links.new(mix.outputs['Result'], background.inputs['Color'])
        links.new(background.outputs['Background'], output.inputs['Surface'])


# =============================================================================
# CAMERA
# =============================================================================

class CameraSetup:
    """Product photography camera configuration."""

    def __init__(self):
        self.camera = None

    def setup(self):
        """Create and position camera for optimal product shot."""
        Logger.header("SETTING UP CAMERA")

        cfg = Config.CAMERA

        # Create camera
        cam_data = bpy.data.cameras.new(name="Product_Camera")
        cam_data.lens = cfg["lens_mm"]
        cam_data.sensor_width = cfg["sensor_width"]
        cam_data.clip_start = 0.1
        cam_data.clip_end = 100

        self.camera = bpy.data.objects.new("Product_Camera", cam_data)
        bpy.context.scene.collection.objects.link(self.camera)

        # Position
        self.camera.location = cfg["location"]
        self.camera.rotation_euler = Euler([math.radians(r) for r in (cfg["rotation"][0], cfg["rotation"][1], cfg["rotation"][2])])

        # Set as active camera
        bpy.context.scene.camera = self.camera

        Logger.success(f"Camera: {cfg['lens_mm']}mm @ {cfg['location']}")
        return self.camera


# =============================================================================
# ANIMATION
# =============================================================================

class Animator:
    """Handles all logo animations."""

    def __init__(self, logo_object):
        self.logo = logo_object
        self.frame_count = Config.frame_count()

    def clear_animation(self):
        """Remove all keyframes from logo."""
        if self.logo.animation_data:
            self.logo.animation_data_clear()

    def setup_timeline(self):
        """Configure timeline for animation."""
        scene = bpy.context.scene
        scene.frame_start = 1
        scene.frame_end = self.frame_count
        scene.frame_set(1)

    def create_spin(self):
        """Elegant 360° rotation animation."""
        Logger.info("Creating spin animation...")

        self.clear_animation()
        self.setup_timeline()

        # Full rotation over duration
        self.logo.rotation_euler = (0, 0, 0)
        self.logo.keyframe_insert(data_path="rotation_euler", frame=1)

        self.logo.rotation_euler = (0, 0, math.radians(360))
        self.logo.keyframe_insert(data_path="rotation_euler", frame=self.frame_count + 1)

        # Linear interpolation for seamless loop
        self._set_interpolation('LINEAR')

        Logger.success("Spin animation ready")

    def create_pulse(self):
        """Subtle breathing/scale animation."""
        Logger.info("Creating pulse animation...")

        self.clear_animation()
        self.setup_timeline()

        pulse_amount = 0.025  # 2.5% scale change

        # Breathing cycle
        keyframes = [
            (1, 1.0),
            (self.frame_count // 4, 1.0 + pulse_amount),
            (self.frame_count // 2, 1.0),
            (3 * self.frame_count // 4, 1.0 + pulse_amount * 0.7),
            (self.frame_count, 1.0),
        ]

        for frame, scale in keyframes:
            self.logo.scale = (scale, scale, scale)
            self.logo.keyframe_insert(data_path="scale", frame=frame)

        self._set_interpolation('BEZIER')

        Logger.success("Pulse animation ready")

    def create_water_reflection(self):
        """Water surface with ripple reflections."""
        Logger.info("Creating water reflection animation...")

        self.clear_animation()
        self.setup_timeline()

        # Create water plane below logo
        water_plane = self._create_water_plane()

        # Subtle logo float
        base_z = 0
        float_amount = 0.015

        keyframes = [
            (1, base_z),
            (self.frame_count // 2, base_z + float_amount),
            (self.frame_count, base_z),
        ]

        for frame, z in keyframes:
            self.logo.location.z = z
            self.logo.keyframe_insert(data_path="location", index=2, frame=frame)

        self._set_interpolation('BEZIER')

        Logger.success("Water animation ready")
        return water_plane

    def _create_water_plane(self):
        """Create reflective water surface."""
        bpy.ops.mesh.primitive_plane_add(size=15, location=(0, 0, -0.15))
        plane = bpy.context.active_object
        plane.name = "Water_Surface"

        # Water material
        mat = bpy.data.materials.new(name="Water_Material")
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        links = mat.node_tree.links
        nodes.clear()

        output = nodes.new('ShaderNodeOutputMaterial')
        output.location = (800, 0)

        bsdf = nodes.new('ShaderNodeBsdfPrincipled')
        bsdf.location = (400, 0)
        bsdf.inputs['Base Color'].default_value = (0.85, 0.9, 0.95, 1.0)
        bsdf.inputs['Metallic'].default_value = 0.0
        bsdf.inputs['Roughness'].default_value = 0.05
        bsdf.inputs['Alpha'].default_value = 0.4

        # Animated wave displacement
        wave = nodes.new('ShaderNodeTexWave')
        wave.location = (-200, -200)
        wave.wave_type = 'RINGS'
        wave.inputs['Scale'].default_value = 2.0
        wave.inputs['Distortion'].default_value = 1.5
        wave.inputs['Detail'].default_value = 3.0

        # Animate phase
        wave.inputs['Phase Offset'].default_value = 0
        wave.inputs['Phase Offset'].keyframe_insert(data_path="default_value", frame=1)
        wave.inputs['Phase Offset'].default_value = 8
        wave.inputs['Phase Offset'].keyframe_insert(data_path="default_value", frame=self.frame_count)

        bump = nodes.new('ShaderNodeBump')
        bump.location = (200, -200)
        bump.inputs['Strength'].default_value = 0.08

        links.new(wave.outputs['Fac'], bump.inputs['Height'])
        links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
        links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

        plane.data.materials.append(mat)
        mat.blend_method = 'BLEND'

        return plane

    def _set_interpolation(self, mode):
        """Set keyframe interpolation mode."""
        if not self.logo.animation_data or not self.logo.animation_data.action:
            return

        for fcurve in self.logo.animation_data.action.fcurves:
            for keyframe in fcurve.keyframe_points:
                keyframe.interpolation = mode
                if mode == 'BEZIER':
                    keyframe.handle_left_type = 'AUTO_CLAMPED'
                    keyframe.handle_right_type = 'AUTO_CLAMPED'


# =============================================================================
# EXPORTER
# =============================================================================

class Exporter:
    """Handles all file exports."""

    @staticmethod
    def export_glb(logo, filename):
        """Export logo as GLB for Three.js."""
        Logger.info(f"Exporting GLB: {filename}")

        filepath = os.path.join(Config.OUTPUT_PATHS["models"], filename)

        bpy.ops.object.select_all(action='DESELECT')
        logo.select_set(True)
        bpy.context.view_layer.objects.active = logo

        bpy.ops.export_scene.gltf(
            filepath=filepath,
            use_selection=True,
            export_format='GLB',
            export_apply=True,
            export_materials='EXPORT',
        )

        Logger.success(f"Exported: {filepath}")
        return filepath

    @staticmethod
    def render_animation(filename, task_name):
        """Render animation to MP4."""
        Logger.info(f"Rendering {task_name}...")

        filepath = os.path.join(Config.OUTPUT_PATHS["videos"], filename)

        scene = bpy.context.scene
        scene.render.image_settings.file_format = 'FFMPEG'
        scene.render.ffmpeg.format = 'MPEG4'
        scene.render.ffmpeg.codec = 'H264'
        scene.render.ffmpeg.constant_rate_factor = 'HIGH'
        scene.render.ffmpeg.ffmpeg_preset = 'GOOD'
        scene.render.ffmpeg.gopsize = 18
        scene.render.ffmpeg.audio_codec = 'NONE'
        scene.render.filepath = filepath.replace('.mp4', '')

        bpy.ops.render.render(animation=True)

        Logger.success(f"Exported: {filepath}")
        return filepath

    @staticmethod
    def render_still(filename, resolution=(2400, 800)):
        """Render high-res still image."""
        Logger.info(f"Rendering still: {filename}")

        filepath = os.path.join(Config.OUTPUT_PATHS["images"], filename)

        scene = bpy.context.scene
        scene.render.image_settings.file_format = 'PNG'
        scene.render.image_settings.color_mode = 'RGBA'
        scene.render.resolution_x = resolution[0]
        scene.render.resolution_y = resolution[1]
        scene.render.film_transparent = True
        scene.render.filepath = filepath
        scene.frame_set(1)

        bpy.ops.render.render(write_still=True)

        # Reset for video
        scene.render.resolution_x = Config.RENDER["resolution_x"]
        scene.render.resolution_y = Config.RENDER["resolution_y"]
        scene.render.film_transparent = False

        Logger.success(f"Exported: {filepath}")
        return filepath


# =============================================================================
# MAIN PIPELINE
# =============================================================================

def main():
    """Execute the complete logo animation pipeline."""

    Logger.header("VURMZ LOGO ANIMATION PIPELINE v2.0")

    try:
        # Setup
        SceneManager.clear_scene()
        SceneManager.ensure_directories()
        SceneManager.setup_render_settings()

        # Build logo
        builder = LogoBuilder()
        logo = builder.import_and_build()

        # Setup scene
        lighting = LightingRig()
        lighting.setup()

        camera = CameraSetup()
        camera.setup()

        # Initialize animator
        animator = Animator(logo)

        # Export static GLB
        Exporter.export_glb(logo, "vurmz-logo-3d.glb")

        # Render animations
        Logger.header("RENDERING ANIMATIONS")

        # 1. Spin
        animator.create_spin()
        Exporter.render_animation("vurmz-logo-spin.mp4", "spin animation")

        # 2. Pulse
        animator.create_pulse()
        Exporter.render_animation("vurmz-logo-pulse.mp4", "pulse animation")

        # 3. Water
        water_plane = animator.create_water_reflection()
        Exporter.render_animation("vurmz-logo-water.mp4", "water animation")

        # Remove water plane
        bpy.data.objects.remove(water_plane, do_unlink=True)

        # 4. Hero still
        animator.clear_animation()
        logo.location = (0, 0, 0)
        logo.rotation_euler = (0, 0, 0)
        logo.scale = (1, 1, 1)
        Exporter.render_still("vurmz-logo-3d-render.png")

        # Summary
        Logger.header("PIPELINE COMPLETE")
        Logger.success("All assets generated successfully!")
        print(f"""
    Outputs:
      - {Config.OUTPUT_PATHS['models']}/vurmz-logo-3d.glb
      - {Config.OUTPUT_PATHS['videos']}/vurmz-logo-spin.mp4
      - {Config.OUTPUT_PATHS['videos']}/vurmz-logo-pulse.mp4
      - {Config.OUTPUT_PATHS['videos']}/vurmz-logo-water.mp4
      - {Config.OUTPUT_PATHS['images']}/vurmz-logo-3d-render.png
        """)

    except Exception as e:
        Logger.error(f"Pipeline failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
